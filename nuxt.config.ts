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
        "@nuxtjs/turnstile"
    ],

    devtools: { enabled: false },

    css: ["~/assets/css/main.css"],

    // Сервисы автоимпортируются наравне с композаблами: useMeService(), useGalleryService()…
    imports: {
        dirs: ["services"]
    },

    ui: {
        colorMode: false
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api"
        }
    },

    turnstile: {
        siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"
    },

    routeRules: {
        "/": { ssr: true },
        "/clubs": { ssr: true },
        "/gallery": { ssr: true },

        "/about": { ssr: true },
        "/teachers": { ssr: true },
        "/privacy": { ssr: true },
        "/consent": { ssr: true },

        "/enroll/trial": { ssr: true },
        "/enroll/event": { ssr: true },
        "/enroll/subscription": { ssr: true },

        "/login": { ssr: false },
        "/me": { ssr: false },
        "/checkout/**": { ssr: false },

        "/**": {
            ssr: true,
            headers: {
                "Content-Security-Policy":
                    "frame-src 'self' https://vk.com https://vkvideo.ru https://yandex.ru https://challenges.cloudflare.com"
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
        disallow: ["/enroll", "/checkout", "/api"]
    },

    compatibilityDate: "2025-07-15",

    vite: {
        server: process.env.NODE_ENV === "development" ? { allowedHosts: true } : undefined,
        optimizeDeps: {
            include: ["@vue/devtools-core", "@vue/devtools-kit"]
        }
    },

    typescript: {
        strict: true,
        // type-check вынесен из dev-сервера: гонять vue-tsc в процессе nuxt dev
        // слишком дорого по памяти. Проверка типов – отдельной командой:
        // npx nuxi typecheck
        typeCheck: false,
        tsConfig: {
            compilerOptions: {
                types: ["node"]
            }
        }
    },

    // ПОЧЕМУ: serverBundle вшивал коллекции целиком (4.4 MB в Nitro); scan кладёт в клиент только найденные в коде иконки
    icon: {
        serverBundle: false,
        clientBundle: {
            // ПОЧЕМУ свой glob: дефолт не читает .ts (app.config, constants) и цепляет доки из context/*.md
            scan: {
                globInclude: ["app/**/*.{vue,ts}"]
            }
        }
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
