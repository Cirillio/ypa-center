import type { StatusData } from "~/types/status"
import type { ClubWithSlots, WeeklySlot } from "~/types"

export const MOCK_WEEKLY_SLOTS: WeeklySlot[] = [
    // ПОНЕДЕЛЬНИК (dayOfWeek: 1)
    {
        id: 1,
        activity: { id: 1, name: "Кружок Мышления: Возвращение легенды" },
        dayOfWeek: 1,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 1
    },
    {
        id: 2,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 1,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 4
    },
    {
        id: 3,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 1,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 4
    },

    // ВТОРНИК (dayOfWeek: 2)
    {
        id: 4,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 2,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 1
    },
    {
        id: 5,
        activity: { id: 2, name: "Творчество" },
        dayOfWeek: 2,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "Творчество",
        maxCapacity: 6,
        available: 3
    },
    {
        id: 6,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 2,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 2
    },
    {
        id: 7,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 2,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "АЯ ВПР (7-8 кл)",
        maxCapacity: 6,
        available: 4
    },
    {
        id: 8,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 2,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 6
    },
    {
        id: 9,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 2,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "5 o'clock T (2-6 кл)",
        maxCapacity: 6,
        available: 0
    },

    // СРЕДА (dayOfWeek: 3)
    {
        id: 10,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 3,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 1
    },
    {
        id: 11,
        activity: { id: 4, name: "Рукоделие" },
        dayOfWeek: 3,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "Рукоделие",
        maxCapacity: 6,
        available: 0
    },
    {
        id: 12,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 3,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 5
    },
    {
        id: 13,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 3,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "АЯ ДЗ (2-6 кл)",
        maxCapacity: 6,
        available: 1
    },
    {
        id: 14,
        activity: { id: 7, name: "Настольные игры" },
        dayOfWeek: 3,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "Настольные игры",
        maxCapacity: 6,
        available: 6 // По предварительной записи
    },

    // ЧЕТВЕРГ (dayOfWeek: 4)
    {
        id: 15,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 4,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 2
    },
    {
        id: 16,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 4,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 4
    },
    {
        id: 17,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 4,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "АЯ exams (ОГЭ+ЕГЭ)",
        maxCapacity: 6,
        available: 1
    },
    {
        id: 18,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 4,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 6
    },
    {
        id: 19,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 4,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "5 o'clock T",
        maxCapacity: 6,
        available: 0
    },

    // ПЯТНИЦА (dayOfWeek: 5)
    {
        id: 20,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 5,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 0
    },
    {
        id: 21,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 5,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 3
    },
    {
        id: 22,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 5,
        startTime: "16:00",
        endTime: "17:00",
        groupName: "АЯ ДЗ (2-6 кл)",
        maxCapacity: 6,
        available: 1
    },
    {
        id: 23,
        activity: { id: 1, name: "Кружок Мышления" },
        dayOfWeek: 5,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "КМ",
        maxCapacity: 6,
        available: 2
    },
    {
        id: 24,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 5,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "АЯ подростки (7-9 кл)",
        maxCapacity: 6,
        available: 3
    },

    // СУББОТА (dayOfWeek: 6)
    {
        id: 25,
        activity: { id: 3, name: "Английский язык" },
        dayOfWeek: 6,
        startTime: "10:00",
        endTime: "11:00",
        groupName: "English 1 кл",
        maxCapacity: 6,
        available: 3
    },
    {
        id: 26,
        activity: { id: 6, name: "ГДЕЁЖ" },
        dayOfWeek: 6,
        startTime: "11:00",
        endTime: "13:30",
        groupName: "ГДЕЁЖ подготовка к школе",
        maxCapacity: 6,
        available: 3
    }
]

export const MOCK_CLUBS_WITH_SLOTS: ClubWithSlots[] = [
    {
        id: "thinking-club",
        title: "Кружок Мышления",
        shortDesc: "Развиваем логику, память и нестандартное мышление через авторские методики.",
        img: "moke/club_1.jpg",
        slots: MOCK_WEEKLY_SLOTS.filter((s) => s.activity.id === 1)
    },
    {
        id: "english",
        title: "Английский язык",
        shortDesc: "Изучаем язык через игры и живое общение для детей всех возрастов.",
        img: "moke/club_2.jpg",
        slots: MOCK_WEEKLY_SLOTS.filter((s) => s.activity.id === 3)
    },
    {
        id: "creativity",
        title: "Творчество и Рукоделие",
        shortDesc: "Раскрываем таланты через рисование, лепку и создание уникальных поделок.",
        img: "moke/club_3.jpg",
        slots: MOCK_WEEKLY_SLOTS.filter((s) => s.activity.id === 2 || s.activity.id === 4)
    },
    {
        id: "pre-school",
        title: "Подготовка к школе",
        shortDesc: "Комплексная подготовка: чтение, письмо и математика в игровой форме.",
        img: "moke/club_4.jpg",
        slots: MOCK_WEEKLY_SLOTS.filter((s) => s.activity.id === 6)
    },
    {
        id: "board-games",
        title: "Настольные игры",
        shortDesc: "Развиваем стратегическое мышление и навыки общения в игровом клубе.",
        img: "moke/event-3.jpg",
        slots: MOCK_WEEKLY_SLOTS.filter((s) => s.activity.id === 7)
    }
]

