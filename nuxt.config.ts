// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxt/ui",
        "@nuxt/image",
        "@nuxtjs/google-fonts",
        "@nuxt/a11y",
        "@pinia/nuxt",
        "@nuxtjs/sitemap",
        "@nuxtjs/robots",
        "dayjs-nuxt",
        "nuxt-openapi-docs-module"
        // {
        //     folder: "./docs/openapi",
        //     name: "OpenApiDocs",
        //     files: function () {
        //         return { "News-API": "News API" }
        //     }
        // }
    ],

    devtools: { enabled: true },

    css: ["~/assets/css/main.css"],

    colorMode: {
        preference: "light"
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api"
        }
    },

    routeRules: {
        "/": { ssr: true },
        "/**": {
            headers: {
                "Content-Security-Policy": "frame-src 'self' https://vk.com https://vkvideo.ru"
            }
        }
    },
    compatibilityDate: "2025-07-15",

    vite: {
        server: {
            allowedHosts: true
        },
        // Добавляем этот блок:
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

    eslint: {
        config: {
            // Stylistic settings removed in favor of Prettier
        }
    },

    googleFonts: {
        families: {
            Nunito: "200..1000",
            Rubik: "300..900"
        },
        display: "swap",
        download: true,
        base64: false,
        inject: true,
        stylePath: "css/fonts.css"
    }
})
