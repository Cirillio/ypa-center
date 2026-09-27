<!--
╔══════════════════════════════════════════════════════════════════════════╗
║  PRESERVED DOCUMENT — DO NOT OVERWRITE, REGENERATE OR DELETE             ║
║                                                                          ║
║  Testing strategy for «Улица Радости» (frontend-core + ypa-center-backend)║
║  Written: 2026-09-28. File is read-only on disk (chmod 444) on purpose.  ║
║                                                                          ║
║  AI agents: you may READ this file freely. You may EDIT it only when the ║
║  owner explicitly asks to change the testing strategy. Never replace it  ║
║  with a new file, never "regenerate" it from scratch. Changes go into    ║
║  §14 "Change log" at the bottom. A new strategy = a new dated file that  ║
║  links back here.                                                        ║
║  To edit on disk: chmod u+w context/testing-strategy-2026-09.md          ║
╚══════════════════════════════════════════════════════════════════════════╝
-->

# Testing Strategy — «Улица Радости»

| Field          | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Status         | **Adopted 2026-09-28** for frontend phases 1–3; E2E still out of scope |
| Written        | 2026-09-28                                                             |
| Scope          | `frontend-core/` (Nuxt 4) and `ypa-center-backend/` (Django/DRF)       |
| Authority      | Code wins over this document. If they disagree, fix the document (§14) |
| Owner decision | Needed before Phase 1 starts (§0)                                      |

---

## 0. Read this first

1. **An owner decision blocks adoption.** `context/progress-tracker.md` records:
   _"Closed 2026-09-24: question 4 — tests are not needed for now (owner decision),
   E2E task removed from backlog."_ This document does **not** override that decision.
   It is the plan to execute **when** the owner reopens question 4. An agent must
   not start writing frontend tests on its own initiative because this file exists.
2. **Recommended trigger for reopening:** the moment real payment is wired
   (`tasks/payment-checkout.md`, step 5 of the plan). From that point a bug costs
   real money, and manual browser checks stop being enough (§3).
3. **The backend already has a strong test suite** (545 tests). The backend belongs
   to a different developer. Backend sections here are **recommendations to hand
   over**, not tasks for the frontend owner.

---

## 1. TL;DR

- **Backend:** keep the existing pytest suite. Add what is missing: a CI pipeline
  (there is none), coverage reporting, an OpenAPI contract check, and a few gap
  areas (§6.2).
- **Frontend:** today it has **zero tests**; quality is guarded only by
  `format → lint → typecheck → build` and manual browser checks. Add, in order:
    1. **Unit tests (Vitest)** for pure utilities and Zod schemas — cheap, fast,
       highest value per line. Money, redirect safety, error parsing, slot conflicts.
    2. **Service tests** with a fake `ApiFetch` — DTO → domain mapping.
    3. **`useApi` transport tests** — token refresh single-flight, 401 retry,
       `403 PROFILE_INCOMPLETE` redirect. The most complex frontend code.
    4. **Component tests** (`@nuxt/test-utils`) — only for components with real logic.
    5. **E2E (Playwright)** — 5–7 critical user journeys against the real backend
       in Docker with the payment provider stubbed.
- **Cross-repo:** a **contract check** so that a backend API change breaks the
  frontend build instead of production.
- **Not recommended now:** load testing, visual regression across the whole site,
  mutation testing. Reasons in §9.

---

## 2. System under test

### 2.1 What the product does

Website and parent account for a children's development center in Novosibirsk.

- **Public site** (SSR, indexed): home, clubs catalogue with weekly schedule,
  teachers, gallery, about, legal pages, callback and feedback forms (Cloudflare
  Turnstile).
- **Parent account** (`/login`, `/me`, client-only): passwordless login
  (email → 6-digit OTP), profile form, children, subscriptions, bookings, deposit.
- **Purchase flows** (`/enroll/trial`, `/enroll/subscription`, `/enroll/event`):
  trial lesson, monthly subscription, event seats. Payment via YooKassa
  (redirect + webhook). Event registration is anonymous.

### 2.2 Architecture that matters for testing

```
Browser ──► Nuxt 4 (SSR + client)                Django/DRF API (/api/v1/…)
            pages → composables → services ──HTTP──► views → services → ORM → PostgreSQL
                                  │ useApi()                  │           advisory locks
                                  │ JWT in localStorage       ├─ taskiq (Redis) workers + cron
                                  │ 401 → refresh → retry     └─ YooKassa HTTP gateway (port/adapter)
```

Key facts an agent must know:

