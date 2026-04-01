import type { ClubShort, EventShort, GalleryImage } from "~/types"

export const MOCK_CLUBS: ClubShort[] = [
    {
        title: "Настольные игры",
        shortDesc: "Развиваем логику и стратегическое мышление через увлекательные настольные игры",
        img: "moke/club_1.jpg",
        to: "/clubs#board-games"
    },
    {
        title: "Каникулы",
        shortDesc: "Организуем яркий и полезный досуг во время школьных каникул.",
        img: "moke/club_4.jpg",
        to: "/clubs#holidays"
    },
    {
        title: "Рисование",
        shortDesc: "Раскрываем творческий потенциал через живопись и художественное творчество",
        img: "moke/club_2.jpg",
        to: "/clubs#drawing"
    },
    {
        title: "Пианино",
        shortDesc: "Обучаем игре на фортепиано с нуля",
        img: "moke/club_3.jpg",
        to: "/clubs#piano"
    }
]

export const MOCK_EVENTS: EventShort[] = [
    {
        id: "event-1",
        label: "Театральные игры",
        description: "Интерактивные занятия с элементами актёрского мастерства для детей 6–10 лет.",
        img: "moke/event-1.jpeg",
        date: "2026-04-12",
        time: "11:00",
        price: "500р",
        isPinned: false
    },
    {
        id: "event-2",
        label: "Игры для самых маленьких",
        description: "Развивающие и сенсорные игры для детей 2–4 лет с педагогом.",
        img: "moke/event-2.jpg",
        date: "2026-04-15",
        time: "10:00",
        price: "300р",
        isPinned: false
    },
    {
        id: "event-3",
        label: "Игровой клуб",
        description: "Свободная игровая зона и настольные игры для семейных посещений.",
        img: "moke/event-3.jpg",
        date: "2026-04-18",
        time: "17:00",
        price: null,
        isPinned: false
    },
    {
        id: "event-4",
        label: "Космическая лекция",
        description: "Путешествие по Солнечной системе с демонстрациями и мастер-классом.",
        img: "moke/event-4.jpg",
        date: "2026-04-20",
        time: "18:30",
        price: "700р",
        isPinned: true
    }
]

export const MOCK_GALLERY_IMAGES: GalleryImage[] = [
    { src: "moke/club_1.jpg", alt: "Настольные игры" },
    { src: "moke/event-1.jpeg", alt: "Театральные игры" },
    { src: "moke/club_2.jpg", alt: "Рисование" },
    { src: "moke/event-4.jpg", alt: "Космическая лекция" }
]
