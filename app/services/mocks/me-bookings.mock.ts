// Мок-данные для эндпоинта /me/bookings/ на период до готовности бэкенда.
export interface BookingItemDraftDto {
    id: string | number
    kind: "TRIAL" | "EVENT"
    source_id: number
    title: string
    group_name?: string | null
    student_name?: string | null
    attendees_count?: number | null
    date: string
    time: string
    purchase_price: number
}

const mockData: BookingItemDraftDto[] = [
    {
        id: "b-1",
        kind: "TRIAL",
        source_id: 101,
        title: "Робототехника LEGO",
        group_name: "Группа 1 (Старт)",
        student_name: "Иван",
        date: "2026-10-02",
        time: "16:00-17:00",
        purchase_price: 120000
    },
    {
        id: "b-2",
        kind: "EVENT",
        source_id: 201,
        title: "Мастер-класс: Сборка квадрокоптера",
        group_name: null,
        attendees_count: 2,
        date: "2026-10-05",
        time: "14:00-16:00",
        purchase_price: 300000
    },
    {
        id: "b-3",
        kind: "TRIAL",
        source_id: 102,
        title: "Шахматный клуб «Белая ладья»",
        group_name: "Младшая группа",
        student_name: "Анна",
        date: "2026-10-07",
        time: "18:00-19:00",
        purchase_price: 120000
    },
    {
        id: "b-4",
        kind: "EVENT",
        source_id: 202,
        title: "Турнир по спидкубингу",
        group_name: null,
        attendees_count: 1,
        date: "2026-10-12",
        time: "12:00-14:30",
        purchase_price: 150000
    },
    {
        id: "b-5",
        kind: "TRIAL",
        source_id: 103,
        title: "Каллиграфия и леттеринг",
        group_name: "Группа СБ",
        student_name: "Иван",
        date: "2026-10-17",
        time: "11:00-12:00",
        purchase_price: 120000
    },
    {
        id: "b-6",
        kind: "EVENT",
        source_id: 203,
        title: "Научное шоу: Магия физики",
        group_name: null,
        attendees_count: 3,
        date: "2026-10-24",
        time: "15:00-16:30",
        purchase_price: 450000
    },
    {
        id: "b-7",
        kind: "TRIAL",
        source_id: 104,
        title: "Программирование на Scratch",
        group_name: "Начинающие",
        student_name: "Анна",
        date: "2026-10-29",
        time: "17:30-18:30",
        purchase_price: 120000
    }
]

export async function mockBookings(): Promise<BookingItemDraftDto[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return [...mockData]
}