export const MOCK_STATUS_DATA: StatusData = {
    parent: {
        name: "Иванова Ольга Евгеньевна",
        phone: "+7 (999) 999-99-99",
        email: "olga.e@example.com"
    },
    children: [
        {
            name: "Иванов Иван",
            birthdate: "12.03.2015"
        },
        {
            name: "Иванова Марья",
            birthdate: "11.06.2017"
        }
    ],
    subscriptions: [
        {
            id: "FSA32-7JH3",
            createdAt: "2024-05-20T14:30:00Z",
            isExpired: false,
            sum: "12.000",
            participant: {
                name: "Иванов Иван"
            },
            clubs: [
                {
                    name: "Кружок мышления",
                    subgroup: {
                        name: "Общая",
                        capacity: 6
                    },
                    weeklySlot: {
                        dayOfWeek: "Пн",
                        startTime: "16:00",
                        endTime: "17:00"
                    },
                    left: 2,
                    maxUses: 4
                },
                {
                    name: "Английский язык",
                    subgroup: {
                        name: "Начинающие",
                        capacity: 8
                    },
                    weeklySlot: {
                        dayOfWeek: "Ср",
                        startTime: "17:30",
                        endTime: "18:30"
                    },
                    left: 0,
                    maxUses: 4
                },
                {
                    name: "Шахматы",
                    subgroup: {
                        name: "Продвинутые",
                        capacity: 10
                    },
                    weeklySlot: {
                        dayOfWeek: "Пт",
                        startTime: "15:00",
                        endTime: "16:00"
                    },
                    left: 4,
                    maxUses: 4
                }
            ]
        },
        {
            id: "BIG-SUB-777",
            createdAt: "2024-07-01T12:00:00Z",
            isExpired: false,
            sum: "25.000",
            participant: {
                name: "Иванов Иван"
            },
            clubs: [
                {
                    name: "Кружок мышления",
                    subgroup: { name: "Общая", capacity: 6 },
                    weeklySlot: { dayOfWeek: "Пн", startTime: "16:00", endTime: "17:00" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Английский язык",
                    subgroup: { name: "Начинающие", capacity: 8 },
                    weeklySlot: { dayOfWeek: "Вт", startTime: "17:00", endTime: "18:00" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Шахматы",
                    subgroup: { name: "Продвинутые", capacity: 10 },
                    weeklySlot: { dayOfWeek: "Ср", startTime: "15:00", endTime: "16:00" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Робототехника",
                    subgroup: { name: "Базовая", capacity: 10 },
                    weeklySlot: { dayOfWeek: "Чт", startTime: "16:00", endTime: "17:30" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Рисование",
                    subgroup: { name: "Младшая", capacity: 12 },
                    weeklySlot: { dayOfWeek: "Пт", startTime: "15:00", endTime: "16:00" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Танцы",
                    subgroup: { name: "Ритмика", capacity: 15 },
                    weeklySlot: { dayOfWeek: "Сб", startTime: "11:00", endTime: "12:00" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Гитара",
                    subgroup: { name: "Индивидуально", capacity: 1 },
                    weeklySlot: { dayOfWeek: "Вс", startTime: "12:00", endTime: "13:00" },
                    left: 4,
                    maxUses: 4
                },
                {
                    name: "Программирование",
                    subgroup: { name: "Python", capacity: 8 },
                    weeklySlot: { dayOfWeek: "Пн", startTime: "18:00", endTime: "19:30" },
                    left: 4,
                    maxUses: 4
                }
            ]
        },
        {
            id: "KLS99-2XP1",
            createdAt: "2024-06-01T10:00:00Z",
            isExpired: false,
            sum: "8.500",
            participant: {
                name: "Иванова Марья"
            },
            clubs: [
                {
                    name: "Рисование",
                    subgroup: {
                        name: "Младшая",
                        capacity: 12
                    },
                    weeklySlot: {
                        dayOfWeek: "Вт",
                        startTime: "15:00",
                        endTime: "16:00"
                    },
                    left: 3,
                    maxUses: 4
                },
                {
                    name: "Танцы",
                    subgroup: {
                        name: "Ритмика",
                        capacity: 15
                    },
                    weeklySlot: {
                        dayOfWeek: "Чт",
                        startTime: "16:30",
                        endTime: "17:30"
                    },
                    left: 4,
                    maxUses: 4
                }
            ]
        },
        {
            id: "EXP00-9ZZ9",
            createdAt: "2023-12-15T09:00:00Z",
            isExpired: true,
            sum: "5.000",
            participant: {
                name: "Иванов Иван"
            },
            clubs: [
                {
                    name: "Робототехника",
                    subgroup: {
                        name: "Базовая",
                        capacity: 10
                    },
                    weeklySlot: {
                        dayOfWeek: "Сб",
                        startTime: "10:00",
                        endTime: "11:30"
                    },
                    left: 0,
                    maxUses: 8
                }
            ]
        }
    ],
    trials: [
        {
            id: "AR90-5HP1",
            participant: {
                name: "Иванов Иван"
            },
            sum: "1200",
            createdAt: "2026-05-10T14:30:00Z",
            club: {
                name: "Английский язык",
                subgroup: {
                    name: "Начинающие",
                    capacity: 8
                }
            },
            dateTime: {
                date: "2026-05-15",
                startTime: "17:30",
                endTime: "18:30"
            }
        }
    ],
    events: [
        {
            id: "UH65-GP10",
            participant: {
                name: "Иванова Ольга"
            },
            sum: "1200",
            createdAt: "2026-05-11T15:33:11Z",
            event: {
                name: "Настольные игры",
                capacity: 9
            },
            dateTime: {
                date: "2026-05-21",
                startTime: "19:00",
                endTime: "22:00"
            }
        }
    ]
}
