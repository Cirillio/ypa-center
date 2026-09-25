/* ===== Общие хелперы макета ===== */
const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const ic = (n, c = '') => `<i class="ph-bold ph-${n} ${c}"></i>`
const rub = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const plural = (n, [a, b, c]) => { const m = n % 10, h = n % 100; return h >= 11 && h <= 19 ? c : m === 1 ? a : m >= 2 && m <= 4 ? b : c }
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const capColor = (n) => (n === 0 ? 'text-ink/60' : n <= 3 ? 'text-amber-500' : 'text-emerald-600')

/* Заголовок виджета — как в /me */
const widgetHead = (icon, title, extra = '') =>
  `<div class="flex items-center gap-3"><div class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2">${ic(icon, 'text-xl')}</div><h2 class="text-primary text-xl font-bold">${title}</h2>${extra}</div>`

/* Строка «ключ — значение» в сводке */
const sumRow = (label, val, empty = 'не выбрано') =>
  `<div class="flex items-baseline justify-between gap-3 px-1"><dt class="text-muted shrink-0 text-sm font-medium">${label}</dt><dd class="${val ? 'text-default font-semibold' : 'text-muted italic'} min-w-0 text-end text-sm">${val || empty}</dd></div>`

/* Блок суммы (как «Итого в месяц» в корзине) */
const priceBox = (label, main, aside = '') =>
  `<div class="bg-primary/5 ring-primary/15 flex flex-wrap items-end justify-between gap-2 rounded-sm px-4 py-3 ring-2">
     <div class="flex min-w-fit flex-col gap-0.5"><span class="text-muted text-xs font-semibold">${label}</span><span class="text-primary text-3xl leading-none font-extrabold">${main}</span></div>${aside}</div>`

/* Главная кнопка сводки */
const ctaBtn = (id, ready, label, icon = 'arrow-right') =>
  `<button type="button" id="${id}" ${ready ? '' : 'disabled aria-disabled="true"'} class="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-lg font-bold transition-[filter] ${ready ? 'bg-primary text-white hover:brightness-95' : 'bg-ink/10 text-ink/45 cursor-not-allowed'}">${label}${ic(icon, 'text-xl')}</button>`

const payNote = `<p class="text-muted flex items-start gap-2 text-xs">${ic('lock-simple', 'mt-px text-base')}Оплата через ЮKassa. После нажатия места держим за вами 30 минут.</p>`

/* ===== Дети (общий пикер для пробного и абонемента) ===== */
const Kids = {
  list: [
    { id: 1, name: 'Алиса', birth: '2018-03-12' },
    { id: 2, name: 'Тимофей', birth: '2020-09-02' },
  ],
  selected: null, adding: false, error: '', onChange: () => {}, root: null,
  mount(root, onChange) { this.root = root; this.onChange = onChange; this.render(); root.addEventListener('click', (e) => this.click(e)); root.addEventListener('submit', (e) => { e.preventDefault(); this.save() }) },
  get() { return this.list.find((c) => c.id === this.selected) || null },
  select(id) { this.selected = id; this.render(); this.onChange() },
  setError(msg) { this.error = msg || ''; const el = $('[data-kid-error]', this.root); if (el) el.innerHTML = this.errorHtml() },
  errorHtml() { return this.error ? `<p class="text-error flex items-start gap-1.5 text-sm font-medium">${ic('warning-circle', 'mt-0.5 text-base')}${this.error}</p>` : '' },
  click(e) {
    const chip = e.target.closest('[data-kid]'); if (chip) return this.select(Number(chip.dataset.kid))
    if (e.target.closest('[data-kid-add]')) { this.adding = true; this.render(); $('[name=kid-name]', this.root)?.focus() }
    if (e.target.closest('[data-kid-cancel]')) { this.adding = false; this.render() }
  },
  save() {
    const name = $('[name=kid-name]', this.root).value.trim(), birth = $('[name=kid-birth]', this.root).value
    if (!name || !birth) return
    const id = Math.max(...this.list.map((c) => c.id)) + 1
    this.list.push({ id, name, birth }); this.adding = false; this.select(id)
  },
  render() {
    const chips = this.list.map((c) => {
      const on = c.id === this.selected
      return `<button type="button" role="radio" aria-checked="${on}" data-kid="${c.id}" class="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 ring-2 transition-all ${on ? 'bg-secondary/10 ring-secondary' : 'bg-secondary/5 hover:bg-secondary/10 ring-transparent'}">
        <span class="bg-secondary/15 text-secondary flex size-7 items-center justify-center rounded-full text-sm font-bold">${esc(c.name[0].toUpperCase())}</span>
        <span class="text-default text-base leading-tight font-semibold">${esc(c.name)}</span>${on ? ic('check', 'text-secondary text-sm') : ''}</button>`
    }).join('')
    const form = this.adding
      ? `<form class="flex flex-col gap-2"><input name="kid-name" maxlength="40" placeholder="Имя ребёнка" class="bg-default placeholder:text-muted w-full rounded-sm px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary" />
           <div class="flex gap-2"><input name="kid-birth" type="date" class="bg-default min-w-0 flex-1 rounded-sm px-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary" />
           <button class="bg-primary rounded-lg px-3 text-white" title="Сохранить">${ic('check')}</button>
           <button type="button" data-kid-cancel class="text-error hover:bg-error/10 rounded-lg px-3" title="Отмена">${ic('x')}</button></div></form>`
      : `<button type="button" data-kid-add class="bg-info/10 text-info hover:bg-info/15 flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors">${ic('plus')}Добавить ребёнка</button>`
    this.root.innerHTML = `<div role="radiogroup" aria-label="Ребёнок" class="flex flex-wrap gap-2">${chips}</div><div data-kid-error>${this.errorHtml()}</div>${form}`
  },
}

