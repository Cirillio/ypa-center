<script lang="ts" setup>
const {
    handleOtp,
    resendCode,
    secondsLeft,
    canResend,
    isLoading,
    error,
    data,
    resetFlow,
    step,
    email,
    code
} = useMailConfirm()

const otpActionButtonClick = async () => {
    if (step.value === "email" || step.value === "code") await handleOtp()
    else if (step.value === "accepted") resetFlow()
}

const resend = async () => {
    resetFlow()
    await resendCode()
}
</script>

<template>
    <form
        id="status-code-confirm-code"
        class="flex w-fit items-center gap-4 rounded-lg bg-white p-4"
    >
        <div class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2">
            <UIcon name="ph:mailbox" class="size-6.5" />
        </div>
        <div class="relative">
            <UInput
                v-model="email"
                :disabled="isLoading || step === 'accepted'"
                class="max-w-sm"
                placeholder="your-email@mail.ru"
            />
            <div
                v-if="step === 'code'"
                class="absolute top-full left-2 mt-6 flex items-center gap-2 text-sm"
            >
                <span class="shrink-0">Код не пришел?</span>
                <button
                    :disabled="!canResend"
                    class="text-primary/80 disabled:text-primary/20 hover:text-primary shrink-0 cursor-pointer transition"
                    @click="resend"
                >
                    Попробовать заново <span v-if="secondsLeft > 0">({{ secondsLeft }})</span>
                </button>
            </div>
            <div v-if="error" class="absolute top-full left-2 mt-6 flex items-center gap-2 text-sm">
                <span class="text-error shrink-0">{{ error }}</span>
            </div>
        </div>

        <div
            v-if="step === 'code'"
            class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
        >
            <UIcon name="ph:key-bold" class="size-6.5" />
        </div>
        <UInput
            v-if="step === 'code'"
            v-model="code"
            :disabled="isLoading"
            class="max-w-48"
            color="secondary"
            placeholder="Код"
        />

        <UButton
            :loading="isLoading"
            size="sm"
            class="ml-2 px-6 text-lg font-semibold"
            :label="step === 'email' ? 'Получить код' : step === 'code' ? 'Подтвердить' : 'Выход'"
            @click="otpActionButtonClick"
        />
    </form>
    {{ [data, step, error] }}
</template>
