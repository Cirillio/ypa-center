import { beforeEach, describe, expect, it, vi } from "vitest"
import { usePagedList } from "~/composables/usePagedList"
import type { Page, PageQuery } from "~/types"

// Бэк-заглушка: список из total элементов, режется по limit/offset
function backend(total: number) {
    const all = Array.from({ length: total }, (_, i) => i + 1)
    return vi.fn(
        async ({ limit, offset }: PageQuery): Promise<Page<number>> => ({
            count: total,
            next: null,
            previous: null,
            results: all.slice(offset, offset + limit)
        })
    )
}

let keySeq = 0
const nextKey = () => `paged-test-${++keySeq}`

beforeEach(() => {
    clearNuxtData()
})

describe("usePagedList", () => {
    it("loads the first page with limit=pageSize, offset=0", async () => {
        const fetchPage = backend(12)
        const list = usePagedList(nextKey(), fetchPage, { pageSize: 5 })

        await vi.waitFor(() => expect(list.items.value).toEqual([1, 2, 3, 4, 5]))
        expect(fetchPage).toHaveBeenCalledWith({ limit: 5, offset: 0 })
        expect(list.total.value).toBe(12)
        expect(list.hasMore.value).toBe(true)
    })

    it("appends following pages and stops at count", async () => {
        const fetchPage = backend(12)
        const list = usePagedList(nextKey(), fetchPage, { pageSize: 5 })
        await vi.waitFor(() => expect(list.items.value).toHaveLength(5))

        await list.loadMore()
        expect(fetchPage).toHaveBeenLastCalledWith({ limit: 5, offset: 5 })
        await list.loadMore()
        expect(fetchPage).toHaveBeenLastCalledWith({ limit: 5, offset: 10 })

        expect(list.items.value).toEqual(Array.from({ length: 12 }, (_, i) => i + 1))
        expect(list.hasMore.value).toBe(false)

        await list.loadMore()
        expect(fetchPage).toHaveBeenCalledTimes(3)
    })

    it("ignores a second click while a page is loading", async () => {
        const fetchPage = backend(20)
        const list = usePagedList(nextKey(), fetchPage, { pageSize: 5 })
        await vi.waitFor(() => expect(list.items.value).toHaveLength(5))

        await Promise.all([list.loadMore(), list.loadMore()])
        expect(fetchPage).toHaveBeenCalledTimes(2)
        expect(list.items.value).toHaveLength(10)
    })

    it("keeps loaded items and exposes the error when a next page fails", async () => {
        const fetchPage = backend(12)
        const list = usePagedList(nextKey(), fetchPage, { pageSize: 5 })
        await vi.waitFor(() => expect(list.items.value).toHaveLength(5))

        const error = new Error("offline")
        fetchPage.mockRejectedValueOnce(error)
        await list.loadMore()

        expect(list.items.value).toEqual([1, 2, 3, 4, 5])
        expect(list.loadMoreError.value).toBe(error)
        expect(list.isLoadingMore.value).toBe(false)

        await list.loadMore()
        expect(list.items.value).toHaveLength(10)
        expect(list.loadMoreError.value).toBeNull()
    })

    it("drops the loaded tail on refresh", async () => {
        const fetchPage = backend(12)
        const list = usePagedList(nextKey(), fetchPage, { pageSize: 5 })
        await vi.waitFor(() => expect(list.items.value).toHaveLength(5))
        await list.loadMore()
        expect(list.items.value).toHaveLength(10)

        await list.refresh()
        await vi.waitFor(() => expect(list.items.value).toEqual([1, 2, 3, 4, 5]))
    })

    it("uses the fresh count from the last page", async () => {
        const fetchPage = backend(12)
        const list = usePagedList(nextKey(), fetchPage, { pageSize: 5 })
        await vi.waitFor(() => expect(list.items.value).toHaveLength(5))

        // Пока пользователь листал, одна запись исчезла
        fetchPage.mockResolvedValueOnce({
            count: 9,
            next: null,
            previous: null,
            results: [6, 7, 8, 9]
        })
        await list.loadMore()
        expect(list.total.value).toBe(9)
        expect(list.hasMore.value).toBe(false)
    })

    it("does not load until executed when immediate is false", async () => {
        const fetchPage = backend(3)
        const list = usePagedList(nextKey(), fetchPage, { immediate: false })
        expect(list.items.value).toBeUndefined()
        expect(fetchPage).not.toHaveBeenCalled()

        await list.execute()
        expect(list.items.value).toEqual([1, 2, 3])
    })
})
