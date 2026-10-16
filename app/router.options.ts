import type { RouterConfig } from "@nuxt/schema"

// ПОЧЕМУ свой scrollBehavior: штатный считает позицию якоря сразу после загрузки
// страницы, а секции выше (скелетоны, картинки, ленивые данные) ещё меняют высоту –
// на телефоне прокрутка промахивается на экран-два
const SETTLE_TIMEOUT_MS = 3000
const STABLE_FRAMES = 6

// Ждёт, пока элемент якоря появится, скелетоны (aria-busy) загрузятся и позиция перестанет меняться.
function waitForStableElement(selector: string): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
        const deadline = performance.now() + SETTLE_TIMEOUT_MS
        let lastTop: number | null = null
        let stableFrames = 0

        const tick = () => {
            const el = findHashTarget(selector)
            const loading = document.querySelector('[aria-busy="true"]') !== null
            if (el && !loading) {
                const top = Math.round(el.getBoundingClientRect().top + window.scrollY)
                stableFrames = top === lastTop ? stableFrames + 1 : 0
                lastTop = top
                if (stableFrames >= STABLE_FRAMES) return resolve(el)
            }
            if (performance.now() > deadline) return resolve(el)
            requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
    })
}

// Ищет элемент по хэшу; невалидный селектор (кириллица, цифра в начале) не роняет навигацию.
function findHashTarget(hash: string): HTMLElement | null {
    try {
        return document.getElementById(decodeURIComponent(hash.slice(1)))
    } catch {
        return null
    }
}

// Прокручивает к элементу с учётом scroll-margin-top (отступ под фиксированную шапку).
function scrollToElement(el: HTMLElement, behavior: ScrollBehavior) {
    const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - margin, behavior })
}

// Резолвится, когда новая страница отрендерена; без этого скролл применится к старой.
function waitForPageLoad(): Promise<void> {
    const nuxtApp = useNuxtApp()
    return new Promise((resolve) => nuxtApp.hooks.hookOnce("page:loading:end", () => resolve()))
}

export default {
    scrollBehavior(to, from, savedPosition) {
        const samePage = to.path === from.path
        const isFirstLoad = from.matched.length === 0

        if (to.hash) {
            const ready = samePage || isFirstLoad ? Promise.resolve() : waitForPageLoad()
            return ready
                .then(() => waitForStableElement(to.hash))
                .then((el) => {
                    if (el) scrollToElement(el, "smooth")
                    return false
                })
        }

        // Смена query на той же странице (фильтры, выбор события) не сбрасывает скролл
        if (samePage) return from.hash ? { left: 0, top: 0 } : false

        if (isFirstLoad) return savedPosition ?? { left: 0, top: 0 }
        return waitForPageLoad().then(() => savedPosition ?? { left: 0, top: 0 })
    }
} satisfies RouterConfig