| Fact                                                                                 | Consequence for tests                                                    |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Frontend services are **classes that receive `ApiFetch` in the constructor**         | Test them in plain Node with a fake fetch, no Nuxt runtime needed        |
| `app/utils/*` are pure functions (auto-imported)                                     | Plain Vitest unit tests; import explicitly by path in tests              |
| Backend errors are RFC 9457 `ProblemDetail`; frontend branches **only on `code`**    | Error-parsing tests must use `code`, never `title`/`type`                |
| Money is **kopecks** on the wire; three formatters on the frontend                   | Highest-value unit tests (a 100× bug already happened on 2026-09-24)     |
| Timezone is `Asia/Novosibirsk` (UTC+7), schedule is weekday + time, not dates        | Tests must freeze time and pin TZ; test around midnight and week edges   |
| Backend billing uses a **`SchedulePort`** and **YooKassa gateway** behind interfaces | Replace only the network transport (`httpx.MockTransport`), not our code |
| Refresh tokens rotate and are blacklisted; refresh runs under Web Locks across tabs  | Concurrency tests for `useApi`; E2E with two browser contexts            |
| `X-Idempotency-Key` (UUID v4) is required on `POST /checkout/*`                      | Frontend must send it; backend must dedupe; test both sides              |
| OTP is sent by email via a taskiq worker                                             | E2E needs a way to read the code (see §7.4)                              |

### 2.3 Risk map (what can hurt the business)

Ranked by **impact × likelihood**. Test effort should follow this order.

| #   | Risk                                                                             | Where                                                        | Impact                      |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------- |
| R1  | Wrong amount charged or shown (kopecks/rubles mix-up)                            | `format-price.ts`, services, backend billing                 | Money, trust                |
| R2  | Double charge / double booking (retry, double click, two tabs)                   | checkout composables, idempotency, backend locks             | Money, refunds              |
| R3  | Overbooking a group beyond capacity                                              | backend advisory locks, `get_slot_capacity`                  | Operations                  |
| R4  | Payment succeeded but booking not activated (lost webhook, verification failure) | `YookassaWebhookView`, `verify_and_process_payment`, sweeper | Money, support load         |
| R5  | User silently logged out, or logged out in all tabs (refresh race)               | `useApi.ts`, `auth-sync.client.ts`                           | Conversion loss             |
| R6  | Open redirect after login                                                        | `resolve-redirect.ts`                                        | Security                    |
| R7  | Personal data sent without consent (`pd_consent`)                                | forms, profile form, backend validation                      | Legal (152-FZ)              |
| R8  | Wrong lesson date (masks, cancellations, TZ, week boundary)                      | backend `get_next_lesson_date`, frontend `useSlotDate`       | Parent comes on a wrong day |
| R9  | Frontend breaks after a backend contract change                                  | `api.d.ts`, service mappers                                  | Outage                      |
| R10 | SEO / SSR regression on public pages (hydration errors, missing meta)            | pages with `ssr: true`                                       | Traffic                     |
| R11 | Accessibility regressions in forms (labels, focus, errors)                       | forms, `UPinInput`                                           | Conversion, compliance      |

---

## 3. Current state (as of 2026-09-28)

### 3.1 Backend — `ypa-center-backend/` (branch `mvp`)

| Item               | State                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Framework          | pytest + pytest-django + pytest-asyncio + factory-boy                                               |
| Size               | **545 tests collected**, ~9 400 lines, in `apps/*/tests/` and `apps/users/tests.py`                 |
| Database in tests  | Real PostgreSQL (same engine as prod) — correct choice, keep it                                     |
| Concurrency        | Present: `transaction=True` + threads/`Barrier` for locks and checkout races                        |
| External services  | YooKassa via `httpx.MockTransport` (only the wire is fake); taskiq in-memory broker                 |
| Quality gate       | `uv run python scripts/check.py` = ruff, ruff format, mypy strict, `makemigrations --check`, pytest |
| Pre-commit         | ruff + ruff-format (+ mypy) through `uv run`                                                        |
| **CI**             | **None.** No `.github/workflows` in the repo                                                        |
| **Coverage**       | **Not measured.** `pytest-cov` is not a dependency                                                  |
| Apps without tests | `catalog`, `content` (models/admin only — low risk)                                                 |

Verdict: backend testing culture is good. Main gaps are **automation (CI)** and
**visibility (coverage)**, not test design.

### 3.2 Frontend — `frontend-core/` (branch `preprod`)

| Item          | State                                                                                  |
| ------------- | -------------------------------------------------------------------------------------- |
| Test runner   | **None installed**                                                                     |
| Tests         | **0**                                                                                  |
| Quality gate  | `bun run check` = prettier check → eslint → `nuxt typecheck` → `nuxt build`            |
| CI            | `.github/workflows/ci.yml` runs the same four steps on every push                      |
| Pre-commit    | husky: `format:check && lint && typecheck`                                             |
| Manual checks | Every task is verified in the browser by hand; results logged in `progress-tracker.md` |
| a11y          | `@nuxt/a11y` (alpha) as a dev-time linter only                                         |

