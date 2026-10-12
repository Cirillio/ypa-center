/* ===== Абонемент ===== */
const TRIAL_PRICE = 1200
const TIERS = [{ lessons: 4, price: 4000 }, { lessons: 8, price: 7000 }, { lessons: 12, price: 10000 }, { lessons: 16, price: 11000 }, { lessons: 20, price: 12000 }, { lessons: null, price: 15000, label: 'Безлимит' }]
const TH = {
  rose: { bg: 'bg-rose-50', ring: 'ring-rose-400', title: 'text-rose-700', dot: 'bg-rose-400' },
  emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-400', title: 'text-emerald-700', dot: 'bg-emerald-400' },
  violet: { bg: 'bg-violet-50', ring: 'ring-violet-400', title: 'text-violet-700', dot: 'bg-violet-400' },
  sky: { bg: 'bg-sky-50', ring: 'ring-sky-400', title: 'text-sky-700', dot: 'bg-sky-400' },
  amber: { bg: 'bg-amber-50', ring: 'ring-amber-400', title: 'text-amber-700', dot: 'bg-amber-400' },
  indigo: { bg: 'bg-indigo-50', ring: 'ring-indigo-400', title: 'text-indigo-700', dot: 'bg-indigo-400' },
}
const ACT = { chess: ['Шахматы', 'rose'], robo: ['Робототехника', 'sky'], eng: ['Английский', 'emerald'], draw: ['Рисование', 'amber'], theatre: ['Театральная студия', 'violet'], logic: ['Развитие логики', 'indigo'] }
// [id, день 0=Пн, кружок, начало, конец, группа, вместимость, свободно]
const RAW = [
  [1, 0, 'chess', '16:00', '17:00', 'Мини, 5–7 лет', 8, 5], [2, 0, 'robo', '17:30', '18:30', 'Средняя, 8–10 лет', 8, 2], [3, 0, 'eng', '15:00', '16:00', 'Мини, 5–7 лет', 6, 4],
  [4, 1, 'draw', '16:00', '17:00', 'Мини, 4–6 лет', 10, 7], [5, 1, 'theatre', '17:30', '18:30', 'Старшая, 8–12 лет', 10, 3], [6, 1, 'logic', '15:00', '15:45', 'Мини, 4–6 лет', 8, 6],
  [7, 2, 'chess', '16:00', '17:00', 'Старшая, 8–12 лет', 8, 1], [8, 2, 'eng', '17:00', '18:00', 'Средняя, 8–10 лет', 6, 0], [9, 2, 'robo', '16:30', '17:30', 'Мини, 6–8 лет', 8, 4],
  [10, 3, 'draw', '16:30', '17:30', 'Средняя, 7–9 лет', 10, 6], [11, 3, 'logic', '16:00', '16:45', 'Мини, 5–7 лет', 8, 5], [12, 3, 'theatre', '18:00', '19:00', 'Мини, 6–9 лет', 10, 8],
  [13, 4, 'eng', '15:30', '16:30', 'Старшая, 9–12 лет', 6, 3], [14, 4, 'robo', '17:00', '18:00', 'Старшая, 10–14 лет', 8, 5], [15, 4, 'chess', '17:00', '18:00', 'Мини, 5–7 лет', 8, 2],
  [16, 5, 'draw', '11:00', '12:00', 'Все возрасты', 10, 6], [17, 5, 'robo', '12:30', '13:30', 'Мини, 6–8 лет', 8, 4], [18, 5, 'theatre', '11:00', '12:00', 'Средняя, 7–10 лет', 10, 5], [19, 5, 'chess', '13:00', '14:00', 'Старшая, 8–12 лет', 8, 6],
]
const SLOTS = RAW.map(([id, dow, a, s, e, group, max, avail]) => ({ id, dow, act: a, name: ACT[a][0], th: TH[ACT[a][1]], start: s, end: e, group, max, avail }))
const availOf = (s) => (week === 0 ? s.avail : Math.max(0, s.avail - ((s.id + week) % 3)))
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

