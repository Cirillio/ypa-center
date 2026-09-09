<script lang="ts" setup>
const authStore = useAuthStore()
const { email, code, step, isLoading, error, secondsLeft, canResend, isAuthed } =
    storeToRefs(authStore)

onMounted(() => {
    if (isAuthed.value) {
        navigateTo("/me")
    }
})

const onSubmit = async () => {
    await authStore.submit()
    if (isAuthed.value) {
        await navigateTo("/me")
    }
}
</script>

<template>
    <div class="gradient-bg-ps grid size-full min-h-dvh">
        <main
            class="flex h-full items-center justify-center px-4 py-[calc(1rem+var(--ui-header-height))]"
        >
            <MeGuestGate
                v-model:email="email"
                v-model:code="code"
                :current-step="step"
                :is-loading="isLoading"
                :error="error ?? ''"
                :seconds-left="secondsLeft"
                :can-resend="canResend"
                @handle-otp="onSubmit"
                @resend-code="authStore.resendCode"
                @reset="authStore.resetFlow"
            />
        </main>
    </div>
</template>
