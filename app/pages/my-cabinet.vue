<script lang="ts" setup>
import type { StatusData, UpcomingActivityItem } from "~/types/status"

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

const {
    children: cabinetChildren,
    isSaving: isChildSaving,
    addChild,
    removeChild
} = useCabinetChildren(() => data.value)

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
const isAuthed = computed(() => step.value === "accepted")
const showData = computed(() => step.value === "accepted" && data.value && !isLoading.value)

const dayMap: Record<string, number> = {
    пн: 1,
    вт: 2,
    ср: 3,
    чт: 4,
    пт: 5,
    сб: 6,
    вс: 0
}

function getNextOccurrence(dayName: string, timeStr: string): Date {
    const targetDay = dayMap[dayName.toLowerCase()] ?? 0
    const [hours, minutes] = timeStr.split(":").map(Number)
    const h = hours ?? 0
    const m = minutes ?? 0
    const now = new Date()

    let daysUntil = (targetDay - now.getDay() + 7) % 7

    const activityTime = new Date(now)
    activityTime.setHours(h, m, 0, 0)

    if (daysUntil === 0 && now.getTime() >= activityTime.getTime()) {
        daysUntil = 7
    }

    const result = new Date(now)
    result.setDate(now.getDate() + daysUntil)
    result.setHours(h, m, 0, 0)
    return result
}

function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("ru-RU", {
        month: "long",
        day: "numeric"
    })
}

const upcomingActivities = computed<UpcomingActivityItem[] | undefined>(() => {
    if (!showData.value || !data.value) return undefined

    const items: UpcomingActivityItem[] = []
    const nowTs = new Date().getTime()

    // 1. Trials
    data.value.trials.forEach((t) => {
        const start = new Date(`${t.dateTime.date}T${t.dateTime.startTime}`)
        if (start.getTime() > nowTs) {
            items.push({
                id: t.id,
                type: "trial",
                title: t.club.name,
                subtitle: t.club.subgroup.name,
                timestamp: start.getTime(),
                displayDate: formatDisplayDate(start),
                displayTime: `${t.dateTime.startTime}-${t.dateTime.endTime}`,
                participant: t.participant.name
            })
        }
    })

    // 2. Events
    data.value.events.forEach((e) => {
        const start = new Date(`${e.dateTime.date}T${e.dateTime.startTime}`)
        if (start.getTime() > nowTs) {
            items.push({
                id: e.id,
                type: "event",
                title: e.event.name,
                subtitle: `Вместимость: ${e.event.capacity} чел.`,
                timestamp: start.getTime(),
                displayDate: formatDisplayDate(start),
                displayTime: `${e.dateTime.startTime}-${e.dateTime.endTime}`,
                participant: e.participant.name
            })
        }
    })

    // 3. Subscriptions (next immediate occurrence)
    data.value.subscriptions.forEach((sub) => {
        if (sub.isExpired) return
        sub.clubs.forEach((club) => {
            if (club.left <= 0) return
            const nextDate = getNextOccurrence(club.weeklySlot.dayOfWeek, club.weeklySlot.startTime)
            items.push({
                id: `${sub.id}-${club.name}`,
                type: "subscription",
                title: club.name,
                subtitle: club.subgroup.name,
                timestamp: nextDate.getTime(),
                displayDate: formatDisplayDate(nextDate),
                displayTime: `${club.weeklySlot.startTime}-${club.weeklySlot.endTime}`,
                participant: sub.participant.name,
                metaLabel: `#${sub.id}`
            })
        })
    })

    return items.sort((a, b) => a.timestamp - b.timestamp)
})

// Группировка ближайших активностей по дате (date-divider в сайдбаре).
const groupedUpcoming = computed(() => {
    const items = upcomingActivities.value
    if (!items) return undefined

    const groups: { date: string; items: UpcomingActivityItem[] }[] = []
    for (const item of items) {
        const last = groups[groups.length - 1]
        if (last && last.date === item.displayDate) last.items.push(item)
        else groups.push({ date: item.displayDate, items: [item] })
    }
    return groups
})
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

        <MyCabinetSection :is-authed="isAuthed" @logout="modalOpen = true" />

        <main class="pb-16">
            <UContainer class="flex w-full flex-col gap-4">
                <!-- Гость: блок входа -->
                <MyCabinetGuestGate
                    v-if="isInitial"
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

                <!-- Авторизован / загрузка -->
                <template v-else>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="rounded-lg bg-white p-6">
                            <MyCabinetParentInfo
                                :parent="showData ? data!.parent : undefined"
                                :is-processing="isProcessing"
                            />
                        </div>
                        <div class="rounded-lg bg-white p-6">
                            <MyCabinetChildrenInfo
                                :children="showData ? cabinetChildren : undefined"
                                :is-processing="isProcessing"
                                :is-saving="isChildSaving"
                                @add="addChild"
                                @remove="removeChild"
                            />
                        </div>
                    </div>

                    <div class="grid w-full grid-cols-11 gap-4">
                        <div class="col-span-7 flex h-fit flex-col gap-6 rounded-lg bg-white p-6">
                            <MyCabinetSubscriptionsList
                                :subscriptions="sortedSubscriptions"
                                :is-processing="isProcessing"
                            />
                            <MyCabinetRecordsList
                                :records="sortedRecords"
                                :is-processing="isProcessing"
                            />
                        </div>

                        <div
                            class="top-(calc(var(--header-height)+1rem)) sticky col-span-4 flex h-fit min-h-120 flex-col gap-6 rounded-lg bg-white py-6"
                        >
                            <h2 class="text-primary ml-4 px-6 text-xl font-bold">
                                Ближайшие активности
                            </h2>

                            <div
                                v-if="groupedUpcoming"
                                class="grid max-h-240 gap-4 overflow-y-auto px-6"
                            >
                                <template v-if="groupedUpcoming.length > 0">
                                    <div
                                        v-for="group in groupedUpcoming"
                                        :key="group.date"
                                        class="flex flex-col gap-2"
                                    >
                                        <div
                                            class="text-default/50 text-xs font-bold tracking-wider uppercase"
                                        >
                                            {{ group.date }}
                                        </div>
                                        <MyCabinetUpcomingActivityCard
                                            v-for="activity in group.items"
                                            :key="activity.id"
                                            :item="activity"
                                        />
                                    </div>
                                </template>
                                <div v-else class="flex flex-col items-center py-8 text-center">
                                    <UIcon
                                        name="ph:calendar-x-bold"
                                        class="text-default/10 size-16"
                                    />
                                    <p class="text-default/50 mt-4 text-sm italic">
                                        Нет запланированных<br />занятий на ближайшее время
                                    </p>
                                </div>
                            </div>

                            <div v-else class="flex flex-col gap-4 px-6">
                                <div
                                    v-for="i in 3"
                                    :key="i"
                                    class="flex h-36 flex-col gap-3 rounded-lg p-4"
                                    :class="
                                        isProcessing
                                            ? 'bg-secondary/10 animate-pulse'
                                            : 'bg-mauve-500/5'
                                    "
                                >
                                    <div class="flex items-center gap-2">
                                        <div class="bg-default/10 size-7 rounded-full" />
                                        <div class="bg-default/10 h-3 w-20 rounded-md" />
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <div class="bg-default/20 h-4 w-3/4 rounded-md" />
                                        <div class="bg-default/10 h-3 w-1/2 rounded-md" />
                                    </div>
                                    <div class="bg-default/10 mt-auto h-6 w-full rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UContainer>
        </main>
    </div>
</template>
