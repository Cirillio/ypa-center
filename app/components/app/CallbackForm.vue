<script lang="ts" setup>
import { vMaska } from "maska/vue"

withDefaults(
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
</script>

<template>
    <div class="flex flex-col">
        <div
            class="flex overflow-hidden rounded-full *:px-4 *:py-2 *:text-lg"
            :class="bg === 'white' ? 'bg-white' : 'bg-default'"
        >
            <UInput
                v-model="phone"
                v-maska="'+7 (###) ###-##-##'"
                :placeholder="'+7 (###) ###-##-##'"
                :variant="'none'"
                size="xl"
                color="primary"
                class="flex-2/4"
                type="tel"
                autocomplete="tel"
                inputmode="decimal"
                leading-icon="lucide:phone"
                :ui="{
                    base: 'text-lg font-semibold placeholder:text-default/50',
                    leadingIcon: 'ml-2 text-primary'
                }"
            />

            <UPopover
                :open="popoverOpen"
                :ui="{
                    content:
                        'bg-white shadow-none ring-2 ring-transparent hover:ring-primary transition duration-150 ease-out'
                }"
                @update:open="popoverOpen = $event"
            >
                <UTooltip
                    :content="{ side: 'top' }"
                    :delay-duration="75"
                    :ui="{
                        content: 'font-bold text-lg ring-0 shadow-none bg-secondary text-white p-4'
                    }"
                >
                    <UButton
                        :label="selectedTime.time"
                        size="xl"
                        variant="ghost"
                        class="rounded-none"
                        color="secondary"
                        :trailing-icon="'ph:caret-down-bold'"
                    />
                    <template #content> Выберите удобное для вас время </template>
                </UTooltip>

                <template #content>
                    <div class="flex flex-col gap-2 p-2">
                        <UButton
                            v-for="option in contactTimeOptions"
                            :key="option.value"
                            :label="option.label"
                            size="xl"
                            variant="ghost"
                            class="font-semibold"
                            @click="selectTime(option)"
                        />
                    </div>
                </template>
            </UPopover>

            <UButton
                class="rounded-none font-semibold"
                variant="soft"
                size="xl"
                color="primary"
                label="Жду звонка"
            />
        </div>
        <span class="text-default/45 mt-2 px-4 text-[10px] leading-tight">
            Нажимая на кнопку, вы даете согласие на
            <NuxtLink to="/privacy" class="hover:text-primary underline transition-colors">
                обработку персональных данных
            </NuxtLink>
            и соглашаетесь с
            <NuxtLink to="/privacy" class="hover:text-primary underline transition-colors">
                политикой конфиденциальности
            </NuxtLink>
            .
        </span>
    </div>
</template>