let week = 0, day = (new Date().getDay() + 6) % 7
if (day === 6) day = 0
const picked = new Set()
const list = () => SLOTS.filter((s) => picked.has(s.id)).sort((a, b) => a.dow - b.dow || mins(a.start) - mins(b.start))
const lessons = () => picked.size * 4
const tierIdx = () => { const t = lessons(); if (!t) return -1; const i = TIERS.findIndex((x) => x.lessons === null || x.lessons >= t); return i === -1 ? TIERS.length - 1 : i }
const tier = () => TIERS[tierIdx()] || null
const tierName = (t) => (t.label || `${t.lessons} ${plural(t.lessons, ['занятие', 'занятия', 'занятий'])}`)
const isReady = () => picked.size > 0 && !!Kids.get()
const conflicts = () => { const l = list(), out = []; for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) if (l[i].dow === l[j].dow && mins(l[i].start) < mins(l[j].end) && mins(l[j].start) < mins(l[i].end)) out.push([l[i], l[j]]); return out }

function weekRange(w) {
  const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + w * 7); const e = new Date(d); e.setDate(e.getDate() + 6)
  const f = (x, m) => new Intl.DateTimeFormat('ru-RU', m ? { day: 'numeric', month: 'long' } : { day: 'numeric' }).format(x)
  return d.getMonth() === e.getMonth() ? `${f(d)}–${f(e, 1)}` : `${f(d, 1)} – ${f(e, 1)}`
}

function renderTop() {
  $('#week').innerHTML = `<button type="button" data-w="-1" ${week === 0 ? 'disabled' : ''} aria-label="Предыдущая неделя" class="flex size-8 items-center justify-center rounded-full ${week === 0 ? 'text-ink/25 cursor-not-allowed' : 'hover:bg-white'}">${ic('caret-left')}</button>
    <span class="min-w-32 px-1 text-center text-sm font-bold">${weekRange(week)}</span>
    <button type="button" data-w="1" ${week === 3 ? 'disabled' : ''} aria-label="Следующая неделя" class="flex size-8 items-center justify-center rounded-full ${week === 3 ? 'text-ink/25 cursor-not-allowed' : 'hover:bg-white'}">${ic('caret-right')}</button>`
  $('#week-note').innerHTML = `Свободные места показаны на неделю <b class="text-default">${weekRange(week)}</b> и на состав абонемента не влияют. Абонемент действует <b class="text-default">месяц с первого занятия</b>: каждый кружок сам развернётся в 4 занятия.`
  $('#days').innerHTML = DAYS.map((d, i) => {
    const n = SLOTS.filter((s) => s.dow === i && picked.has(s.id)).length, on = i === day
    return `<button type="button" role="tab" aria-selected="${on}" data-day="${i}" class="relative flex min-w-16 flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-lg font-bold uppercase transition-colors ${on ? 'bg-primary text-white' : 'bg-default hover:bg-primary/10 hover:text-primary'}">${d}${n ? `<span class="flex size-5 items-center justify-center rounded-full text-xs ${on ? 'bg-white text-primary' : 'bg-secondary text-white'}">${n}</span>` : ''}</button>`
  }).join('')
  const cf = conflicts()
  $('#conflict').innerHTML = cf.length ? `<div class="flex items-start gap-2 rounded-sm bg-amber-500/10 px-4 py-3 text-sm text-amber-800" role="alert">${ic('warning', 'mt-0.5 text-lg text-amber-600')}<span><b>Занятия пересекаются по времени:</b> ${cf.map(([a, b]) => `${a.name} и ${b.name} (${DAYS[a.dow]} ${a.start})`).join('; ')}. Проверьте, что ребёнок успеет.</span></div>` : ''
}