Verdict: strict typing catches a lot, but **nothing checks behaviour**. The
progress tracker repeatedly lists items as _"Not verified"_ (race conditions,
expired subscription cards, pagination errors, browsers without Web Locks) —
exactly the cases automated tests handle well and manual checks do not.

---

## 4. Test types and where each one lives

The pyramid below is the target shape. Numbers are rough targets for the
frontend after Phase 3, not quotas.

```
            ▲  E2E (Playwright)             5–7 journeys     slow, real stack
           ▲▲▲ Contract (OpenAPI diff)       1 CI job         cross-repo
         ▲▲▲▲▲ Component (Nuxt env)         ~15–25 tests      logic-heavy components only
      ▲▲▲▲▲▲▲▲ Service + transport         ~40 tests         fake ApiFetch / fake $fetch
  ▲▲▲▲▲▲▲▲▲▲▲▲ Unit (utils, schemas)        ~100 tests        pure functions, milliseconds
═══════════════ Static (existing)           prettier, eslint, vue-tsc, mypy, ruff
```

| Type                   | Goal                                          | Frontend tool                               | Backend tool                                    |
| ---------------------- | --------------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| Static                 | Types, style, dead code                       | vue-tsc, eslint, prettier (existing)        | mypy strict, ruff (existing)                    |
| Unit                   | Pure logic, no I/O                            | Vitest, `environment: node`                 | pytest (existing)                               |
| Service / transport    | HTTP call shape + DTO mapping + retry logic   | Vitest + fake `ApiFetch` / stubbed `$fetch` | —                                               |
| Integration (backend)  | View → service → real PostgreSQL              | —                                           | pytest-django + real Postgres (existing)        |
| Concurrency            | Locks, idempotency, token races               | Vitest with controlled promises             | `transaction=True` + threads (existing)         |
| Component              | Rendering + user interaction of one component | `@nuxt/test-utils` `mountSuspended`         | —                                               |
| Contract               | Front and back agree on the API               | `openapi-typescript` diff in CI             | drf-spectacular schema; optional Schemathesis   |
| E2E                    | Real user journey through the real stack      | Playwright                                  | backend runs in Docker as the system under test |
| Accessibility          | Labels, focus, contrast in real DOM           | `@axe-core/playwright` inside E2E           | —                                               |
| Security               | Deps, open redirect, auth rules               | `bun audit`, unit tests on redirect         | `pip-audit`, existing permission tests          |
| Performance (optional) | Page weight, LCP on public pages              | Lighthouse CI on 3 SSR pages                | —                                               |
| Manual / exploratory   | Real YooKassa test shop, real phones          | Checklist §8                                | Checklist §8                                    |

---

## 5. Frontend strategy in detail

### 5.1 Tooling

| Package                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `vitest`               | Test runner                                          |
| `@nuxt/test-utils`     | Nuxt environment, `mountSuspended`, `mockNuxtImport` |
| `@vue/test-utils`      | Required peer of `@nuxt/test-utils`                  |
| `happy-dom`            | DOM for component tests                              |
| `@playwright/test`     | E2E                                                  |
| `@axe-core/playwright` | Accessibility assertions in E2E                      |

Verify exact install commands and config against current docs before
installing (project rule: `find-docs` / Context7). As of this writing,
`@nuxt/test-utils` provides `defineVitestProject` for a two-project setup; newer
Vitest versions use `test.projects` (the older `workspace` key is deprecated).

### 5.2 Layout and naming

```
frontend-core/
  vitest.config.ts
  playwright.config.ts
  tests/
    unit/         *.spec.ts        # node environment: utils, schemas, services, useApi
    nuxt/         *.nuxt.spec.ts   # Nuxt environment: components, composables needing Nuxt
    e2e/          *.e2e.ts         # Playwright
    fixtures/     dto/*.ts         # typed DTO factories built from app/types
```

- One test file per source file, same base name:
  `app/utils/format-price.ts` → `tests/unit/utils/format-price.spec.ts`.
- `describe` = unit under test, `it` = behaviour in plain English:
  `it("rejects protocol-relative URLs and falls back to /me")`.
- Two Vitest projects: `unit` (node, fast, runs on every commit) and `nuxt`
  (Nuxt env, slower, runs in CI).

Scripts to add to `package.json`:

