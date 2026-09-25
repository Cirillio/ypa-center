/* ===== Событие (анонимная покупка мест, без ребёнка и без входа) ===== */
const evDate = (off, t) => { const d = new Date(); d.setDate(d.getDate() + off); const [h, m] = t.split(':').map(Number); d.setHours(h, m, 0, 0); return d }
const fmtDate = (d) => { const s = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' }).format(d); return s[0].toUpperCase() + s.slice(1) }
const fmtTime = (d) => new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(d)
const EVENTS = [
  { id: 1, title: 'Мастер-класс по лепке из глины', img: 'event-1.jpeg', when: evDate(3, '11:00'), dur: '90 мин', age: '5–10 лет', price: 500, max: 12, left: 7, short: 'Лепим посуду и фигурки, обжигать не нужно — всё забираем домой.', full: 'Ребята познакомятся с глиной, слепят чашку и любимого героя и раскрасят работу. Материалы и фартуки выдаём на месте. Родители могут остаться в зале или подождать в зоне отдыха.' },
  { id: 2, title: 'Театральные игры для всей семьи', img: 'event-2.jpg', when: evDate(6, '12:00'), dur: '60 мин', age: 'от 4 лет', price: 0, max: 30, left: 3, short: 'Разминка голоса, импровизация и мини-спектакль вместе с родителями.', full: 'Открытое занятие театральной студии: ведущий показывает, как игра помогает раскрепоститься. В финале — мини-спектакль, где родители тоже получают роли.' },
  { id: 3, title: 'Научное шоу «Химия чудес»', img: 'event-3.jpg', when: evDate(10, '15:00'), dur: '75 мин', age: '6–12 лет', price: 800, max: 20, left: 14, short: 'Безопасные опыты: вулкан, «слоновья зубная паста», светящиеся жидкости.', full: 'Ведущий-химик проведёт серию безопасных опытов, а ребята сами примут участие в нескольких из них в защитных очках. В конце — разбор «как это работает» на понятном языке.' },
  { id: 4, title: 'Лекция для родителей «Как учить с удовольствием»', img: 'event-4.jpg', when: evDate(14, '18:30'), dur: '90 мин', age: '18+', price: 300, max: 25, left: 0, short: 'Практика мотивации ребёнка без давления и споров об уроках.', full: 'Разбираем типичные конфликты вокруг учёбы и конкретные приёмы, которые работают в разном возрасте. Ответы на вопросы в конце.' },
]
const S = { ev: null, seats: 1, touched: {} }
const ev = () => EVENTS.find((e) => e.id === S.ev)
const priceOf = (e) => (e.price ? rub(e.price) : 'Бесплатно')
const F = () => document.forms.contacts
const val = (n) => F().elements[n].value.trim()
const checks = {
  name: () => val('name').length >= 2 || 'Введите имя',
  phone: () => val('phone').replace(/\D/g, '').length === 11 || 'Введите номер полностью',
  email: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email')) || 'Проверьте адрес почты',
}
const contactsOk = () => Object.values(checks).every((f) => f() === true) && F().elements.consent.checked
const isReady = () => !!(S.ev && ev().left > 0 && contactsOk())
const total = () => (S.ev ? ev().price * S.seats : 0)

function renderEvents() {
  $('#events').innerHTML = EVENTS.map((e) => {
    const on = e.id === S.ev, out = e.left === 0
    return `<button type="button" role="radio" aria-checked="${on}" ${out ? 'disabled' : ''} data-ev="${e.id}" class="bg-default flex flex-col gap-3 rounded-lg p-2 text-start ring-2 transition-all duration-200 sm:flex-row ${out ? 'cursor-not-allowed opacity-55 ring-transparent' : on ? 'ring-primary' : 'hover:ring-primary/50 ring-transparent'}">
      <div class="aspect-video w-full shrink-0 overflow-hidden rounded-xs sm:aspect-square sm:w-36"><img src="../frontend-core/public/moke/${e.img}" alt="" class="h-full w-full object-cover" /></div>
      <div class="flex min-w-0 flex-1 flex-col justify-between gap-2 py-0.5 pr-1">
        <div class="flex flex-col gap-1"><div class="flex items-start justify-between gap-2"><span class="text-primary text-lg leading-tight font-bold">${e.title}</span>${out ? '' : ic(on ? 'check-circle' : 'circle', `mt-0.5 shrink-0 text-xl ${on ? 'text-primary' : 'text-primary/40'}`)}</div>
          <p class="text-muted line-clamp-2 text-sm leading-snug">${e.short}</p></div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-bold">
          <span class="text-default/80 flex items-center gap-1.5">${ic('calendar-blank', 'text-primary/70 text-base')}${fmtDate(e.when)} · ${fmtTime(e.when)}</span>
          <span class="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 ${e.left === 0 ? 'text-ink/60' : capColor(e.left)}">${ic('users', 'text-base')}${out ? 'Мест нет' : `Мест: ${e.left}/${e.max}`}</span>
          <span class="text-primary ml-auto text-base ${e.price ? '' : 'text-secondary!'}">${priceOf(e)}</span></div></div></button>`
  }).join('')
}

function renderAbout() {
  const e = ev()
  if (!e) { $('#about').innerHTML = `<div class="flex flex-col items-center gap-2 py-8 text-center">${ic('ticket', 'text-ink/15 text-6xl')}<p class="text-muted text-sm italic">Выберите событие — здесь появятся подробности</p></div>`; return }
  const pct = Math.round(((e.max - e.left) / e.max) * 100)
  const fact = (i, l, v) => `<div class="bg-default flex items-center gap-3 rounded-lg px-4 py-3"><span class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2">${ic(i, 'text-xl')}</span><div class="grid"><span class="text-muted text-xs font-semibold">${l}</span><span class="text-default text-base leading-tight font-bold">${v}</span></div></div>`
  $('#about').innerHTML = `<div class="fade-in flex flex-col gap-4">
    <div class="aspect-[16/7] w-full overflow-hidden rounded-lg"><img src="../frontend-core/public/moke/${e.img}" alt="" class="h-full w-full object-cover" /></div>
    <div class="flex flex-col gap-2"><h3 class="text-default text-2xl leading-tight font-bold">${e.title}</h3><p class="text-default/85 text-base leading-relaxed">${e.full}</p></div>
    <div class="grid gap-2 sm:grid-cols-2">${fact('calendar-blank', 'Дата и время', `${fmtDate(e.when)} · ${fmtTime(e.when)}`)}${fact('timer', 'Длительность', e.dur)}${fact('baby', 'Возраст', e.age)}${fact('map-pin', 'Где', 'г. Новосибирск, ул. Ильича, 23')}</div>
    <div class="flex flex-col gap-1.5"><div class="flex justify-between text-sm font-semibold"><span class="text-muted">Заполненность</span><span class="${capColor(e.left)}">Свободно ${e.left} из ${e.max}</span></div>
      <div class="bg-default h-2 overflow-hidden rounded-full"><div class="bg-primary h-full rounded-full transition-all duration-500" style="width:${pct}%"></div></div></div></div>`
}

function renderSummary() {
  const e = ev(), free = e && !e.price
  $('#s-ev').innerHTML = e
    ? `<div class="bg-default flex items-center gap-3 rounded-lg p-2"><img src="../frontend-core/public/moke/${e.img}" alt="" class="size-14 shrink-0 rounded-xs object-cover" /><div class="grid min-w-0"><span class="text-default truncate text-base leading-tight font-bold">${e.title}</span><span class="text-muted text-sm leading-tight">${fmtDate(e.when)} · ${fmtTime(e.when)}</span></div></div>`
    : `<div class="text-muted bg-default flex items-center gap-3 rounded-lg px-4 py-3 text-sm italic">${ic('ticket', 'text-ink/25 text-2xl')}Событие не выбрано</div>`
  $('#seat-n').textContent = S.seats
  $('#seat-minus').disabled = S.seats <= 1
  $('#seat-plus').disabled = !e || S.seats >= e.left
  ;['seat-minus', 'seat-plus'].forEach((id) => { const b = $('#' + id); b.classList.toggle('opacity-35', b.disabled); b.classList.toggle('cursor-not-allowed', b.disabled) })
  $('#seat-hint').textContent = e ? `Свободно: ${e.left}` : 'Сначала выберите событие'
  $('#s-price').innerHTML = priceBox('К оплате', !e ? '—' : free ? 'Бесплатно' : rub(total()), e && !free ? `<span class="text-muted pb-0.5 text-xs font-semibold">${rub(e.price)} × ${S.seats}</span>` : e ? `<span class="text-muted pb-0.5 text-xs font-semibold">мест: ${S.seats}</span>` : '')
  const miss = [!e && 'событие', !contactsOk() && 'контакты'].filter(Boolean)
  $('#s-cta').innerHTML = ctaBtn('s-go', isReady(), free ? 'Записаться' : 'Продолжить', free ? 'check' : 'arrow-right') + (isReady() ? '' : `<p class="text-muted text-center text-xs">Осталось: ${miss.join(', ')}</p>`)
  $('#s-note').innerHTML = free ? `${ic('info', 'mt-px text-base')}Событие бесплатное — оплата не нужна, места закрепим сразу.` : `${ic('lock-simple', 'mt-px text-base')}Оплата через ЮKassa. После нажатия места держим за вами 30 минут. Входить в кабинет не нужно.`
  Bar.set({ amount: !e ? '—' : free ? 'Бесплатно' : rub(total()), ready: isReady(), btn: free ? 'Записаться' : 'Продолжить' })
}

function showErrors() {
  Object.keys(checks).forEach((n) => {
    const r = checks[n](), el = $(`[data-err=${n}]`), inp = F().elements[n], bad = S.touched[n] && r !== true
    el.innerHTML = bad ? `<span class="text-error flex items-start gap-1.5 text-sm font-medium">${ic('warning-circle', 'mt-0.5 text-base')}${r}</span>` : ''
    inp.classList.toggle('ring-2', !!bad); inp.classList.toggle('ring-error', !!bad)
  })
}

function openPay() {
  const e = ev(), free = !e.price, n = S.seats
  Pay.open({
    icon: 'ticket', tint: 'bg-fuchsia-500/5 text-fuchsia-500', kicker: 'Мероприятие', title: e.title,
    rows: [['Дата и время', `${fmtDate(e.when)} · ${fmtTime(e.when)}`], ['Мест', String(n)], ['Контакт', `${val('name')} · ${val('phone')}`]], amount: total(),
    successText: `${free ? 'Вы записаны' : 'Места забронированы'}: ${n} ${plural(n, ['место', 'места', 'мест'])}. Подтверждение отправим на ${val('email')}.`,
    successActions: `<button type="button" data-close data-reset class="bg-primary flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-base font-bold text-white">К списку событий</button>`,
  })
  if (free) Pay.setState('success')
}

function update() { renderEvents(); renderAbout(); renderSummary(); showErrors() }
function setVals(o) { Object.entries(o).forEach(([k, v]) => { const i = F().elements[k]; i.type === 'checkbox' ? (i.checked = v) : (i.value = v) }) }
function reset() { S.ev = null; S.seats = 1; S.touched = {}; F().reset(); update() }
function fill() { S.ev = 1; S.seats = 2; S.touched = {}; setVals({ name: 'Мария Иванова', phone: '+7 (913) 452-60-39', email: 'maria@example.ru', consent: true }); update() }

$('#events').addEventListener('click', (e) => { const b = e.target.closest('[data-ev]'); if (!b) return; S.ev = Number(b.dataset.ev); S.seats = Math.min(S.seats, ev().left); update() })
$('#seat-minus').addEventListener('click', () => { S.seats = Math.max(1, S.seats - 1); update() })
$('#seat-plus').addEventListener('click', () => { if (ev() && S.seats < ev().left) S.seats++; update() })
F().addEventListener('input', (e) => {
  if (e.target.name === 'phone') { let d = e.target.value.replace(/\D/g, ''); if (d[0] === '8' || d[0] === '7') d = d.slice(1); d = d.slice(0, 10); const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)]; e.target.value = d ? `+7 (${p[0]}${p[0].length === 3 ? ')' : ''}${p[1] ? ' ' + p[1] : ''}${p[2] ? '-' + p[2] : ''}${p[3] ? '-' + p[3] : ''}` : '' }
  if (S.touched[e.target.name]) showErrors(); renderSummary()
})
F().addEventListener('focusout', (e) => { if (e.target.name in checks) { S.touched[e.target.name] = true; showErrors() } })
F().addEventListener('change', renderSummary)
$('#summary-box').addEventListener('click', (e) => { if (e.target.closest('#s-go') && isReady()) openPay() })
Pay.init(); Pay.onReset = reset
wireDev({ reset, fill, openPay, isReady })
update()
