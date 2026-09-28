// Управляет выбором кружка и календарного слота времени на странице записи на пробное занятие.
import type { Activity, TrialCheckoutSlot } from "~/types"

// Находит кружок в каталоге по числовому id или строковому slug из URL.
function findClubByParam(param: string | undefined, list: Activity[]): Activity | undefined {
    if (!param) return undefined
    return list.find((c) => String(c.id) === param || c.slug === param)
}

export function useTrialCheckout() {
    const route = useRoute()
    const router = useRouter()
    const activitiesService = useActivitiesService()

    const rawClubQuery = parseQueryParam(route.query.clubId)
    const rawSlotQuery = parseQueryParam(route.query.slotId)
    const initialSlotId =
        rawSlotQuery !== undefined && /^\d+$/.test(rawSlotQuery) ? Number(rawSlotQuery) : undefined

    const {
        data: clubsData,
        status: clubsStatus,
        error: clubsError,
        refresh: refreshClubs
    } = useAsyncData("enrollment:trial:clubs", () => activitiesService.getAll())

    const clubs = computed<Activity[]>(() => clubsData.value ?? [])
    const isClubsLoading = computed(() => clubsStatus.value === "pending")

    // Инициализация кружка: если каталог уже в кэше/SSR, берём сразу
    const initialMatchedClub = findClubByParam(rawClubQuery, clubs.value)
    const selectedClubId = ref<number | undefined>(initialMatchedClub?.id)

    // При первой загрузке каталога находим кружок по параметру из URL без гонок
    watch(
        clubs,
        (loadedClubs) => {
            if (loadedClubs.length === 0) return
            if (selectedClubId.value === undefined && rawClubQuery) {
                const matched = findClubByParam(rawClubQuery, loadedClubs)
                if (matched) {
                    selectedClubId.value = matched.id
                }
            }
        },
        { immediate: true }
    )

    const selectedClub = computed<Activity | undefined>(() =>
        clubs.value.find((c) => c.id === selectedClubId.value)
    )

    // Реактивная загрузка доступных слотов кружка через useAsyncData (поддерживает SSR и watch)
    const {
        data: slotsData,
        status: slotsStatus,
        error: slotsError,
        refresh: refreshSlots
    } = useAsyncData(
        () => `enrollment:trial:slots:${selectedClubId.value ?? "none"}`,
        () => {
            const id = selectedClubId.value
            if (!id) return Promise.resolve([])
            const club = clubs.value.find((c) => c.id === id)
            return activitiesService.getNextTrialSlots(id, club?.name)
        },
        { watch: [selectedClubId] }
    )

    const selectedClubSlots = computed<TrialCheckoutSlot[]>(() => slotsData.value ?? [])
    const isSlotsLoading = computed(() => slotsStatus.value === "pending")

    const selectedSlotId = ref<number | undefined>(initialSlotId)

    // Смена кружка сбрасывает выбранный ранее слот
    watch(selectedClubId, (newClubId, oldClubId) => {
        if (oldClubId !== undefined && newClubId !== oldClubId) {
            selectedSlotId.value = undefined
        }
    })

    // Валидация слота: если слот отсутствует в расписании кружка или занят, сбрасываем выбор
    watch(selectedClubSlots, (slots) => {
        if (slots.length > 0 && selectedSlotId.value !== undefined) {
            const exists = slots.some((s) => s.id === selectedSlotId.value && s.available > 0)
            if (!exists) {
                selectedSlotId.value = undefined
            }
        }
    })

    const selectedSlot = computed<TrialCheckoutSlot | undefined>(() =>
        selectedClubSlots.value.find((s) => s.id === selectedSlotId.value)
    )

    // Отражает фактический выбор в query без дублирования переходов в истории
    function syncQuery(clubId = selectedClubId.value, slotId = selectedSlotId.value) {
        const currentClubQuery = parseQueryParam(route.query.clubId)
        const currentSlotQuery = parseQueryParam(route.query.slotId)
        const targetClubQuery = clubId !== undefined ? String(clubId) : undefined
        const targetSlotQuery = slotId !== undefined ? String(slotId) : undefined

        if (currentClubQuery === targetClubQuery && currentSlotQuery === targetSlotQuery) {
            return
        }

        void router.replace({
            query: {
                ...route.query,
                clubId: targetClubQuery,
                slotId: targetSlotQuery
            }
        })
    }

    watch([selectedClubId, selectedSlotId], ([clubId, slotId]) => {
        syncQuery(clubId, slotId)
    })

    // Очищает невалидный clubId из query только после подтверждённой загрузки каталога
    onMounted(() => {
        if (clubs.value.length > 0 && route.query.clubId && selectedClubId.value === undefined) {
            syncQuery(undefined, undefined)
        }
    })

    return {
        clubs,
        isClubsLoading,
        clubsError,
        refreshClubs,
        selectedClubId,
        selectedClub,
        selectedSlotId,
        selectedClubSlots,
        selectedSlot,
        isSlotsLoading,
        slotsError,
        refreshSlots
    }
}
