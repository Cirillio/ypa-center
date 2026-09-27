import { fileURLToPath } from "node:url"
import { defineVitestProject } from "@nuxt/test-utils/config"
import { defineConfig } from "vitest/config"

// ПОЧЕМУ UTC, а не Новосибирск: на машине в UTC+7 тест не заметит код, забывший
// указать timeZone явно. Воркеры Vitest наследуют окружение процесса-родителя.
process.env.TZ = "UTC"

const appDir = fileURLToPath(new URL("./app", import.meta.url))

export default defineConfig({
    test: {
        projects: [
            {
                resolve: { alias: { "~": appDir } },
                test: {
                    name: "unit",
                    environment: "node",
                    include: ["tests/unit/**/*.spec.ts"]
                }
            },
            await defineVitestProject({
                test: {
                    name: "nuxt",
                    include: ["tests/nuxt/**/*.nuxt.spec.ts"],
                    environmentOptions: {
                        nuxt: { domEnvironment: "happy-dom" }
                    }
                }
            })
        ]
    }
})
