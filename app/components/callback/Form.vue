<script lang="ts" setup>
import { useMounted } from "@vueuse/core"
import { vMaska } from "maska/vue"
import { Maskas } from "~/constants/masks"
import type { ContactTimeOption } from "~/types"

// UI-состояния компонента
const isMounted = useMounted()
const popoverOpen = ref(false)
const lastSelectedTimeLabel = ref("")

const emit = defineEmits<{
    (e: "success", value: string): void
    (e: "error", value: ApiError): void
}>()

// Ref для управления виджетом Turnstile
const turnstileRef = ref()

// Использование композабла для управления логикой формы
const {
    form,
    isFormCompleted,
    captchaToken,
    isLoading,
    isSpamBlocked,
    isSubmitDisabled,
    contactTimeOptions,
    setContactTime,
    submitForm
} = useCallbackForm({
    onSuccess: (selectedTime) => {
        lastSelectedTimeLabel.value = selectedTime.time
        emit("success", selectedTime.time)
        turnstileRef.value?.reset()
    },
    onError: (err) => {
        emit("error", err)
        turnstileRef.value?.reset()
    }
})

const onSelectTime = (option: ContactTimeOption) => {
    setContactTime(option)
    popoverOpen.value = false
}
</script>

<template>
    <form id="callbackForm" class="flex flex-col gap-2" @submit.prevent="submitForm">
        <div class="flex items-center gap-2">
            <UiRoundIcon name="ph:user" />
            <UInput
                v-model="form.name"
                :disabled="isLoading"
                name="name"
                placeholder="Как к вам обращаться?"
                autocomplete="name"
                type="text"
                size="xl"
                color="secondary"
                class="text-lg"
                variant="subtle"
                :ui="{
                    base: 'md:text-lg !text-base bg-white font-semibold text-default placeholder:text-default/75'
                }"
            />
        </div>
        <div class="flex items-center gap-2">
            <UiRoundIcon name="ph:phone" />
            <UInput
                v-model="form.phone"
                v-maska="Maskas.Phone"
                :disabled="isLoading"
                name="phone"
                :placeholder="Maskas.Phone"
                type="tel"
                autocomplete="tel"
                inputmode="decimal"
                size="xl"
                color="secondary"
                class="text-lg"
                variant="subtle"
                :ui="{
                    base: 'md:text-lg !text-base bg-white font-semibold text-default placeholder:text-default/75'
                }"
            />
        </div>
        <!-- Выбор времени звонка -->
        <div class="flex items-center gap-2">
            <UiRoundIcon name="ph:clock" />
            <UPopover
                v-model:open="popoverOpen"
                :content="{ align: 'start' }"
                :ui="{
                    content:
                        'ring-transparent shadow-sm transition duration-150 ease-out bg-default'
                }"
            >
                <UTooltip
                    :ui="{
                        content:
                            'ring-0 shadow-none bg-primary md:text-lg md:px-4 font-semibold md:py-3.5 text-white'
                    }"
                    :delay-duration="75"
                    :content="{ side: 'top' }"
                    text="Выберите удобное для вас время"
                >
                    <UButton
                        :label="form.time.label"
                        size="xl"
                        name="time"
                        color="secondary"
                        :disabled="isLoading"
                        type="button"
                        class="w-full justify-between max-md:text-base!"
                        :ui="{
                            base: 'truncate'
                        }"
                        variant="soft"
                        :trailing-icon="'ph:caret-down-bold'"
                    />
                </UTooltip>
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
                            :disabled="isLoading"
                            @click="onSelectTime(option)"
                        />
                    </div>
                </template>
            </UPopover>
        </div>

        <!-- Кнопка отправки с подсказкой при блокировке спама -->
        <UTooltip
            :ui="{
                content:
                    'ring-0 shadow-none bg-primary md:text-lg md:px-4 font-semibold md:py-3.5 text-white'
            }"
            :delay-duration="75"
            :content="{ side: 'top' }"
            :text="
                isSpamBlocked
                    ? 'Вы недавно уже отправляли заявку. Пожалуйста, подождите.'
                    : undefined
            "
        >
            <UButton
                :disabled="isSubmitDisabled || !isMounted"
                :loading="isLoading || isSpamBlocked || !isMounted"
                color="primary"
                type="submit"
                :label="!isMounted ? 'Загрузка...' : isSpamBlocked ? 'Ожидайте...' : 'Жду звонка'"
                :variant="isFormCompleted && !isSpamBlocked ? 'solid' : 'soft'"
                class="w-full justify-center text-lg font-semibold focus-visible:ring-0"
            />
        </UTooltip>

        <NuxtTurnstile
            ref="turnstileRef"
            v-model="captchaToken"
            :options="{ appearance: 'interaction-only' }"
        />
    </form>
</template>
