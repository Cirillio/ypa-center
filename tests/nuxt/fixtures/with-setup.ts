import { mountSuspended } from "@nuxt/test-utils/runtime"
import { defineComponent, h } from "vue"

// Запускает композабл внутри настоящего компонента: работают onMounted, inject и useAsyncData
export async function withSetup<T>(composable: () => T): Promise<T> {
    let box: { value: T } | undefined
    await mountSuspended(
        defineComponent({
            setup() {
                box = { value: composable() }
                return () => h("div")
            }
        })
    )
    if (!box) throw new Error("Composable did not run")
    return box.value
}
