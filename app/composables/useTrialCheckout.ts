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

    const {
        data: clubsData,
        status: clubsStatus,
        error: clubsError,
        refresh: refreshClubs
    } = useAsyncData("activities", () => activitiesService.getAll())

    const clubs = computed<Activity[]>(() => clubsData.value ?? [])
    const isClubsLoading = computed(() => clubsStatus.value === "pending")

    // Запрошенный кружок: из URL или клика. Числовой id известен уже в setup на сервере –
    // от него строится ключ слотов, и слоты грузятся параллельно с каталогом.
    const requestedClubParam = ref<string | undefined>(rawClubQuery)
    const requestedClubId = computed<number | undefined>(() => {
        const param = requestedClubParam.value
        return param !== undefined && /^\d+$/.test(param) ? Number(param) : undefined
    })

    // ПОЧЕМУ computed, а не watch: на SSR watch не реагирует на догрузку каталога,
    // и сервер рендерил «кружок не выбран», а клиент – выбранный (hydration mismatch).
    const selectedClubId = computed<number | undefined>({
        get: () => findClubByParam(requestedClubParam.value, clubs.value)?.id,
        set: (id) => {
            if (id !== selectedClubId.value) requestedSlotId.value = undefined
            requestedClubParam.value = id !== undefined ? String(id) : undefined
        }
    })

    const selectedClub = computed<Activity | undefined>(() =>
        clubs.value.find((c) => c.id === selectedClubId.value)
    )

    // Id для запроса слотов: числовой из URL сразу, slug – только после каталога (исключение, см. architecture.md)
    const slotsClubId = computed<number | undefined>(
        () => requestedClubId.value ?? selectedClubId.value
    )

    const {
        data: slotsData,
        status: slotsStatus,
        error: slotsError,
        refresh: refreshSlots
    } = useAsyncData(
        () => `trial-slots:${slotsClubId.value ?? "none"}`,
        () => {
            const id = slotsClubId.value
            if (!id) return Promise.resolve([])
            return activitiesService.getNextTrialSlots(id, selectedClub.value?.name)
        },
        { watch: [slotsClubId] }
    )

    // Слоты показываются только для подтверждённого каталогом кружка
    const selectedClubSlots = computed<TrialCheckoutSlot[]>(() =>
        selectedClubId.value !== undefined ? (slotsData.value ?? []) : []
    )
    const isSlotsLoading = computed(() => slotsStatus.value === "pending")

    const requestedSlotId = ref<number | undefined>(
        rawSlotQuery !== undefined && /^\d+$/.test(rawSlotQuery) ? Number(rawSlotQuery) : undefined
    )

    // Выбор слота тоже выводится: несуществующий или занятый слот из ссылки не выбран ни на сервере, ни на клиенте
    const selectedSlotId = computed<number | undefined>({
        get: () => {
            const id = requestedSlotId.value
            return selectedClubSlots.value.some((s) => s.id === id && s.available > 0)
                ? id
                : undefined
        },
        set: (id) => {
            requestedSlotId.value = id
        }
    })

    const selectedSlot = computed<TrialCheckoutSlot | undefined>(() =>
        selectedClubSlots.value.find((s) => s.id === selectedSlotId.value)
    )

    // Отражает выбор в query без новых записей в истории
    function syncQuery(clubParam: string | undefined, slotId: number | undefined) {
        const targetSlotQuery = slotId !== undefined ? String(slotId) : undefined
        if (
            parseQueryParam(route.query.clubId) === clubParam &&
            parseQueryParam(route.query.slotId) === targetSlotQuery
        ) {
            return
        }
        void router.replace({
            query: { ...route.query, clubId: clubParam, slotId: targetSlotQuery }
        })
    }

    // ПОЧЕМУ следим за запрошенным, а не за выведенным: пока слоты грузятся, выведенный
    // slotId временно undefined, и URL терял бы параметр из ссылки
    watch([requestedClubParam, requestedSlotId], ([clubParam, slotId]) => {
        syncQuery(clubParam, slotId)
    })

    // Убирает из URL невалидные clubId/slotId, когда данные подтвердили, что их нет
    onMounted(() => {
        if (clubs.value.length > 0 && requestedClubParam.value && !selectedClubId.value) {
            requestedClubParam.value = undefined
            requestedSlotId.value = undefined
        } else if (
            slotsStatus.value === "success" &&
            requestedSlotId.value !== undefined &&
            selectedSlotId.value === undefined
        ) {
            requestedSlotId.value = undefined
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
