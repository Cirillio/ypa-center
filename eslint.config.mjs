// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"
import prettier from "eslint-plugin-prettier"
import configPrettier from "eslint-config-prettier"

export default withNuxt(
    {
        ignores: ["app/types/api.d.ts", ".kilo/**", ".github/hooks/**"]
    },
    {
        plugins: {
            prettier
        },
        rules: {
            "prettier/prettier": "error",
            ...configPrettier.rules
        }
    }
)
