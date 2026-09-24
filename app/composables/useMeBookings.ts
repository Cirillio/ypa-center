// Загружает список записей родителя (события и пробные занятия) из сервиса кабинета.
export function useMeBookings() {
    const me = useMeService()
    return useAsyncData("me-bookings", () => me.getBookings(), { server: false })
}
