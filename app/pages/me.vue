<script lang="ts" setup>
import type { MeUpcoming } from "~/types"

definePageMeta({ middleware: "auth" })

const authStore = useAuthStore()

// 1. Слой данных (сервисы отдают уже доменные модели)
const { data: profileData, pending: isProfilePending, refresh: refreshProfile } = useMeProfile()

const { data: subscriptionsData, pending: isSubsPending } = useMeSubscriptions()

const { data: upcomingData, pending: isUpcomingPending } = useMeUpcoming()

const isProcessing = computed(
    () => isProfilePending.value || isSubsPending.value || isUpcomingPending.value
)

// Управление детьми
const {
    children: cabinetChildren,
    isSaving: isChildSaving,
    addChild
} = useCabinetChildren(() => profileData.value, refreshProfile)

// Модалка выхода
const modalOpen = ref<boolean>(false)

const openConfirmModal = () => {
    modalOpen.value = true
}

const handleLogout = async () => {
    await authStore.logout()
    await navigateTo("/login")
}

const parent = computed(() => profileData.value?.parent)

const sortedSubscriptions = computed(() => {
    if (!subscriptionsData.value) return undefined
    return [...subscriptionsData.value].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})

const upcomingActivities = computed(() => upcomingData.value)

// Пагинация списков
const PAGE_SIZE = 5
const subscriptionsShown = ref(PAGE_SIZE)
const upcomingShown = ref(PAGE_SIZE)

const visibleSubscriptions = computed(() =>
    sortedSubscriptions.value?.slice(0, subscriptionsShown.value)
)
const hasMoreSubscriptions = computed(
    () => (sortedSubscriptions.value?.length ?? 0) > subscriptionsShown.value
)

const visibleUpcoming = computed(() => upcomingActivities.value?.slice(0, upcomingShown.value))
const hasMoreUpcoming = computed(
    () => (upcomingActivities.value?.length ?? 0) > upcomingShown.value
)

// Группировка ближайших активностей по дате (серверный фид уже предсортирован)
const groupedUpcoming = computed(() => {
    const items = visibleUpcoming.value
    if (!items) return undefined

    const groups: { date: string; items: MeUpcoming[] }[] = []
    for (const item of items) {
        const last = groups[groups.length - 1]
        if (last && last.date === item.displayDate) {
            last.items.push(item)
        } else {
            groups.push({ date: item.displayDate, items: [item] })
        }
    }
    return groups
})
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <MeLeaveConfirm v-model="modalOpen" @on-confirm="handleLogout" />

        <MeSection :parent-name="parent?.name" @on-confirm-logout="openConfirmModal" />

        <main class="pb-16">
            <UContainer class="grid gap-4 lg:grid-cols-7">
                <div class="flex flex-col gap-4 lg:col-span-5">
                    <!-- 2a совмещённый профиль+дети -->
                    <div class="rounded-lg bg-white p-6">
                        <div class="grid gap-6 md:grid-cols-2">
                            <MeParentInfo :parent="parent" :is-processing="isProcessing" />
                            <MeChildrenInfo
                                :children="profileData ? cabinetChildren : undefined"
                                :is-processing="isProcessing"
                                :is-saving="isChildSaving"
                                class="border-default border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6"
                                @add="addChild"
                            />
                        </div>
                    </div>

                    <!-- 2b абонементы + Показать ещё -->
                    <div class="flex flex-col gap-6 rounded-lg bg-white p-6">
                        <MeSubscriptionsList
                            :subscriptions="visibleSubscriptions"
                            :is-processing="isProcessing"
                        />
                        <UButton
                            v-if="hasMoreSubscriptions"
                            variant="soft"
                            block
                            label="Показать ещё"
                            @click="void (subscriptionsShown += PAGE_SIZE)"
                        />
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <!-- 2c лента активностей, sticky -->
                    <div
                        class="sticky top-[calc(var(--ui-header-height)+1rem)] flex flex-col gap-6 rounded-lg bg-white p-6"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
                            >
                                <UIcon name="ph:calendar-dot-bold" class="size-5" />
                            </div>
                            <h2 class="text-primary text-xl font-bold">Ближайшие активности</h2>
                        </div>

                        <div v-if="groupedUpcoming" class="flex flex-col gap-4">
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
                                    <MeUpcomingActivityCard
                                        v-for="activity in group.items"
                                        :key="activity.id"
                                        :item="activity"
                                    />
                                </div>

                                <UButton
                                    v-if="hasMoreUpcoming"
                                    variant="soft"
                                    block
                                    label="Показать ещё"
                                    @click="void (upcomingShown += PAGE_SIZE)"
                                />
                            </template>
                            <div v-else class="flex flex-col items-center py-8 text-center">
                                <UIcon name="ph:calendar-x-bold" class="text-default/10 size-16" />
                                <p class="text-default/50 mt-4 text-sm italic">
                                    Нет запланированных<br />занятий на ближайшее время
                                </p>
                            </div>
                        </div>

                        <div v-else class="flex flex-col gap-4">
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
            </UContainer>
        </main>
    </div>
</template>
