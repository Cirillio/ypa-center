// Пробные и события родителя одним списком: предстоящие по близости, затем прошедшие.
export function useMeBookings() {
    const me = useMeService()
    return usePagedList("me-bookings", (query) => me.getBookingsPage(query))
}
