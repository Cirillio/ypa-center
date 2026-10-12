/* ===== Пробное занятие ===== */
const TRIAL_PRICE = 1200
const CLUBS = [
  { id: 'chess', title: 'Шахматы', desc: 'Логика, стратегия, терпение', age: '5–12 лет', img: 'club_1.jpg' },
  { id: 'robo', title: 'Робототехника', desc: 'Собираем и программируем роботов', age: '7–14 лет', img: 'club_2.jpg' },
  { id: 'draw', title: 'Рисование', desc: 'Краски, форма, воображение', age: '4–10 лет', img: 'club_3.jpg' },
  { id: 'eng', title: 'Английский', desc: 'Живой разговор через игру', age: '5–12 лет', img: 'club_4.jpg' },
  { id: 'logic', title: 'Развитие логики', desc: 'Головоломки и умные игры', age: '4–8 лет', img: 'club_1.jpg' },
  { id: 'theatre', title: 'Театральная студия', desc: 'Сцена, голос, уверенность', age: '6–13 лет', img: 'club_2.jpg' },
]
const GROUPS = ['Мини, 5–7 лет', 'Старшая, 8–10 лет', 'Мини, 4–6 лет', 'Средняя, 7–9 лет']
const LIMIT_USED = { 2: ['chess'] } // ребёнок 2 уже был на пробном по шахматам