function renderSlots() {
  const l = SLOTS.filter((s) => s.dow === day).sort((a, b) => mins(a.start) - mins(b.start))
  if (!l.length) { $('#slots').innerHTML = `<div class="bg-default flex aspect-[5/2] flex-col items-center justify-center gap-1.5 rounded-lg">${ic('coffee', 'text-ink/30 text-4xl')}<span class="text-ink/40 font-semibold">Выходной</span></div>`; return }
  $('#slots').innerHTML = `<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">${l.map((s) => {
    const a = availOf(s), on = picked.has(s.id), full = a === 0
    return `<button type="button" aria-pressed="${on}" ${full ? 'disabled' : ''} data-slot="${s.id}" class="group flex aspect-[5/3] flex-col items-start rounded-sm p-2.5 text-start transition-all duration-200 md:px-4 md:py-3 ${s.th.bg} ${s.th.ring} ${full ? 'cursor-not-allowed opacity-50' : on ? 'ring-2' : 'ring-0 hover:contrast-95'}">
      <div class="flex flex-col"><span class="line-clamp-2 text-base leading-tight font-extrabold md:text-xl ${s.th.title}">${s.name}</span><span class="text-default/95 line-clamp-1 text-xs font-semibold lg:text-sm">${s.group}</span></div>
      <div class="mt-auto flex w-full flex-col gap-0.5"><span class="text-default/85 font-bold lg:text-base">${s.start}–${s.end}</span>
        <div class="flex items-center justify-between gap-1"><span class="flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-xs font-bold lg:px-2 lg:py-1 lg:text-sm ${full ? 'text-ink/60' : capColor(a)}">${ic('users', 'text-base')}${full ? 'Мест нет' : `${a}/${s.max}`}</span>
          <span class="flex size-5 items-center justify-center rounded-xs bg-white ring-2 md:size-6 ${s.th.ring} ${s.th.title}">${on ? ic('check', 'text-base') : ''}</span></div></div></button>`
  }).join('')}</div>`
}

function renderTiers() {
  const ci = tierIdx(), t = lessons()
  $('#tiers').innerHTML = TIERS.map((x, i) => {
    const on = i === ci, per = x.lessons ? rub(Math.round(x.price / x.lessons)) : ''
    return `<div class="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 ring-2 transition-all ${on ? 'bg-primary/5 ring-primary' : 'bg-default ring-transparent'}">
      <span class="text-sm font-bold ${on ? 'text-primary' : 'text-default'}">${x.lessons ? x.lessons + ' зан.' : 'Безлимит'}</span>
      <span class="text-lg leading-tight font-extrabold ${on ? 'text-primary' : 'text-default'}">${rub(x.price)}</span>
      <span class="text-muted text-xs">${per ? per + '/зан.' : 'при 6+ кружках'}</span></div>`
  }).join('')
  const nx = TIERS[ci + 1]
  $('#tier-next').innerHTML = !t
    ? `<p class="text-muted flex items-center gap-2 text-sm italic">${ic('hand-pointing', 'text-lg')}Выберите кружки — тариф определится автоматически</p>`
    : !nx ? `<p class="text-secondary flex items-center gap-2 text-sm font-bold">${ic('crown-simple', 'text-lg')}Максимальная выгода — безлимитный абонемент</p>`
    : `<p class="text-default flex items-center gap-2 text-sm font-semibold">${ic('trend-up', 'text-secondary text-lg')}Ещё 1 кружок → <b>${tierName(nx)}</b> за <b>${rub(nx.price)}</b>${nx.lessons ? ` (≈ ${rub(Math.round(nx.price / nx.lessons))} за занятие)` : ''}</p>`
}

