<script lang="ts" setup>
// Страница личного кабинета родителя: профиль, абонементы, разовые записи и лента активностей.
definePageMeta({ middleware: "auth" })

const authStore = useAuthStore()

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
            void navigateTo("/login")
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

        <main class="pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex flex-col gap-6 lg:col-span-5">
                    <!-- Блок родитель + дети -->
                    <div class="rounded-lg bg-white p-6">
                        <MeErrorState
                            v-if="profileError && !profileData"
                            message="Не удалось загрузить профиль."
                            @retry="refreshProfile"
                        />
                        <div v-else class="grid gap-6 md:grid-cols-2">
                            <MeParentInfo :parent="parent" :is-processing="isProcessing" />
                            <MeParentChildren
                                :children="profileData ? cabinetChildren : undefined"
                                :is-processing="isProcessing"
                                :is-saving="isChildSaving"
                                class="border-default border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6"
                                @add="addChild"
                            />
                        </div>
                    </div>

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
        </main>
    </div>
</template>
