<script lang="ts" setup>
// Виджет беспарольного входа и регистрации по коду подтверждения из email.
import type { OtpEmailStep } from "~/stores/auth"

type Props = {
    currentStep: OtpEmailStep
    secondsLeft: number
    isLoading: boolean
    error: string
    canResend: boolean
}

const modelValueEmail = defineModel<string>("email")
const modelValueCode = defineModel<string>("code")

const props = defineProps<Props>()

const emit = defineEmits<{
    submit: []
    resend: []
    reset: []
}>()

const pinValue = computed<number[]>({
    get: () =>
        modelValueCode.value
            ? modelValueCode.value
                  .split("")
                  .map(Number)
                  .filter((n) => !Number.isNaN(n))
            : [],
    set: (val: number[]) => {
        modelValueCode.value = val
            .filter((n) => typeof n === "number" && !Number.isNaN(n))
            .join("")
            .slice(0, 6)
    }
})

const handleAutoSubmit = () => {
    if (props.currentStep === "code" && !props.isLoading) {
        emit("submit")
    }
}

const teaser = [
    { icon: "ph:star-bold", title: "Абонементы", desc: "История и состав кружков" },
    { icon: "ph:calendar-dot-bold", title: "Разовые занятия", desc: "Мероприятия и пробные" },
    { icon: "ph:calendar-bold", title: "Расписание", desc: "Ближайшие активности" }
]
</script>

<template>
    <section class="flex h-fit w-full max-w-xs flex-col items-center text-center">
        <UiRoundIcon name="ph:user-bold" class="mb-6 max-sm:hidden" />
        <h1 class="text-primary text-4xl font-extrabold uppercase sm:text-4xl">
            Добро <br /><span class="text-secondary">Пожаловать!</span>
        </h1>

        <form class="mt-6 flex w-full flex-col gap-3" @submit.prevent="emit('submit')">
            <div class="flex items-center gap-2">
                <UiRoundIcon name="ph:envelope-bold" class="max-sm:hidden" />
                <UInput
                    v-model="modelValueEmail"
                    name="email"
                    type="email"
                    variant="subtle"
                    autocomplete="email"
                    size="xl"
                    :disabled="isLoading || currentStep === 'code'"
                    placeholder="your-email@mail.ru"
                    class="w-full"
                    :ui="{
                        base: 'bg-white shadow-sm'
                    }"
                />
            </div>

            <button
                v-if="currentStep === 'code'"
                type="button"
                :disabled="isLoading"
                class="text-muted hover:text-primary self-start text-xs underline decoration-dotted underline-offset-2 transition disabled:opacity-40"
                @click="emit('reset')"
            >
                ← Изменить почту
            </button>

            <template v-if="currentStep === 'code'">
                <div class="flex items-center gap-2">
                    <UiRoundIcon name="ph:lock-key-bold" class="max-sm:hidden" />
                    <UPinInput
                        v-model="pinValue"
                        :length="6"
                        type="number"
                        otp
                        variant="subtle"
                        color="secondary"
                        size="xl"
                        :disabled="isLoading"
                        class="w-full justify-center"
                        :ui="{
                            base: 'size-9 text-secondary text-base md:text-lg font-semibold rounded-xs ring-2 ring-transparent shadow-sm focus-visible:ring-primary bg-white [&:nth-child(3)]:mr-2.5'
                        }"
                        @complete="handleAutoSubmit"
                    />
                </div>
                <div class="flex flex-col items-center gap-2 text-center">
                    <p class="text-muted text-xs">Введите 6 цифр из письма</p>
                    <div class="flex items-center justify-center gap-2 text-sm">
                        <span class="text-muted">Код не пришёл?</span>
                        <button
                            type="button"
                            :disabled="!canResend"
                            class="text-primary/80 disabled:text-primary/20 hover:text-primary cursor-pointer font-semibold transition"
                            @click="emit('resend')"
                        >
                            Отправить заново <span v-if="secondsLeft > 0">({{ secondsLeft }})</span>
                        </button>
                    </div>
                </div>
            </template>

            <p v-if="error" class="text-error text-sm">{{ error }}</p>

            <UButton
                type="submit"
                :loading="isLoading"
                block
                class="mt-1 text-lg font-semibold"
                :label="currentStep === 'email' ? 'Получить код' : 'Продолжить'"
            />
        </form>

        <ol class="text-muted list-disc space-y-2 px-6 py-4 text-start text-sm font-medium">
            <li>Если вы впервые, регистрация займёт буквально 1–2 минуты.</li>
            <li>
                Пароль не нужен. На указанную почту придёт 6-значный код для быстрого подтверждения.
            </li>
        </ol>

        <div class="border-default mt-7 grid w-full grid-cols-3 gap-3 border-t pt-6">
            <div
                v-for="item in teaser"
                :key="item.title"
                class="flex flex-col items-center gap-1.5 text-center"
            >
                <div
                    class="bg-secondary/5 text-secondary flex items-center justify-center rounded-full p-2"
                >
                    <UIcon :name="item.icon" class="size-5" />
                </div>
                <span class="text-default text-sm font-semibold">{{ item.title }}</span>
                <span class="text-muted text-xs leading-tight">{{ item.desc }}</span>
            </div>
        </div>
    </section>
</template>
