// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxt/ui",
        "@nuxt/image",
        "@nuxt/a11y",
        "@pinia/nuxt",
        "@nuxtjs/sitemap",
        "@nuxtjs/robots",
        "dayjs-nuxt",
        "nuxt-openapi-docs-module"
    ],

    devtools: { enabled: true },

    css: ["~/assets/css/main.css"],

    colorMode: {
        preference: "light",
        classSuffix: "", // по умолчанию там 'mode', из-за этого класс может быть 'light-mode' вместо 'light'
        dataValue: "theme" // записывает data-theme="light" на <html>
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api"
        }
    },

    routeRules: {
        "/": { ssr: true },
        "/clubs": { ssr: true },
        "/gallery": { ssr: true },

        // ssr вместо prerender: страницы фетчат бэкенд, а на этапе сборки
        // (в т.ч. в Docker / CI) его может не быть — пусть рендерятся по запросу
        "/about": { ssr: true },
        "/teachers": { ssr: true },
        "/privacy": { ssr: true },
        "/consent": { ssr: true },

        "/enroll/trial": { ssr: true },
        "/enroll/event": { ssr: true },
        "/enroll/subscription": { ssr: true },

        "my-status": { ssr: false },

        "/**": {
            ssr: true,
            headers: {
                "Content-Security-Policy":
                    "frame-src 'self' https://vk.com https://vkvideo.ru https://yandex.ru"
            }
        }
    },
    site: {
        url: "https://ypa-center.ru",
        name: "Улица Радости"
    },

    sitemap: {
        strictNuxtContentPaths: false,
        urls: [
            { loc: "/", priority: 1.0, changefreq: "weekly" },
            { loc: "/clubs", priority: 0.9, changefreq: "weekly" },
            { loc: "/about", priority: 0.7, changefreq: "monthly" },
            { loc: "/teachers", priority: 0.7, changefreq: "monthly" },
            { loc: "/gallery", priority: 0.6, changefreq: "monthly" },
            { loc: "/privacy", priority: 0.2, changefreq: "yearly" },
            { loc: "/consent", priority: 0.2, changefreq: "yearly" }
        ]
    },

    robots: {
        disallow: ["/enroll", "/api"]
    },

    compatibilityDate: "2025-07-15",

    vite: {
        server: process.env.NODE_ENV === "development" ? { allowedHosts: true } : undefined,
        optimizeDeps: {
            include: [
                "@vue/devtools-core",
                "@vue/devtools-kit",
                "dayjs",
                "dayjs/plugin/updateLocale",
                "dayjs/locale/ru",
                "dayjs/plugin/relativeTime",
                "dayjs/plugin/utc",
                "dayjs/plugin/timezone",
                "dayjs/plugin/customParseFormat"
            ]
        }
    },

    typescript: {
        strict: true,
        typeCheck: true,
        tsConfig: {
            compilerOptions: {
                types: ["node"]
            }
        }
    },

    dayjs: {
        locales: ["ru"],
        defaultLocale: "ru",
        defaultTimezone: "Asia/Novosibirsk",
        plugins: ["relativeTime", "utc", "timezone", "customParseFormat"]
    },

    fonts: {
        families: [
            {
                name: "Nunito",
                provider: "google",
                weights: [400, 500, 600, 700, 800, 900],
                styles: ["normal"]
            }
        ]
    }
})