| Script             | Command (intent)              |
| ------------------ | ----------------------------- |
| `test`             | run both Vitest projects once |
| `test:unit`        | only the `unit` project       |
| `test:watch`       | Vitest watch mode             |
| `test:e2e`         | Playwright                    |
| `check` (extended) | existing chain **+ `test`**   |

### 5.3 Unit tests — catalogue (Phase 1)

Pure functions. No mocks. Each row is a test file; bullets are the minimum cases.

| Source file                                                                                                      | Must cover                                                                                                                                                                                                                                                                                     | Risk |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `utils/format-price.ts`                                                                                          | `kopecksToRubles` (0, 1, 99, 100, 150 050, large); `formatRub` vs `formatRubles` on the same number differ by 100×; non-breaking space in thousands; negative values (deposit debits) if supported                                                                                             | R1   |
| `utils/resolve-redirect.ts`                                                                                      | allowed: `/me`, `/enroll/trial?x=1`, trailing slash; rejected → `/me`: `https://evil`, `//evil`, `/\evil`, `/\t/evil`, `javascript:`, `/admin`, empty, `null`, number, array (first element used); hash dropped; query kept                                                                    | R6   |
| `utils/parse-error.ts`                                                                                           | `getProblem`: valid RFC 9457, missing `status`/`title` → `null`, non-object; `getProblemCode`: known code, unknown code → `undefined`, `PROFILE_INCOMPLETE` by `type` fallback; `parseApiError`: network error, `invalid_params` joined, garbage `extensions` filtered; `getActiveEnrollments` | R9   |
| `utils/find-slot-conflicts.ts`                                                                                   | no slots; same day overlap; touching intervals (`10:00–11:00` and `11:00–12:00`) are **not** a conflict; different days; three mutually overlapping slots → 3 pairs; Sunday ordering (JS `0`) sorts last                                                                                       | R8   |
| `utils/auth-tokens.ts`                                                                                           | set/get/clear round-trip; `hasTokens` with only one token; `isAccessTokenKey`; behaviour when `localStorage` throws (private mode)                                                                                                                                                             | R5   |
| `utils/pluralize.ts`                                                                                             | Russian forms: 1, 2, 5, 11, 12, 14, 21, 22, 25, 111, 0                                                                                                                                                                                                                                         | —    |
| `utils/format-event-datetime.ts`                                                                                 | pinned TZ `Asia/Novosibirsk`; date crossing midnight UTC; same-day vs multi-day events                                                                                                                                                                                                         | R8   |
| `utils/format-age-range.ts`, `get-day-name.ts`, `get-capacity-text-color.ts`, `parse-query-param.ts`, `masks.ts` | table-driven edge cases                                                                                                                                                                                                                                                                        | —    |
| `schemas/*.schema.ts`, `schemas/fields.ts`                                                                       | each field: valid, empty, boundary lengths, bad phone/email; `pd_consent` must be `true` (not just present); error messages are the Russian texts users see                                                                                                                                    | R7   |

Rule: use **table-driven tests** (`it.each`) for edge-case lists. They are
readable for humans and trivially extendable by agents.

### 5.4 Service tests (Phase 2)

Every `app/services/*.service.ts` class takes an `ApiFetch`. Test with a fake:

```ts
// Pattern, not a finished file
const calls: Array<{ path: string; opts?: unknown }> = []
const fakeFetch: ApiFetch = async <T>(path: string, opts?: unknown) => {
    calls.push({ path, opts })
    return dtoFixture as T
}
const svc = new MeService(fakeFetch)
```

For each service method assert **three things**:

1. **Request shape:** path, method, query (`limit`/`offset`, `period=all`), body.
2. **Mapping:** snake_case DTO → camelCase domain model; kopecks → the field the
   model declares; `null`/missing optional fields; enums.
3. **Errors pass through:** a thrown fetch error is not swallowed.

Priority services: `me.service.ts` (profile, children, bookings, deposit,
subscriptions, `isProfileComplete`), `plans.service.ts` (price math),
`schedule.service.ts`, `events.service.ts`, `auth.service.ts`.

DTO fixtures in `tests/fixtures/dto/` must be typed from `app/types` (the barrel),
so a regenerated `api.d.ts` that changes a DTO **breaks the fixture at compile
time** — this is a cheap first line of contract testing.

When checkout is implemented, add: **every `POST /checkout/*` sends an
`X-Idempotency-Key` that is a UUID v4, and a retry of the same order reuses the
same key** (R2).

### 5.5 Transport tests — `composables/useApi.ts` (Phase 2)

The most complex frontend code and the source of R5. Run in the `nuxt` project
(or `unit` with `mockNuxtImport` for `useRuntimeConfig`, `navigateTo`,
`useAuthStore`, `useRouter`). Stub the global `$fetch`.

