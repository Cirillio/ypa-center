// Управляет постраничным раскрытием клиентского списка элементов ("Показать ещё").
export function useShowMore<T>(items: Ref<T[] | undefined>, pageSize = 5) {
    const limit = ref<number>(pageSize)
    const visible = computed(() => items.value?.slice(0, limit.value))
    const hasMore = computed(() => (items.value?.length ?? 0) > limit.value)

    const showMore = () => {
        limit.value += pageSize
    }

    const reset = () => {
        limit.value = pageSize
    }

    return {
        limit,
        visible,
        hasMore,
        showMore,
        reset
    }
}
