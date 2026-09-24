<script lang="ts" setup>
// Страница входа и регистрации: email → код → анкета (если профиль пуст).
useSeoMeta({ title: "Вход" })

const authStore = useAuthStore()
const { email, code, step, isLoading, error, secondsLeft, canResend, isAuthed } =
    storeToRefs(authStore)

const route = useRoute()
// Куда вернуть после входа: единственный источник – query, прошедший белый список
const redirectTarget = computed(() => resolveRedirect(route.query.redirectFrom))

onMounted(async () => {
    if (isAuthed.value) {
        const isComplete = await authStore.checkProfileCompletion()
        if (isComplete) {
            await navigateTo(redirectTarget.value)
        }
    }
})

const onSubmit = async () => {
    await authStore.submit()
    if (isAuthed.value && step.value === "accepted") {
        await navigateTo(redirectTarget.value)
    }
}

// ПОЧЕМУ: шаг меняется здесь, а не в композабле анкеты – иначе виджет
// размонтируется до emit("completed") и событие потеряется. Кэш профиля
// сбрасывается, чтобы гейт /me не взял старый «пустой» профиль.
const onProfileCompleted = async () => {
    authStore.completeProfileStep()
    clearNuxtData("me-profile")
    await navigateTo(redirectTarget.value)
}
</script>

<template>
    <div class="gradient-bg-ps grid size-full min-h-dvh">
        <section
            aria-label="Вход в личный кабинет"
            class="flex h-full items-center justify-center px-4 py-[calc(1rem+var(--ui-header-height))]"
        >
            <LoginOtpWidget
                v-if="step === 'email' || step === 'code'"
                v-model:email="email"
                v-model:code="code"
                :current-step="step"
                :is-loading="isLoading"
                :error="error ?? ''"
                :seconds-left="secondsLeft"
                :can-resend="canResend"
                @submit="onSubmit"
                @resend="authStore.resendCode"
                @reset="authStore.resetFlow"
            />
            <LoginProfileWidget v-else-if="step === 'profile'" @completed="onProfileCompleted" />
        </section>
    </div>
</template>
