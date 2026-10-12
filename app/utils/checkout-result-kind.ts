import { parseQueryParam } from "~/utils/parse-query-param"
import type { CheckoutResultKind } from "~/types"

// Разбирает ?kind= из return_url; всё, кроме точного «event», – покупка.
export function parseCheckoutResultKind(
    raw: Parameters<typeof parseQueryParam>[0]
): CheckoutResultKind {
    return parseQueryParam(raw) === "event" ? "event" : "purchase"
}
