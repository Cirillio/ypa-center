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

const props = defineProps<GuestGateProps>()

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
        props.onHandleOtp()
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
        <RoundIcon name="ph:book-open-text-bold" class="mb-6 max-sm:hidden" />
        <h1 class="text-primary text-3xl font-bold sm:text-4xl">
            Мой <span class="text-secondary">кабинет</span>
        </h1>
        <p class="text-default/70 mt-2 text-base">
            Войдите по почте — пришлём одноразовый код, пароль не нужен.
        </p>

        <form class="mt-6 flex w-full flex-col gap-3" @submit.prevent="onHandleOtp">
            <div class="flex items-center gap-2">
                <RoundIcon name="ph:envelope-bold" class="max-sm:hidden" />
                <UInput
                    v-model="modelValueEmail"
                    name="email"
                    type="email"
                    variant="subtle"
                    autocomplete="email"
                    size="xl"
                    :disabled="isLoading"
                    placeholder="your-email@mail.ru"
                    class="w-full"
                    :ui="{
                        base: 'bg-white shadow-sm'
                    }"
                />
            </div>

            <template v-if="currentStep === 'code'">
                <div class="flex items-center gap-2">
                    <RoundIcon name="ph:lock-key-bold" class="max-sm:hidden" />
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
                    <p class="text-default/60 text-xs">Введите 6 цифр из письма</p>
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
                </div>
            </template>

            <p v-if="error" class="text-error text-sm">{{ error }}</p>

            <UButton
                type="submit"
                :loading="isLoading"
                block
                class="mt-1 text-lg font-semibold"
                :label="currentStep === 'email' ? 'Получить код' : 'Войти'"
            />
        </form>

        <p class="text-default/50 mt-4 text-xs">
            Аккаунт создаётся автоматически после первой покупки — абонемента или разового занятия.
        </p>

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
                <span class="text-default/60 text-xs leading-tight">{{ item.desc }}</span>
            </div>
        </div>
    </section>
</template>
