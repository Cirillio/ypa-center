<script lang="ts" setup>
type GuestGateProps = {
    onHandleOtp: () => Promise<void> | void
    onResendCode: () => Promise<void> | void
    onReset: () => void
    currentStep: OtpEmailStep
    secondsLeft: number
    isLoading: boolean
    error: string
    canResend: boolean
}

const modelValueEmail = defineModel<string>("email")
const modelValueCode = defineModel<string>("code")

defineProps<GuestGateProps>()

const teaser = [
    { icon: "ph:star-bold", title: "Абонементы", desc: "История и состав кружков" },
    { icon: "ph:calendar-dot-bold", title: "Разовые занятия", desc: "Мероприятия и пробные" },
    { icon: "ph:calendar-bold", title: "Расписание", desc: "Ближайшие активности" }
]
</script>

<template>
    <section
        class="mx-auto flex w-full max-w-xl flex-col items-center rounded-lg bg-white p-8 text-center"
    >
        <div class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-3.5">
            <UIcon name="ph:lock-key-bold" class="size-8" />
        </div>

        <p class="text-secondary mt-5 text-sm font-semibold tracking-wide uppercase">
            Доступ к кабинету
        </p>
        <h2 class="text-primary mt-1 text-3xl font-bold">Войдите по почте</h2>
        <p class="text-default/70 mt-2 max-w-md text-base">
            Укажите e-mail — мы отправим одноразовый код для входа. Пароль не нужен.
        </p>

        <form class="mt-6 flex w-full flex-col gap-3" @submit.prevent="onHandleOtp">
            <UInput
                v-model="modelValueEmail"
                name="email"
                type="email"
                autocomplete="email"
                size="xl"
                :disabled="isLoading"
                placeholder="your-email@mail.ru"
                class="w-full"
            />

            <template v-if="currentStep === 'code'">
                <UInput
                    v-model="modelValueCode"
                    size="xl"
                    color="secondary"
                    :disabled="isLoading"
                    placeholder="Код из письма (###-###)"
                    class="w-full"
                />
                <div class="flex items-center justify-center gap-2 text-sm">
                    <span class="text-default/70">Код не пришёл?</span>
                    <button
                        type="button"
                        :disabled="!canResend"
                        class="text-primary/80 disabled:text-primary/20 hover:text-primary cursor-pointer font-semibold transition"
                        @click="onResendCode"
                    >
                        Отправить заново <span v-if="secondsLeft > 0">({{ secondsLeft }})</span>
                    </button>
                </div>
            </template>

            <p v-if="error" class="text-error text-sm">{{ error }}</p>

            <UButton
                type="submit"
                :loading="isLoading"
                size="lg"
                block
                class="mt-1 text-lg font-semibold"
                :label="currentStep === 'email' ? 'Получить код' : 'Подтвердить'"
            />
        </form>

        <p class="text-default/50 mt-4 text-xs">
            Аккаунт создаётся автоматически после первой покупки — абонемента или разового занятия.
        </p>

        <div class="mt-7 grid w-full grid-cols-3 gap-3 border-t border-(--ui-border) pt-6">
            <div
                v-for="item in teaser"
                :key="item.title"
                class="flex flex-col items-center gap-1.5"
            >
                <div
                    class="bg-secondary/5 text-secondary flex items-center justify-center rounded-full p-2"
                >
                    <UIcon :name="item.icon" class="size-5" />
                </div>
                <span class="text-default text-sm font-semibold">{{ item.title }}</span>
                <span class="text-default/60 text-xs leading-tight">{{ item.desc }}</span>
            </div>
        </div>
    </section>
</template>