| Case                                                          | Expected                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Access token present                                          | `Authorization: Bearer <access>` header added                            |
| Caller passes its own `Authorization`                         | Not overwritten                                                          |
| 401 on normal endpoint, refresh OK                            | One refresh call, original request retried **once** with new token       |
| 401 on retry as well                                          | Error thrown, no infinite loop                                           |
| **Three parallel requests get 401**                           | **Exactly one** refresh call (single-flight); all three retried          |
| 401 on `/auth/otp/…`, `/auth/token/refresh/`, `/auth/logout/` | No refresh attempt                                                       |
| 401 with no refresh token                                     | No refresh attempt, error thrown                                         |
| Refresh fails                                                 | Tokens cleared, `resetFlow()` called, navigate to `/login`, error thrown |
| Another tab already rotated (stored access ≠ stale access)    | No network refresh; stored pair used                                     |
| `navigator.locks` present                                     | Rotation runs inside `locks.request("ypa-token-refresh")`                |
| `navigator.locks` absent                                      | Still works (fallback path)                                              |
| `403` with code `PROFILE_INCOMPLETE` on `/me`                 | Navigate to `/login?redirectFrom=/me`, error still thrown                |
| Same `403` while already on `/login`                          | No navigation                                                            |

Technique for race cases: make the refresh stub return a **manually resolved
promise** (`let release; new Promise(r => release = r)`), fire the parallel
requests, assert the call count, then resolve. No timers, no sleeps.

### 5.6 Composables (Phase 2–3)

Test composables that hold **decision logic**, not those that only wrap
`useAsyncData`:

| Composable                           | What to test                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `useSubscriptionCheckout`            | tier derived from slot count; total and per-lesson price; conflicts surfaced    |
| `useTrialCheckout`                   | one slot only; price; trial-limit error mapping (`TRIAL_LIMIT_EXCEEDED`)        |
| `useEventCheckout`                   | seats within remaining capacity; free vs paid; total = price × seats            |
| `usePagedList`                       | first page, "show more" appends, stops at `count`, error on page 2 keeps page 1 |
| `useAntiSpamCooldown`, `useOptTimer` | fake timers (`vi.useFakeTimers`): countdown, resend unlocked at 0               |
| `useSlotDate`                        | next date for weekday/time in `Asia/Novosibirsk`, Sunday, after lesson start    |
| `useSubscriptionPlans`               | API failure → `app.config` fallback with the **same shape**                     |
| `useCabinetChildren`                 | delete → `409 CHILD_HAS_ACTIVE_ENROLLMENTS` exposes the enrollments list        |

### 5.7 Component tests (Phase 3)

Only components where a bug is plausible **and** not obvious in a screenshot.
Use `mountSuspended`, stub services with `mockNuxtImport` or `registerEndpoint`.

- `login/otp/Widget.vue` — **paste of a 6-digit code** fills all cells (a real
  bug fixed 2026-09-27), resend disabled during cooldown, error shown on
  `OTP_INVALID`.
- `login/profile/Widget.vue` — validation only on submit, error cleared on field
  change, focus moves to first invalid field, submit blocked without consent.
- `enroll/subscription/ConflictAlert.vue`, `SlotsWidget.vue` — conflicting pair shown.
- `enroll/SummaryCta.vue` — disabled with "Осталось выбрать: …" list.
- `enroll/event/SeatsStepper.vue` — cannot exceed remaining seats or go below 1.
- `me/parent/ChildDeleteConfirm.vue` — `409` shows enrollments instead of the
  delete button.
- `ui/ConsentCheckbox.vue` — links point to privacy and consent pages (they were
  swapped once).

Do **not** write tests that only assert static markup or Tailwind classes.

### 5.8 SSR smoke (Phase 3, cheap)

With `@nuxt/test-utils/e2e` `$fetch` (or Playwright `request`), render each SSR
route and assert: HTTP 200, non-empty `<title>`, `<meta name="description">`,
canonical URL, no `Hydration` warnings in the browser console (Playwright). Covers
R10 with ~10 lines per route.

---

## 6. Backend strategy (recommendations for the backend developer)

### 6.1 Keep as is

- Real PostgreSQL in tests. Do not switch to SQLite: advisory locks,
  `ExclusionConstraint`, and `select_for_update` do not exist there.
- The "replace only the wire" rule for YooKassa (`httpx.MockTransport`).
- Pure-function extraction from taskiq tasks (`run_payment_verification`) so the
  logic is tested without the broker.
- Thread-based race tests for checkout and locks.

### 6.2 Add

