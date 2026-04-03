<script lang="ts" setup>
import { vMaska } from "maska/vue"
import { useMediaQuery } from "@vueuse/core"
const isMobile = useMediaQuery("(max-width: 767px)")

const props = withDefaults(
    defineProps<{
        bg?: "white" | "default"
    }>(),
    {
        bg: "white"
    }
)

type ContactTimeOption = {
    label: string
    time: string
    value: string
}

const contactTimeOptions: ContactTimeOption[] = [
    {
        label: "Утром (09:00 – 12:00)",
        time: "09:00-12:00",
        value: "morning"
    },
    {
        label: "Днем (12:00 – 18:00)",
        time: "12:00-18:00",
        value: "afternoon"
    },
    {
        label: "Вечером (18:00 – 21:00)",
        time: "18:00-21:00",
        value: "evening"
    }
]

const phone = ref<string>("")
const selectedTime = ref<ContactTimeOption>(contactTimeOptions[0]!)
const popoverOpen = ref<boolean>()

function selectTime(option: ContactTimeOption) {
    selectedTime.value = option
    popoverOpen.value = false
}

const bgClass = computed(() => {
    if (props.bg === "white") {
        return "bg-white"
    } else {
        return "bg-default"
    }
})
</script>
<template>
    <div class="flex max-w-xs flex-col xl:max-w-xl">
        <form
            id="callbackForm"
            class="flex max-xl:flex-col max-xl:gap-2 xl:overflow-hidden xl:rounded-full"
        >
            <UInput
                v-model="phone"
                v-maska="'+7 (###) ###-##-##'"
                name="phone"
                placeholder="+7 (###) ###-##-##"
                type="tel"
                autocomplete="tel"
                inputmode="decimal"
                leading-icon="lucide:phone"
                size="xl"
                color="primary"
                class="rounded-md text-lg md:py-2 md:pl-4 xl:rounded-none"
                :class="bgClass"
                :variant="'none'"
                :ui="{
                    base: 'md:text-lg font-semibold text-default placeholder:text-default/50',
                    leadingIcon: 'md:ml-2 text-primary max-sm:size-5 ml-1'
                }"
            />

            <div class="flex *:px-4 *:py-2 max-xl:gap-2 max-md:flex-col md:*:text-lg">
                <UPopover
                    :open="popoverOpen"
                    :ui="{
                        content:
                            'bg-white shadow-none ring-2 ring-transparent hover:ring-primary transition duration-150 ease-out'
                    }"
                    @update:open="popoverOpen = $event"
                >
                    <UButton
                        :label="isMobile ? selectedTime.label : selectedTime.time"
                        size="xl"
                        name="time"
                        color="secondary"
                        type="button"
                        class="w-full justify-between xl:w-auto xl:rounded-none"
                        :class="bgClass"
                        :variant="'ghost'"
                        :trailing-icon="'ph:caret-down-bold'"
                    />
                    <template #content>
                        <div class="flex flex-col gap-1 p-2">
                            <UButton
                                v-for="option in contactTimeOptions"
                                :key="option.value"
                                :label="option.label"
                                size="xl"
                                variant="ghost"
                                type="button"
                                class="font-semibold"
                                @click="selectTime(option)"
                            />
                        </div>
                    </template>
                </UPopover>

                <UButton
                    size="xl"
                    color="primary"
                    variant="soft"
                    type="submit"
                    :block="isMobile ? true : false"
                    label="Жду звонка"
                    class="font-semibold md:w-fit xl:w-auto xl:rounded-none"
                />
            </div>
        </form>

        <span class="text-default/45 mt-2 px-4 text-[10px] leading-tight">
            Нажимая на кнопку, вы даете согласие на
            <NuxtLink
                target="_blank"
                external
                to="/privacy"
                class="hover:text-primary underline transition-colors"
            >
                обработку персональных данных
            </NuxtLink>
            и соглашаетесь с
            <NuxtLink
                target="_blank"
                external
                to="/consent"
                class="hover:text-primary underline transition-colors"
            >
                политикой конфиденциальности </NuxtLink
            >.
        </span>
    </div>
</template>
