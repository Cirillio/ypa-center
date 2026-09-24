<script lang="ts" setup>
// Страница личного кабинета родителя: профиль, абонементы, разовые записи и лента активностей.
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

const {
    data: subscriptionsData,
    pending: isSubsPending,
    error: subscriptionsError,
    refresh: refreshSubscriptions
} = useMeSubscriptions()

const {
    data: bookingsData,
    pending: isBookingsPending,
    error: bookingsError,
    refresh: refreshBookings
} = useMeBookings()

const {
    data: upcomingData,
    pending: isUpcomingPending,
    error: upcomingError,
    refresh: refreshUpcoming
} = useMeUpcoming()

const isProcessing = computed(
    () =>
        isProfilePending.value ||
        isSubsPending.value ||
        isBookingsPending.value ||
        isUpcomingPending.value
)

// Управление детьми
const toast = useToast()
const {
    children: cabinetChildren,
    isSaving: isChildSaving,
    addChild: addChildBase
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
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <MeParentLeaveConfirm v-model="modalOpen" @confirm="handleLogout" />

        <MeParentHeader :parent-name="parent?.name" @logout="openConfirmModal" />

        <section aria-label="Личный кабинет" class="pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex flex-col gap-6 lg:col-span-5">
                    <MeParentWidget
                        :parent="parent"
                        :children="profileData ? cabinetChildren : undefined"
                        :is-processing="isProcessing"
                        :is-saving="isChildSaving"
                        :error="profileError"
                        @add-child="addChild"
                        @retry="refreshProfile"
                    />

                    <!-- Две колонки: Абонементы | Наши записи -->
                    <div class="grid items-start gap-6 xl:grid-cols-2">
                        <MeSubscriptionsWidget
                            :subscriptions="subscriptionsData"
                            :is-processing="isProcessing"
                            :error="subscriptionsError"
                            @retry="refreshSubscriptions"
                        />
                        <MeBookingsWidget
                            :bookings="bookingsData"
                            :is-processing="isProcessing"
                            :error="bookingsError"
                            @retry="refreshBookings"
                        />
                    </div>
                </div>

                <!-- Правая колонка: Лента активностей -->
                <div class="lg:col-span-2">
                    <MeUpcomingWidget
                        :items="upcomingData"
                        :is-processing="isProcessing"
                        :error="upcomingError"
                        @retry="refreshUpcoming"
                    />
                </div>
            </UContainer>
        </section>
    </div>
</template>