| Priority | Item                              | Why                                                                                                                                                                                                                                                                                                                       |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | **CI workflow** (GitHub Actions)  | 545 tests only protect `mvp` if they run on every PR. Service container `postgres:17-alpine` + `redis:7.4-alpine`; run `scripts/check.py`                                                                                                                                                                                 |
| P0       | **Webhook + verification matrix** | For each YooKassa status (`pending`, `waiting_for_capture`, `succeeded`, `canceled`) × (first delivery, duplicate delivery, out-of-order delivery, webhook body lies but API says otherwise) → final state of Transaction / Subscription / Enrollment. Partially exists (12 webhook mentions) — make it an explicit table |
| P1       | **Coverage** (`pytest-cov`)       | Report per app, no hard gate at first; later a floor of ~85% for `billing`, `users`, `schedule`                                                                                                                                                                                                                           |
| P1       | **Time-sensitive tests pinned**   | Freeze time (e.g. `time-machine`) for OTP expiry, 30-min event auto-release, month boundaries, week start in Novosibirsk TZ                                                                                                                                                                                               |
| P1       | **Periodic task tests**           | `sweep_billing_states`, `process_compensation_refunds`, `release_expired_event_registrations_task`, `materialize_today_lessons_task`, `purge_stale_otp_tokens_task`: idempotent when run twice, safe on empty DB                                                                                                          |
| P1       | **OpenAPI schema check**          | `manage.py spectacular --validate --fail-on-warn` in CI; commit the schema file so diffs are visible in PRs                                                                                                                                                                                                               |
| P2       | **Property-based API fuzzing**    | Schemathesis against the running API on staging: every endpoint returns documented status codes and RFC 9457 bodies, never 500                                                                                                                                                                                            |
| P2       | **Migration test**                | Apply all migrations on an empty DB and on a prod-like dump in CI before deploy                                                                                                                                                                                                                                           |
| P2       | **Dependency audit**              | `pip-audit` in CI (weekly)                                                                                                                                                                                                                                                                                                |

### 6.3 Backend test data

`seed_demo` management command already exists and is tested. Make it the single
source of the **E2E dataset** (§7.3): deterministic ids, one parent with
children/subscriptions/bookings, one active event with limited seats, one club
with a cancellation mask next week.

---

## 7. End-to-end strategy

### 7.1 Scope — critical journeys only

| ID  | Journey                                                                                                                 | Covers     |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ---------- |
| E1  | New parent: email → OTP → profile form (with consent) → lands on `/me`                                                  | R5, R7     |
| E2  | Guest opens `/enroll/subscription` → redirected to login → after login returns to the same page                         | R6         |
| E3  | Parent buys a subscription: pick child, pick slots, see conflict, fix it, pay (stubbed) → subscription visible in `/me` | R1, R2, R4 |
| E4  | Double-click "Pay" / reload during checkout → exactly one pending transaction                                           | R2         |
| E5  | Anonymous event registration within remaining seats; seat count updates                                                 | R3         |
| E6  | Two tabs: logout in tab A moves tab B to `/login`; expired access in both tabs → one refresh, both stay logged in       | R5         |
| E7  | Public pages smoke + axe scan: `/`, `/clubs`, `/about`, `/teachers`, `/gallery`                                         | R10, R11   |

Everything else is covered lower in the pyramid. Adding an E2E test requires a
reason that a lower-level test cannot cover it.

### 7.2 Environment

```
docker compose (backend repo): postgres + redis + backend + taskiq-worker
  └─ seeded with: manage.py seed_demo (deterministic)
Nuxt: production build (`nuxt build` + `node .output/server/index.mjs`), not dev server
Playwright: chromium on every PR; + webkit (iPhone viewport 375px) nightly
```

Run against a **production build**: the dev server hides SSR/hydration issues and
is slower.

### 7.3 External services in E2E

| Service                | Approach                                                                                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| YooKassa               | Never call the real API in CI. Backend points to a **local stub** that returns a `confirmation_url` back to the site; the test then posts a signed-as-expected webhook or triggers verification. The real test shop is used only in the manual checklist (§8) |
| Turnstile              | Cloudflare's documented **always-pass test site key** (the project already defaults to `1x00000000000000000000AA`) and the matching test secret on the backend                                                                                                |
| Email (OTP)            | See §7.4                                                                                                                                                                                                                                                      |
| Telegram notifications | Disabled / pointed to a stub in the E2E env                                                                                                                                                                                                                   |

### 7.4 Getting the OTP in E2E

Today a developer reads the code with `get-otp.py` (parses worker logs or reads
PostgreSQL). For automation, prefer, in this order:

1. A **test-only** backend setting that lets the E2E environment read the last
   code for an email (e.g. a management command or a debug-only endpoint that is
   **impossible to enable in production** — guarded by `ENVIRONMENT != "production"`
   and covered by a backend test proving it returns 404 in production).
