import type { Page, PageQuery } from "~/types"

interface UsePagedListOptions {
    pageSize?: number
    immediate?: boolean
}

// Грузит список страницами с бэка (limit/offset) и дописывает следующие по «Показать ещё».
export function usePagedList<T>(
    key: string,
    fetchPage: (query: PageQuery) => Promise<Page<T>>,
    { pageSize = 5, immediate = true }: UsePagedListOptions = {}
) {
    const first = useAsyncData(key, () => fetchPage({ limit: pageSize, offset: 0 }), {
        server: false,
        immediate
    })

    const tail = shallowRef<T[]>([])
    const tailCount = ref<number | null>(null)
    const isLoadingMore = ref<boolean>(false)
    const loadMoreError = ref<unknown>(null)

    // ПОЧЕМУ: refresh перезагружает первую страницу – дозагруженный хвост к ней уже не относится
    watch(first.data, () => {
        tail.value = []
        tailCount.value = null
        loadMoreError.value = null
    })

    const items = computed<T[] | undefined>(() =>
        first.data.value ? [...first.data.value.results, ...tail.value] : undefined
    )
    const total = computed<number>(() => tailCount.value ?? first.data.value?.count ?? 0)
    const hasMore = computed<boolean>(() => (items.value?.length ?? 0) < total.value)

    async function loadMore(): Promise<void> {
        if (isLoadingMore.value || !items.value || !hasMore.value) return

        isLoadingMore.value = true
        loadMoreError.value = null
        try {
            const page = await fetchPage({ limit: pageSize, offset: items.value.length })
            tail.value = [...tail.value, ...page.results]
            tailCount.value = page.count
        } catch (err: unknown) {
            loadMoreError.value = err
        } finally {
            isLoadingMore.value = false
        }
    }

    return {
        items,
        total,
        hasMore,
        isLoadingMore: readonly(isLoadingMore),
        loadMoreError: readonly(loadMoreError),
        loadMore,
        pending: first.pending,
        error: first.error,
        status: first.status,
        refresh: first.refresh,
        execute: first.execute
    }
}