function renderSummary() {
  const l = list(), t = tier(), k = Kids.get()
  $('#s-count').textContent = l.length
  $('#s-count').classList.toggle('hidden', !l.length)
  $('#s-list').innerHTML = l.length
    ? `<div class="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-0.5">${l.map((s) => `<div class="bg-default group flex items-center gap-3 rounded-sm py-2 pr-2 pl-3"><span class="size-2.5 shrink-0 rounded-full ${s.th.dot}"></span>
        <div class="flex min-w-0 flex-1 flex-col"><span class="text-default truncate text-sm leading-tight font-bold">${s.name}</span><span class="text-muted text-xs font-semibold">${DAYS[s.dow]} · ${s.start}–${s.end}</span></div>
        <button type="button" data-rm="${s.id}" aria-label="Убрать ${s.name} из абонемента" class="text-ink/30 hover:text-error rounded-xs p-1 transition-colors">${ic('x', 'text-lg')}</button></div>`).join('')}</div>`
    : `<div class="flex flex-col items-center gap-1 py-4 text-center">${ic('basket', 'text-ink/15 text-5xl')}<span class="text-muted text-sm italic">Пока ничего не выбрано</span></div>`
  $('#s-rows').innerHTML = sumRow('Занятий в месяц', l.length ? String(lessons()) : '') + sumRow('Тариф', t && tierName(t)) + sumRow('Действует', l.length ? 'месяц с 1-го занятия' : '', '—')
  const per = t && lessons() ? Math.round(t.price / lessons()) : 0, save = t ? TRIAL_PRICE * lessons() - t.price : 0
  $('#s-price').innerHTML = priceBox('Итого в месяц', t ? rub(t.price) : '—', per ? `<div class="flex flex-col items-end gap-0.5"><span class="text-muted text-xs font-semibold">за занятие</span><span class="text-ink/70 text-lg font-bold">≈ ${rub(per)}</span></div>` : '')
  $('#s-save').innerHTML = save > 0 ? `<div class="flex items-center gap-1.5">${ic('piggy-bank', 'text-secondary text-base')}<span class="text-ink/70 text-xs font-semibold">Экономия к разовым занятиям: <span class="text-secondary font-bold">${rub(save)}/мес</span></span></div>` : ''
  const miss = [!l.length && 'кружки', !k && 'ребёнка'].filter(Boolean)
  $('#s-cta').innerHTML = ctaBtn('s-go', isReady(), 'Продолжить') + (isReady() ? '' : `<p class="text-muted text-center text-xs">Осталось выбрать: ${miss.join(', ')}</p>`)
  Bar.set({ amount: t ? rub(t.price) : '—', label: 'Итого в месяц', ready: isReady() })
}

function openPay() {
  const l = list(), t = tier(), k = Kids.get()
  Pay.open({
    icon: 'star', tint: 'bg-rose-500/5 text-rose-500', kicker: 'Абонемент', title: `${l.length} ${plural(l.length, ['кружок', 'кружка', 'кружков'])} · ${tierName(t)}`,
    rows: [['Участник', k.name], ['Кружки', l.map((s) => s.name).join(', ')], ['Занятий в месяц', String(lessons())], ['Срок', 'месяц с первого занятия']], amount: t.price,
    successText: `Абонемент для ${k.name} активен. Расписание занятий — в личном кабинете, напоминания придут на почту.`,
    successActions: `<a href="#" class="bg-primary flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-base font-bold text-white">В личный кабинет</a><button type="button" data-close data-reset class="bg-default text-default flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-base font-bold">Собрать ещё</button>`,
  })
}

function update() { renderTop(); renderSlots(); renderTiers(); renderSummary() }
function reset() { picked.clear(); Kids.selected = null; Kids.adding = false; Kids.render(); update() }
function fill() { picked.clear(); [1, 9, 12, 14].forEach((i) => picked.add(i)); Kids.selected = 1; Kids.render(); update() }

document.addEventListener('click', (e) => {
  const w = e.target.closest('[data-w]'); if (w && !w.disabled) { week += Number(w.dataset.w); update() }
  const d = e.target.closest('[data-day]'); if (d) { day = Number(d.dataset.day); update() }
  const s = e.target.closest('[data-slot]'); if (s && !s.disabled) { const id = Number(s.dataset.slot); picked.has(id) ? picked.delete(id) : picked.add(id); update() }
  const r = e.target.closest('[data-rm]'); if (r) { picked.delete(Number(r.dataset.rm)); update() }
  if (e.target.closest('#s-go') && isReady()) openPay()
})
Kids.mount($('#kids'), renderSummary)
Pay.init(); Pay.onReset = reset
wireDev({ reset, fill, openPay, isReady })
update()