2. Read the code from PostgreSQL inside the Playwright global setup (what
   `get-otp.py --db` does). Works without backend changes but couples tests to the
   DB schema.

Never weaken OTP validation (no "magic code") — that would make E2E test a path
real users never take.

### 7.5 Stability rules

- Locators: `getByRole`, `getByLabel`, `getByText` — never CSS classes (Tailwind
  classes change constantly). Add `data-testid` only where no accessible name exists.
- No `waitForTimeout`. Wait for a response (`page.waitForResponse`) or a visible state.
- Each test creates its own parent (unique email per test) — no shared mutable state.
- Traces and videos on first retry; 1 retry in CI, 0 locally. A test that needs
  retries to pass is a bug, tracked in `progress-tracker.md` tech debt.

---

## 8. Manual and exploratory testing (stays, even with automation)

Run before each release that touches payment or auth. Record the result in
`progress-tracker.md` in the existing "Verified / Not verified" style.

- [ ] Real YooKassa **test shop**: successful card, declined card, 3-DS, closing
      the payment page, paying after 1 hour (expired).
- [ ] Return URL page shows the correct state for each outcome.
- [ ] iPhone Safari: OTP autofill from the email notification, paste into the
      code field.
- [ ] Android Chrome, 375px: purchase flow without horizontal scroll.
- [ ] Browser without Web Locks (older Safari) — two tabs, token refresh.
- [ ] Keyboard-only pass through login and one purchase flow.
- [ ] Content check with real prices from the client (`content.md` §9).

---

## 9. What we deliberately do not do (now)

| Not doing                           | Why                                                                                         | Revisit when                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Snapshot tests of components        | High churn from UI iterations, low signal; they get re-approved blindly                     | Never for markup                         |
| Full-site visual regression         | Design still changing weekly; screenshots would be updated every PR                         | Design freeze; then 3–5 key screens only |
| Load testing                        | Small local business, low traffic; concurrency correctness is covered by backend race tests | Before a marketing campaign / event sale |
| Mutation testing                    | Expensive; valuable only once coverage is high                                              | Backend billing coverage > 90%           |
| Testing Nuxt UI / Reka UI internals | Third-party code                                                                            | —                                        |
| 100% coverage target                | Encourages testing trivia; follow the risk map (§2.3) instead                               | —                                        |
| Testing `api.d.ts`                  | Generated; checked by the contract job                                                      | —                                        |

---

## 10. Contract testing between the repos (R9)

The frontend types come from `bun run schema:update` (openapi-typescript against
`/api/schema/`). Today this is manual, so drift is discovered in the browser.

Proposed CI job in `frontend-core`:

1. Start the backend from the `mvp` branch (Docker), or download the committed
   schema file if the backend starts committing it (§6.2).
2. Regenerate `app/types/api.d.ts`.
3. `git diff --exit-code app/types/api.d.ts` — fail with a clear message:
   _"Backend API changed. Run `bun run schema:update`, fix type errors, commit."_
4. Run `typecheck` and the unit + service tests (typed fixtures catch mapping drift).

Run this job **nightly and on demand**, not on every push — it depends on another
repo and must not block unrelated frontend work.

---

## 11. CI pipelines (target)

### 11.1 `frontend-core/.github/workflows/ci.yml`

| Job        | Trigger                | Steps                                                                             | Blocks merge |
| ---------- | ---------------------- | --------------------------------------------------------------------------------- | ------------ |
| `static`   | every push             | format:check → lint → typecheck (existing)                                        | yes          |
| `unit`     | every push             | `test:unit` (+ `nuxt` project)                                                    | yes          |
| `build`    | every push             | `nuxt build` (existing)                                                           | yes          |
| `e2e`      | PR to `main`/`preprod` | backend via Docker + seed → build → Playwright chromium; upload traces on failure | yes          |
| `contract` | nightly + manual       | §10                                                                               | no (alerts)  |
| `e2e-full` | nightly                | chromium + webkit mobile, axe, SSR smoke                                          | no (alerts)  |

Also: pin `bun-version` to `1.3.9` instead of `latest` (matches `packageManager`;
`latest` makes CI non-reproducible).

### 11.2 `ypa-center-backend/.github/workflows/ci.yml` (to propose)

| Job      | Steps                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------- |
| `check`  | services: postgres 17, redis 7.4 → `uv sync` → `uv run python scripts/check.py` (+ coverage report) |
| `schema` | `spectacular --validate --fail-on-warn`                                                             |
| `audit`  | `pip-audit` (weekly)                                                                                |

### 11.3 Local hooks

