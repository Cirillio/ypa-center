<script lang="ts" setup>
import type { StatusData } from "~/types/status"

const {
    handleOtp,
    resendCode,
    secondsLeft,
    canResend,
    isLoading,
    error,
    resetFlow,
    step,
    email,
    code,
    data
} = useMailConfirm<StatusData>({ cooldown: 5 })

const handleOtpFlow = async () => {
    if (step.value === "email" || step.value === "code") await handleOtp()
    else if (step.value === "accepted") modalOpen.value = true
}

const resend = async () => {
    resetFlow()
    await resendCode()
}

const modalOpen = ref<boolean>(false)
const isLeaveConfirmed = ref<boolean>(false)
const resolveLeave = ref<((v: boolean) => void) | null>(null)

onBeforeRouteLeave(async () => {
    if (isLeaveConfirmed.value || !email.value || step.value === "email") return true

    modalOpen.value = true

    const confirmed = await new Promise<boolean>((resolve) => {
        resolveLeave.value = resolve
    })

    if (confirmed) {
        isLeaveConfirmed.value = true
        return true
    }

    return false
})

onBeforeUnmount(() => {
    resetFlow()
})

const handleStay = () => {
    modalOpen.value = false
    resolveLeave.value?.(false)
}

const handleLeave = () => {
    modalOpen.value = false
    if (resolveLeave.value) {
        resolveLeave.value(true)
    } else {
        resetFlow()
    }
}

const sortedSubscriptions = computed(() => {
    if (!showData.value) return undefined
    return [...data.value!.subscriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})

const sortedRecords = computed(() => {
    if (!showData.value) return undefined
    const trials = data.value!.trials.map((t) => ({ ...t, type: "trial" as const }))
    const events = data.value!.events.map((e) => ({ ...e, type: "event" as const }))
    return [...trials, ...events].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})

const isProcessing = computed(() => isLoading.value)
const isInitial = computed(
    () => step.value === "email" || (step.value === "code" && !isLoading.value)
)
const showData = computed(() => step.value === "accepted" && data.value && !isLoading.value)
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh">
        <UModal
            v-model:open="modalOpen"
            :ui="{
                overlay: 'bg-black/25 backdrop-blur-xs',
                content: 'ring-0 shadow-none'
            }"
        >
            <template #content>
                <div class="p-6">
                    <p class="text-default mb-6 text-xl font-medium">
                        Вы уверены, что хотите выйти?
                    </p>
                    <div class="flex justify-end gap-3">
                        <UButton class="text-lg font-semibold" @click="handleStay">
                            Остаться
                        </UButton>
                        <UButton
                            color="error"
                            variant="ghost"
                            class="text-lg font-semibold"
                            @click="handleLeave"
                        >
                            Уйти
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>
        <MyStatusSection>
            <MyStatusCodeConfirmation
                v-model:email="email"
                v-model:code="code"
                :current-step="step"
                :is-loading="isLoading"
                :error="error || ''"
                :seconds-left="secondsLeft"
                :can-resend="canResend"
                @resend-code="resend"
                @reset="resetFlow"
                @handle-otp="handleOtpFlow"
            />
        </MyStatusSection>
        <main class="pb-16">
            <UContainer class="grid w-full grid-cols-11 gap-4">
                <div class="col-span-7 flex flex-col rounded-lg bg-white">
                    <div
                        v-if="isInitial"
                        class="mx-auto flex max-h-120 w-full flex-col justify-center"
                    >
                        <picture
                            class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg opacity-90"
                        >
                            <AppPhoto
                                src="/core/my-status-placeholder.png"
                                class="size-full translate-x-18 translate-y-4 scale-140 rotate-15 object-cover"
                                alt="Личный кабинет"
                                :quality="100"
                            />
                            <div
                                class="absolute top-0 left-0 z-10 size-full bg-linear-to-t from-black/90 via-black/15 to-transparent"
                            ></div>
                            <div class="absolute bottom-4 left-6 z-20">
                                <h2 class="text-4xl font-bold text-white text-shadow-md">
                                    Вся информация в одном месте
                                </h2>
                                <p
                                    class="max-w-md text-2xl leading-tight text-white/85 text-shadow-xs"
                                >
                                    Авторизуйтесь, чтобы просмотреть свои активные записи,
                                    абонементы и баланс занятий.
                                </p>
                            </div>
                        </picture>
                    </div>
                    <div v-else class="flex flex-col space-y-4 p-6">
                        <MyStatusParentInfo
                            :parent="showData ? data!.parent : undefined"
                            :is-processing="isProcessing"
                        />

                        <MyStatusChildrenInfo
                            :children="showData ? data!.children : undefined"
                            :is-processing="isProcessing"
                        />

                        <div class="mt-4 grid grid-cols-2 gap-4">
                            <MyStatusSubscriptionsList
                                :subscriptions="sortedSubscriptions"
                                :is-processing="isProcessing"
                            />
                            <MyStatusRecordsList
                                :records="sortedRecords"
                                :is-processing="isProcessing"
                            />
                        </div>
                    </div>
                </div>
                <div v-if="!isInitial" class="col-span-4 flex flex-col rounded-lg bg-white p-6">
                    <!-- Right column content -->
                </div>
            </UContainer>
        </main>
    </div>
</template>