const dateLabel = (off) => { const d = new Date(); d.setDate(d.getDate() + off); const s = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' }).format(d); return s[0].toUpperCase() + s.slice(1) }
const slotsOf = (club) => {
  const i = CLUBS.findIndex((c) => c.id === club)
  const times = ['14:00–15:00', '16:30–17:30', '17:00–18:00', '10:00–11:00']
  return [2, 4, 6, 9].map((off, k) => ({ id: `${club}-${k}`, date: dateLabel(off + (i % 3)), time: times[(i + k) % 4], group: GROUPS[(i + k) % 4], free: k === 2 ? 0 : [4, 2, 0, 6][(i + k) % 4] || 5, max: 6 }))
}

const S = { club: null, slot: null }
const club = () => CLUBS.find((c) => c.id === S.club)
const slot = () => (S.club ? slotsOf(S.club).find((s) => s.id === S.slot) : null)
const limitHit = () => { const k = Kids.get(); return !!(k && S.club && (LIMIT_USED[k.id] || []).includes(S.club)) }
const isReady = () => !!(S.club && S.slot && Kids.get() && !limitHit())

function renderClubs() {
  $('#clubs').innerHTML = CLUBS.map((c) => {
    const on = c.id === S.club
    return `<button type="button" role="radio" aria-checked="${on}" data-club="${c.id}" class="bg-default flex flex-col gap-2 rounded-lg p-2 text-start ring-2 transition-all duration-200 ${on ? 'ring-primary' : 'hover:ring-primary/50 ring-transparent'}">
      <div class="relative aspect-[16/10] w-full overflow-hidden rounded-xs"><img src="../frontend-core/public/moke/${c.img}" alt="" class="h-full w-full object-cover" />
        <span class="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90 ${on ? 'text-primary' : 'text-primary/40'}">${ic(on ? 'check-circle' : 'circle', 'text-xl')}</span></div>
      <div class="flex flex-col gap-0.5 px-1 pb-1"><span class="text-primary text-lg leading-tight font-bold">${c.title}</span><span class="text-muted text-sm leading-tight">${c.desc}</span>
        <span class="bg-secondary/10 text-secondary mt-1.5 w-fit rounded-full px-2.5 py-0.5 text-xs font-bold">${c.age}</span></div></button>`
  }).join('')
}

function renderSlots() {
  const box = $('#slots')
  if (!S.club) { box.innerHTML = `<div class="flex flex-col items-center gap-2 py-8 text-center">${ic('lock-simple', 'text-ink/15 text-6xl')}<p class="text-muted text-sm italic">Сначала выберите кружок</p></div>`; return }
  box.innerHTML = `<div role="radiogroup" class="grid gap-3 md:grid-cols-2">${slotsOf(S.club).map((s) => {
    const on = s.id === S.slot, full = s.free === 0
    return `<button type="button" role="radio" aria-checked="${on}" ${full ? 'disabled' : ''} data-slot="${s.id}" class="bg-default flex flex-col gap-2 rounded-lg px-4 py-3 text-start ring-2 transition-all duration-200 ${full ? 'cursor-not-allowed opacity-50 ring-transparent' : on ? 'ring-primary' : 'hover:ring-primary/50 ring-transparent'}">
      <div class="flex items-start justify-between gap-2"><div class="flex flex-col"><span class="text-primary text-xl leading-tight font-bold">${s.date}</span><span class="text-default text-lg leading-tight font-semibold">${s.time}</span></div>
        ${full ? '' : ic(on ? 'check-circle' : 'circle', `text-xl ${on ? 'text-primary' : 'text-primary/40'}`)}</div>
      <div class="flex items-center justify-between gap-2 text-sm"><span class="text-muted">${s.group}</span>
        <span class="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 font-bold ${capColor(s.free)}">${ic('users', 'text-base')}${full ? 'Мест нет' : `Мест: ${s.free}/${s.max}`}</span></div></button>`
  }).join('')}</div>`
}

function renderSummary() {
  const c = club(), s = slot(), k = Kids.get(), lim = limitHit()
  Kids.setError(lim ? `По кружку «${c.title}» у ${esc(k.name)} пробное уже было — оно доступно один раз. Выберите другой кружок или оформите абонемент.` : '')
  $('#s-rows').innerHTML = sumRow('Кружок', c && esc(c.title)) + sumRow('Дата', s && s.date) + sumRow('Время', s && s.time) + sumRow('Группа', s && s.group, '—')
  $('#s-price').innerHTML = priceBox('К оплате', rub(TRIAL_PRICE), '<span class="text-muted pb-0.5 text-xs font-semibold">разовое посещение</span>')
  const miss = [!S.club && 'кружок', S.club && !S.slot && 'время', !k && 'ребёнка'].filter(Boolean)
  $('#s-cta').innerHTML = ctaBtn('s-go', isReady(), 'Продолжить') +
    (isReady() ? '' : `<p class="text-muted text-center text-xs">${lim ? 'Выберите другой кружок или ребёнка' : 'Осталось выбрать: ' + miss.join(', ')}</p>`)
  Bar.set({ amount: rub(TRIAL_PRICE), ready: isReady() })
}

function openPay() {
  const c = club(), s = slot(), k = Kids.get()
  Pay.open({
    icon: 'calendar-dot', tint: 'bg-cyan-500/5 text-cyan-500', kicker: 'Пробное занятие', title: c.title,
    rows: [['Участник', k.name], ['Дата и время', `${s.date} · ${s.time}`], ['Группа', s.group]], amount: TRIAL_PRICE,
    successText: `${k.name} записан(а) на пробное занятие. Напомним по почте за день до визита.`,
    successActions: `<a href="#" class="bg-primary flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-base font-bold text-white">В личный кабинет</a><button type="button" data-close data-reset class="bg-default text-default flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-base font-bold">Записать ещё</button>`,
  })
}

function update() { renderClubs(); renderSlots(); renderSummary() }
function reset() { S.club = null; S.slot = null; Kids.selected = null; Kids.adding = false; Kids.render(); update() }
function fill() { S.club = 'robo'; S.slot = slotsOf('robo')[0].id; Kids.selected = 1; Kids.render(); update() }

$('#clubs').addEventListener('click', (e) => { const b = e.target.closest('[data-club]'); if (!b) return; if (S.club !== b.dataset.club) S.slot = null; S.club = b.dataset.club; update(); if (window.innerWidth >= 1024) {} })
$('#slots').addEventListener('click', (e) => { const b = e.target.closest('[data-slot]'); if (!b) return; S.slot = b.dataset.slot; update() })
$('#summary-box').addEventListener('click', (e) => { if (e.target.closest('#s-go') && isReady()) openPay() })
Kids.mount($('#kids'), renderSummary)
Pay.init(); Pay.onReset = reset
wireDev({ reset, fill, openPay, isReady })
update()
