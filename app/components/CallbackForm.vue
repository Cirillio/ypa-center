<script lang="ts" setup>
/**
 * Компонент формы обратного звонка.
 * Делегирует бизнес-логику композаблу useCallbackForm.
 */

import { vMaska } from "maska/vue"
import { useMediaQuery } from "@vueuse/core"
import { Maskas } from "~/constants/masks"
import { isMaskaCompleted, type MaskaDetailEvent } from "~/utils/masks"

// Проверка типа устройства для адаптивного UI
const isMobile = useMediaQuery("(max-width: 767px)")

/**
 * Входные параметры компонента
 * @property {('white'|'default')} bg - Стиль фона для инпутов и кнопок
 */
const props = withDefaults(
    defineProps<{
        bg?: "white" | "default"
    }>(),
    {
        bg: "white"
    }
)

// Использование композабла для управления логикой формы
const {
    form,
    isFormCompleted,
    isLoading,
    modalOpen,
    popoverOpen,
    isSpamBlocked,
    isSubmitDisabled,
    lastSelectedTimeLabel,
    contactTimeOptions,
    setContactTime,
    submitForm
} = useCallbackForm()

// Динамический класс фона на основе пропсов
const bgClass = computed(() => (props.bg === "white" ? "bg-white" : "bg-default"))
</script>

<template>
    <div class="flex max-w-xs flex-col xl:max-w-xl">
        <!-- Модальное окно подтверждения успешной отправки -->
        <UModal
            v-model:open="modalOpen"
            :ui="{
                content: 'ring-0 overflow-hidden shadow-none',
                overlay: 'bg-black/25 backdrop-blur-xs'
            }"
        >
            <template #content>
                <div class="relative flex flex-col items-start space-y-1 px-12 py-8">
                    <UIcon
                        name="ph:sun-duotone"
                        class="text-primary absolute -right-8 -bottom-16 size-32 leading-tight opacity-50"
                    />
                    <span class="text-primary text-2xl leading-tight font-bold">
                        Спасибо! Мы скоро перезвоним!
                    </span>
                    <span class="text-default/75 text-lg font-semibold">
                        Выбранное время: {{ lastSelectedTimeLabel }}
                    </span>
                    <UButton
                        class="mt-3 text-base"
                        size="xs"
                        variant="soft"
                        label="Закрыть"
                        @click="modalOpen = false"
                    />
                </div>
            </template>
        </UModal>

        <form
            id="callbackForm"
            class="flex max-xl:flex-col max-xl:gap-2 xl:overflow-hidden xl:rounded-full"
            @submit.prevent="submitForm"
        >
            <UInput
                v-model="form.phone"
                v-maska="Maskas.Phone"
                :disabled="isLoading"
                name="phone"
                :placeholder="Maskas.Phone"
                type="tel"
                autocomplete="tel"
                inputmode="decimal"
                leading-icon="lucide:phone"
                size="xl"
                color="primary"
                class="rounded-md text-lg md:py-2! md:pl-8! xl:rounded-none"
                :class="bgClass"
                :variant="'none'"
                :ui="{
                    base: 'md:text-lg focus-visible:ring-0 font-semibold text-default placeholder:text-default/50',
                    leadingIcon: 'md:ml-2 text-primary max-sm:size-5 ml-1'
                }"
                @maska="(e: MaskaDetailEvent) => (isFormCompleted = isMaskaCompleted(e))"
            />

            <div class="flex *:px-4 *:py-2 max-xl:gap-2 max-md:flex-col md:*:text-lg">
                <!-- Выбор времени звонка -->
                <UPopover
                    v-model:open="popoverOpen"
                    :content="{ align: 'start' }"
                    :ui="{
                        content:
                            'shadow-none ring-2 ring-transparent hover:ring-primary transition duration-150 ease-out ' +
                            bgClass
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
                            :label="isMobile ? form.time.label : form.time.time"
                            size="xl"
                            name="time"
                            color="secondary"
                            :disabled="isLoading"
                            type="button"
                            class="w-full justify-between focus-visible:ring-0 xl:w-auto xl:rounded-none"
                            :class="bgClass"
                            :variant="'ghost'"
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
                                @click="setContactTime(option)"
                            />
                        </div>
                    </template>
                </UPopover>

                <!-- Кнопка отправки с подсказкой при блокировке спама -->
                <UTooltip
                    v-if="isSpamBlocked"
                    :ui="{
                        content:
                            'ring-0 shadow-none bg-primary md:text-lg md:px-4 font-semibold md:py-3.5 text-white'
                    }"
                    :delay-duration="75"
                    :content="{ side: 'top' }"
                    text="Вы недавно уже отправляли заявку. Пожалуйста, подождите."
                >
                    <UButton
                        :disabled="isSubmitDisabled"
                        :loading="isLoading"
                        size="xl"
                        color="primary"
                        variant="soft"
                        type="submit"
                        :block="isMobile"
                        label="Ожидайте..."
                        class="font-semibold focus-visible:ring-0 md:w-fit xl:w-auto xl:rounded-none"
                    />
                </UTooltip>

                <UButton
                    v-else
                    :disabled="isSubmitDisabled"
                    :loading="isLoading"
                    size="xl"
                    color="primary"
                    variant="soft"
                    type="submit"
                    :block="isMobile"
                    label="Жду звонка"
                    class="font-semibold focus-visible:ring-0 md:w-fit xl:w-auto xl:rounded-none"
                />
            </div>
        </form>

        <span class="text-default/45 mt-2 px-4 text-xs leading-tight">
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
