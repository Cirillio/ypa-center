<script lang="ts" setup>
/**
 * Компонент формы обратного звонка.
 * Делегирует бизнес-логику композаблу useCallbackForm.
 */

import { useMounted } from "@vueuse/core"
import { vMaska } from "maska/vue"
import { Maskas } from "~/constants/masks"
import type { ContactTimeOption } from "~/types"

// UI-состояния компонента
const modalOpen = ref(false)
const popoverOpen = ref(false)
const lastSelectedTimeLabel = ref("")

const toast = useToast()

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
        modalOpen.value = true
        turnstileRef.value?.reset()
    },
    onError: (err) => {
        toast.add({
            title: err.title,
            description: err.description,
            icon: "ph:x-circle-bold",
            color: "error"
        })
        turnstileRef.value?.reset()
    }
})

const turnstileRef = ref()

const isMounted = useMounted()

// Выбор времени и закрытие поповера в UI
const onSelectTime = (option: ContactTimeOption) => {
    setContactTime(option)
    popoverOpen.value = false
}
</script>

<template>
    <div class="bg-default flex max-w-xs flex-col rounded-lg p-2 sm:p-6 xl:max-w-sm">
        <!-- Модальное окно подтверждения успешной отправки -->
        <UModal
            v-model:open="modalOpen"
            :ui="{
                content: 'ring-0 overflow-hidden shadow-none rounded-sm',
                overlay: 'bg-black/25 backdrop-blur-xs'
            }"
        >
            <template #content>
                <div class="relative flex flex-col items-start space-y-1 p-4">
                    <UIcon
                        name="ph:sun-duotone"
                        class="text-primary absolute -right-8 -bottom-16 size-32 leading-tight opacity-50"
                    />
                    <span class="text-primary text-2xl leading-tight font-bold">
                        Спасибо. <br />
                        Мы скоро перезвоним!
                    </span>
                    <span class="text-default/95 text-lg font-semibold">
                        Выбранное время: {{ lastSelectedTimeLabel }}
                    </span>
                    <UButton
                        class="mt-3 text-base"
                        size="sm"
                        variant="soft"
                        label="Закрыть"
                        @click="
                            () => {
                                modalOpen = false
                            }
                        "
                    />
                </div>
            </template>
        </UModal>

        <form id="callbackForm" class="flex flex-col gap-2" @submit.prevent="submitForm">
            <div class="flex items-center gap-2">
                <div
                    class="bg-primary/10 flex aspect-square size-10 items-center justify-center rounded-full"
                >
                    <Icon name="ph:user" class="text-primary size-6" />
                </div>
                <UInput
                    v-model="form.name"
                    :disabled="isLoading"
                    name="phone"
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
                <div
                    class="bg-primary/10 flex aspect-square size-10 items-center justify-center rounded-full"
                >
                    <Icon name="ph:phone" class="text-primary size-6" />
                </div>
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
                <div
                    class="bg-primary/10 flex aspect-square size-10 items-center justify-center rounded-full"
                >
                    <Icon name="ph:clock" class="text-primary size-6" />
                </div>
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
                    :label="
                        !isMounted ? 'Загрузка...' : isSpamBlocked ? 'Ожидайте...' : 'Жду звонка'
                    "
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

        <span class="text-default/70 mt-2 px-4 text-xs leading-tight">
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
