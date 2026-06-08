export default defineNuxtPlugin(() => {
    if (!import.meta.client) return

    // Если кликнули по ссылке на ту же страницу (без hash) — скроллим наверх
    window.addEventListener(
        "click",
        (e) => {
            const link = (e.target as HTMLElement).closest("a")
            if (!link) return
            if (link.target && link.target !== "_self") return
            if (link.origin !== window.location.origin) return

            const url = new URL(link.href)
            const isSamePath = url.pathname === window.location.pathname
            const isSameSearch = url.search === window.location.search

            if (isSamePath && isSameSearch && !url.hash) {
                if (window.scrollY === 0) return
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        },
        { capture: true }
    )
})