/* ===== Модалка оплаты ===== */
const Pay = {
  el: null, timer: null, left: 0, order: null, state: 'form', onReset: () => {}, onSuccessAgain: () => {},
  init() {
    this.el = $('#pay-modal')
    this.el.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { const r = e.target.closest('[data-reset]'); this.close(); if (r) this.onReset() }
      const g = e.target.closest('[data-goto]'); if (g) this.setState(g.dataset.goto)
      const m = e.target.closest('[data-method]'); if (m) this.setMethod(m.dataset.method)
    })
    $('#pay-submit').addEventListener('click', () => { this.setState('checking'); setTimeout(() => this.state === 'checking' && this.setState('success'), 1600) })
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ['success', 'failed', 'expired'].includes(this.state)) this.close() })
  },
  open(order) {
    this.order = order; this.left = 30 * 60 - 19
    $('#pay-order').innerHTML = `
      <div class="flex items-center gap-3"><span class="flex shrink-0 items-center justify-center rounded-full p-2 ${order.tint}">${ic(order.icon, 'text-xl')}</span>
        <div class="grid min-w-0"><span class="text-default/75 text-base leading-tight">${order.kicker}</span><span class="text-default truncate text-lg leading-tight font-semibold">${esc(order.title)}</span></div></div>
      <div class="bg-ink/15 h-px"></div>
      <dl class="flex flex-col gap-2">${order.rows.map(([l, v]) => sumRow(l, esc(v))).join('')}
        <div class="flex items-baseline justify-between gap-3 px-1 pt-1"><dt class="text-default text-base font-bold">К оплате</dt><dd class="text-primary text-2xl font-extrabold">${rub(order.amount)}</dd></div></dl>`
    $$('[data-pay-amount]').forEach((n) => (n.textContent = rub(order.amount)))
    $('#page').inert = true; $('#page').setAttribute('aria-busy', 'true')
    this.el.classList.remove('hidden'); this.el.classList.add('flex'); document.body.style.overflow = 'hidden'
    this.setMethod('card'); this.setState('form'); this.tick(); clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 1000)
  },
  tick() {
    this.left = Math.max(0, this.left - (this.timer ? 1 : 0))
    const m = String(Math.floor(this.left / 60)).padStart(2, '0'), s = String(this.left % 60).padStart(2, '0')
    $('#pay-timer-val').textContent = `${m}:${s}`
    if (this.left === 0 && ['form', 'failed'].includes(this.state)) this.setState('expired')
  },
  setMethod(m) {
    $$('.method-tab').forEach((b) => { const on = b.dataset.method === m; b.setAttribute('aria-selected', on); b.classList.toggle('bg-primary/10', on); b.classList.toggle('text-primary', on); b.classList.toggle('bg-default', !on); b.classList.toggle('text-default', !on) })
    $$('[data-method-panel]').forEach((p) => { const on = p.dataset.methodPanel === m; p.classList.toggle('hidden', !on); p.classList.toggle('flex', on) })
  },
  setState(s) {
    this.state = s
    $$('[data-state]', this.el).forEach((n) => { const on = n.dataset.state === s; n.classList.toggle('hidden', !on); n.classList.toggle('flex', on) })
    $('#pay-timer').classList.toggle('hidden', ['success', 'expired'].includes(s))
    $('#pay-order').classList.toggle('hidden', ['success', 'expired'].includes(s))
    $('#pay-title').textContent = s === 'success' ? 'Готово' : 'Оплата'
    if (s === 'success') { $('#pay-success-text').textContent = this.order.successText; $('#pay-success-actions').innerHTML = this.order.successActions }
  },
  close() { clearInterval(this.timer); this.timer = null; this.el.classList.add('hidden'); this.el.classList.remove('flex'); $('#page').inert = false; $('#page').removeAttribute('aria-busy'); document.body.style.overflow = '' },
}

/* ===== Мобильная панель и devbar ===== */
const Bar = {
  set({ amount, label = 'К оплате', ready, btn = 'Продолжить' }) {
    $('#mbar-amount').textContent = amount; $('#mbar-label').textContent = label
    const b = $('#mbar-btn'); b.textContent = ready ? btn : 'К итогу'
    b.className = 'rounded-lg px-5 py-2.5 text-base font-bold ' + (ready ? 'bg-primary text-white' : 'bg-ink/10 text-ink/60')
  },
}
function wireDev(page) {
  $$('[data-dev]').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.dev
    if (a === 'reset') { Pay.close(); page.reset(); return }
    if (a === 'fill') { Pay.close(); page.fill(); return }
    page.fill(); page.openPay(); Pay.setState(a)
    $('#devbar').open = false
  }))
  $('#mbar-btn').addEventListener('click', () => (page.isReady() ? page.openPay() : $('#summary').scrollIntoView({ behavior: 'smooth', block: 'start' })))
}
