// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"
import prettier from "eslint-plugin-prettier"
import configPrettier from "eslint-config-prettier"

export default withNuxt({
    plugins: {
        prettier
    },
    rules: {
        "prettier/prettier": "error",
        ...configPrettier.rules
    }
})
