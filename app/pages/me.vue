<script lang="ts" setup>
// Страница личного кабинета родителя: профиль, абонементы, разовые записи и лента активностей.
import type { MeChild } from "~/types"

definePageMeta({ middleware: "auth" })
useSeoMeta({ title: "Личный кабинет" })

const authStore = useAuthStore()
const route = useRoute()

// 1. Слой данных
const {
    data: profileData,
    pending: isProfilePending,
    error: profileError,
    refresh: refreshProfile
} = useMeProfile()

// Перенаправляет на анкету /login, если профиль авторизованного пользователя ещё не заполнен.
watch(
    () => profileData.value?.isComplete,
    (isComplete) => {
        if (profileData.value && isComplete === false) {
            void navigateTo({ path: "/login", query: { redirectFrom: route.fullPath } })
        }
    },
    { immediate: true }
)

const subscriptions = useMeSubscriptions()
const bookings = useMeBookings()

const {
    data: upcomingData,
    pending: isUpcomingPending,
    error: upcomingError,
    refresh: refreshUpcoming
} = useMeUpcoming()

// 2. Управление детьми
const toast = useToast()
const {
    children: cabinetChildren,
    isSaving: isChildSaving,
    addChild: addChildBase,
    isDeleting: isChildDeleting,
    deleteError: childDeleteError,
    deleteBlockers: childDeleteBlockers,
    deleteChild,
    resetDeleteState
} = useCabinetChildren(() => profileData.value, refreshProfile)

const addChild = async (payload: Parameters<typeof addChildBase>[0]) => {
    try {
        await addChildBase(payload)
    } catch {
        toast.add({
            title: "Не удалось добавить ребёнка",
            description: "Проверьте данные и попробуйте снова.",
            icon: "ph:x-circle-bold",
            color: "error"
        })
    }
}

const childToDelete = ref<MeChild | null>(null)
const isDeleteModalOpen = ref<boolean>(false)
const hasDeleteConfirmOpened = ref<boolean>(false)

const openDeleteModal = (child: MeChild) => {
    hasDeleteConfirmOpened.value = true
    resetDeleteState()
    childToDelete.value = child
    isDeleteModalOpen.value = true
}

const confirmDeleteChild = async () => {
    const child = childToDelete.value
    if (!child) return
    const deleted = await deleteChild(child.id)
    if (!deleted) return
    isDeleteModalOpen.value = false
    toast.add({
        title: `${child.name} удалён из профиля`,
        icon: "ph:check-circle-bold",
        color: "success"
    })
}

// 3. Модалка выхода
const modalOpen = ref<boolean>(false)
const hasLeaveConfirmOpened = ref<boolean>(false)

const openConfirmModal = () => {
    hasLeaveConfirmOpened.value = true
    modalOpen.value = true
}

const handleLogout = async () => {
    await authStore.logout()
    await navigateTo("/login")
}

const parent = computed(() => profileData.value?.parent)
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <LazyMeParentLeaveConfirm
            v-if="hasLeaveConfirmOpened"
            v-model="modalOpen"
            @confirm="handleLogout"
        />
        <LazyMeParentChildDeleteConfirm
            v-if="hasDeleteConfirmOpened"
            v-model:open="isDeleteModalOpen"
            :child-name="childToDelete?.name ?? ''"
            :is-deleting="isChildDeleting"
            :blockers="childDeleteBlockers"
            :error="childDeleteError"
            @confirm="confirmDeleteChild"
        />

        <MeParentHeader :parent-name="parent?.name" @logout="openConfirmModal">
            <template #actions>
                <MeDepositWidget v-if="profileData?.isComplete" />
            </template>
        </MeParentHeader>

        <section aria-label="Личный кабинет" class="pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex flex-col gap-6 lg:col-span-5">
                    <MeParentWidget
                        :parent="parent"
                        :children="profileData ? cabinetChildren : undefined"
                        :is-processing="isProfilePending"
                        :is-saving="isChildSaving"
                        :error="profileError"
                        @add-child="addChild"
                        @remove-child="openDeleteModal"
                        @retry="refreshProfile"
                    />

                    <!-- Две колонки: Абонементы | Наши записи -->
                    <div class="grid items-start gap-6 xl:grid-cols-2">
                        <MeSubscriptionsWidget
                            :subscriptions="subscriptions.items.value"
                            :has-more="subscriptions.hasMore.value"
                            :is-loading-more="subscriptions.isLoadingMore.value"
                            :load-more-error="subscriptions.loadMoreError.value"
                            :is-processing="subscriptions.pending.value"
                            :error="subscriptions.error.value"
                            @retry="subscriptions.refresh()"
                            @load-more="subscriptions.loadMore()"
                        />
                        <MeBookingsWidget
                            :bookings="bookings.items.value"
                            :has-more="bookings.hasMore.value"
                            :is-loading-more="bookings.isLoadingMore.value"
                            :load-more-error="bookings.loadMoreError.value"
                            :is-processing="bookings.pending.value"
                            :error="bookings.error.value"
                            @retry="bookings.refresh()"
                            @load-more="bookings.loadMore()"
                        />
                    </div>
                </div>

                <!-- Правая колонка: Лента активностей -->
                <div class="lg:col-span-2">
                    <MeUpcomingWidget
                        :items="upcomingData"
                        :is-processing="isUpcomingPending"
                        :error="upcomingError"
                        @retry="refreshUpcoming"
                    />
                </div>
            </UContainer>
        </section>
    </div>
</template>
