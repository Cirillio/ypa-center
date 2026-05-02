<script lang="ts" setup>
type CodeConfirmationProps = {
    onHandleOtp: () => Promise<void>
    onResendCode: () => Promise<void>
    onReset: () => void
    currentStep: OtpEmailStep
    secondsLeft: number
    isLoading: boolean
    error: string
    canResend: boolean
}

const modelValueEmail = defineModel<string>("email")
const modelValueCode = defineModel<string>("code")

defineProps<CodeConfirmationProps>()
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
                v-model="modelValueEmail"
                name="email"
                type="email"
                :autocomplete="'email'"
                :disabled="isLoading || currentStep === 'accepted'"
                class="max-w-sm"
                placeholder="your-email@mail.ru"
            />
            <div
                v-if="currentStep === 'code'"
                class="absolute top-full left-2 mt-6 flex items-center gap-2 text-sm"
            >
                <span class="shrink-0">Код не пришел?</span>
                <button
                    :disabled="!canResend"
                    class="text-primary/80 disabled:text-primary/20 hover:text-primary shrink-0 cursor-pointer transition"
                    @click="onResendCode"
                >
                    Попробовать заново <span v-if="secondsLeft > 0">({{ secondsLeft }})</span>
                </button>
            </div>
            <div v-if="error" class="absolute top-full left-2 mt-6 flex items-center gap-2 text-sm">
                <span class="text-error shrink-0">{{ error }}</span>
            </div>
        </div>

        <div
            v-if="currentStep === 'code'"
            class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
        >
            <UIcon name="ph:key-bold" class="size-6.5" />
        </div>
        <UInput
            v-if="currentStep === 'code'"
            v-model="modelValueCode"
            :disabled="isLoading"
            class="max-w-48"
            color="secondary"
            placeholder="###-###"
        />

        <UButton
            :loading="isLoading"
            size="sm"
            class="ml-2 px-6 text-lg font-semibold"
            :label="
                currentStep === 'email'
                    ? 'Получить код'
                    : currentStep === 'code'
                      ? 'Подтвердить'
                      : 'Выход'
            "
            @click="onHandleOtp"
        />
    </form>
</template>