- Frontend pre-commit (husky): add `test:unit` only — must stay under ~10 s.
  Nuxt-env and E2E tests run in CI, not in the hook.
- Backend: unchanged (`pre-commit` + `scripts/check.py --fast`).

---

## 12. Rollout plan

Each phase is independently useful. Stop after any phase if priorities change.

| Phase | Content                                                                            | Effort (junior+, part-time) | Done when                                                           |
| ----- | ---------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------- |
| 0     | Owner reopens question 4; this doc accepted                                        | —                           | Decision recorded in `progress-tracker.md`                          |
| 1     | Vitest installed, `unit` project, §5.3 catalogue, `test` in `bun run check` and CI | 2–3 days                    | All §5.3 files exist, CI green, `check` runs tests                  |
| 2     | Service tests §5.4, `useApi` §5.5, key composables §5.6                            | 3–4 days                    | Every service method has request + mapping test; all §5.5 rows pass |
| 3     | `nuxt` project, component tests §5.7, SSR smoke §5.8                               | 2–3 days                    | Listed components covered; SSR smoke in CI                          |
| 4     | Playwright + E2E env + E1, E2, E7                                                  | 3–5 days                    | Journeys green in CI on PRs, OTP retrieval solved (§7.4)            |
| 5     | E3–E6 (needs checkout implemented and a YooKassa stub on the backend)              | 3–5 days                    | Payment journeys green; E4 proves single transaction                |
| 6     | Contract job §10, nightly full E2E, backend CI proposal handed over                | 1–2 days                    | Nightly jobs run; backend PR opened by its owner                    |

**Coupling rule from Phase 1 on:** a bug fix in covered code ships with a test
that fails before the fix. A new util / service method ships with its test in the
same commit.

---

## 13. Instructions for AI coding agents

Follow these in addition to `CLAUDE.md` and `context/ai-workflow-rules.md`.

1. **Check §0 first.** If `progress-tracker.md` still says tests are not needed,
   do not add test infrastructure unless the owner asks in the current session.
2. **Pick work from the phase tables**, in order. Do not jump to E2E before unit
   tests exist.
3. **Test behaviour, not implementation.** Assert outputs, emitted events, HTTP
   calls made, and visible text — not private refs or CSS classes.
4. **Never mock our own code to make a test pass** when a lower seam exists.
   Frontend: fake `ApiFetch` / `$fetch`. Backend: fake the network transport only.
5. **Determinism is mandatory:** pin time (`vi.useFakeTimers` / `vi.setSystemTime`),
   pin timezone to `Asia/Novosibirsk`, no real network, no sleeps, no random data
   without a fixed seed.
6. **Types stay strict in tests.** No `any`, no unchecked `as`, no `!`. Build DTO
   fixtures from `app/types` so contract drift fails compilation.
7. **Money assertions use exact values in kopecks and exact formatted strings**
   (including the non-breaking space), never "contains a number".
8. **Error assertions branch on `code`**, never on `title`/`type`/`detail` text.
9. **Do not edit production code to make it testable** without saying so in the
   plan; the existing design (services with injected fetch, pure utils) already
   allows it.
10. **A failing test is information.** Do not delete, skip or loosen it to get
    green; report it with the output.
11. **Definition of done** for a test task: `bun run check` green (with tests),
    new tests fail if the covered logic is broken (quickly verify by temporarily
    breaking it once), and `progress-tracker.md` updated.
12. **Do not overwrite this file.** Propose edits; log them in §14.

---

## 14. Change log

| Date       | Change                                                                                                                                                 | By            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| 2026-09-28 | Initial version from codebase analysis                                                                                                                 | agent session |
| 2026-09-28 | Phases 1–3 executed for the frontend (`tasks/tests-stage-1.md`): 368 tests, Vitest 5, test step in `check`/CI/husky; §0 decision reopened by the owner | agent session |

## Appendix A — Sources used

- `frontend-core/CLAUDE.md`, `context/architecture.md`, `context/progress-tracker.md`,
  `context/tasks/payment-flow.md`, `nuxt.config.ts`, `package.json`, `.github/workflows/ci.yml`
- `frontend-core/app/composables/useApi.ts`, `app/utils/{resolve-redirect,parse-error,find-slot-conflicts}.ts`,
  `app/middleware/auth.ts`
- `ypa-center-backend/pyproject.toml`, `pytest.ini`, `scripts/check.py`,
  `docker-compose.yml`, `apps/billing/{ports,adapters,urls,tasks}.py`,
  `apps/billing/tests/{conftest,test_integration}.py`, `apps/schedule/ports.py`
- `pytest --collect-only` on branch `mvp`, 2026-09-28: 545 tests
