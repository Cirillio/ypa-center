import type { Club, ClubShort, EventShort, GalleryImage, GalleryPhoto, Teacher } from "~/types"

export const MOCK_CLUBS: ClubShort[] = [
    {
        title: "Настольные игры",
        shortDesc: "Развиваем логику и стратегическое мышление через увлекательные настольные игры",
        img: "moke/club_1.jpg"
    },
    {
        title: "Каникулы",
        shortDesc: "Организуем яркий и полезный досуг во время школьных каникул.",
        img: "moke/club_4.jpg"
    },
    {
        title: "Рисование",
        shortDesc: "Раскрываем творческий потенциал через живопись и художественное творчество",
        img: "moke/club_2.jpg"
    },
    {
        title: "Пианино",
        shortDesc: "Обучаем игре на фортепиано с нуля",
        img: "moke/club_3.jpg"
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

export const MOCK_CLUBS_FULL: Club[] = [
    {
        id: 1,
        name: "Настольные игры",
        slug: "board-games",
        description:
            "Развиваем логику, стратегическое мышление и умение работать в команде через увлекательные настольные игры.",
        photo: "moke/club_1.jpg",
        teacher: { name: "Мария Коваль", photo: "moke/teacher_1.jpg" },
        schedule: { days: ["Пн", "Ср", "Пт"], timeStart: "16:00", timeEnd: "17:00" },
        age: { min: 6, max: 12 },
        price: 120000,
        spots_total: 10,
        spots_available: 6
    },
    {
        id: 2,
        name: "Рисование",
        slug: "drawing",
        description:
            "Раскрываем творческий потенциал через живопись, графику и художественное творчество. Работаем с акварелью, гуашью и пастелью.",
        photo: "moke/club_2.jpg",
        teacher: { name: "Ольга Ненашева", photo: "moke/teacher_2.jpg" },
        schedule: { days: ["Вт", "Чт"], timeStart: "15:00", timeEnd: "16:30" },
        age: { min: 4, max: 10 },
        price: 150000,
        spots_total: 8,
        spots_available: 2
    },
    {
        id: 3,
        name: "Пианино",
        slug: "piano",
        description:
            "Обучаем игре на фортепиано с нуля: нотная грамота, техника, разбор произведений классиков и современных авторов.",
        photo: "moke/club_3.jpg",
        teacher: { name: "Дмитрий Шаров", photo: "moke/teacher_3.jpg" },
        schedule: { days: ["Пн", "Чт"], timeStart: "17:00", timeEnd: "17:45" },
        age: { min: 5, max: 14 },
        price: 180000,
        spots_total: 6,
        spots_available: 0
    },
    {
        id: 4,
        name: "Каникулярная программа",
        slug: "holidays",
        description:
            "Яркий и насыщенный досуг во время школьных каникул: мастер-классы, квесты, творческие мастерские и выездные мероприятия.",
        photo: "moke/club_4.jpg",
        teacher: { name: "Анастасия Луговая", photo: "moke/teacher_4.jpg" },
        schedule: { days: ["Пн", "Вт", "Ср", "Чт", "Пт"], timeStart: "10:00", timeEnd: "14:00" },
        age: { min: 6, max: 14 },
        price: 250000,
        spots_total: 15,
        spots_available: 9
    }
]

export const MOCK_TEACHERS: Teacher[] = [
    {
        id: 1,
        name: "Яков Леонидович Мордвинов",
        role: "Педагог Кружка Мышления",
        description:
            "Яков Леонидович Мордвинов проводит Кружок Мышления. Выпускник ФМШ и НГУ, кандидат физико-математических наук уже давно пришёл к выводу, что успешность в учёбе и любой деятельности зависит от уровня развития мышления. За 20 лет он собрал лучшие задания, создал много своих, запрограммировал тренажеры разных полезных навыков и сейчас охотно делится не только ими, но и своим хорошим настроением и с детьми, и со взрослыми. Чтобы понять, что такое Кружок Мышления, нужно прийти самому и попробовать. У разных людей получается разное описание.))) Ведь каждый проживает свой опыт",
        photo: "/moke/teacher_3.png"
    },
    {
        id: 2,
        name: "Мария Коваль",
        role: "Педагог настольных игр",
        description:
            "Увлечена игровой педагогикой уже больше восьми лет. Умеет объяснить правила любой сложности так, что дети с первого раза хотят играть снова. Считает, что настольные игры — лучший способ научить ребёнка думать и проигрывать достойно.",
        photo: "/moke/teacher_1.png"
    },
    {
        id: 3,
        name: "Ольга Ненашева",
        role: "Педагог по рисованию",
        description:
            "Художник и преподаватель с профильным образованием. Работает с акварелью, гуашью и пастелью. Убеждена, что у каждого ребёнка есть свой визуальный язык — её задача помочь его найти, а не заменить шаблоном.",
        photo: "/moke/teacher_2.png"
    },
    {
        id: 4,
        name: "Анастасия Луговая",
        role: "Педагог каникулярных программ",
        description:
            "Специалист по досуговой педагогике и организации детских событий. Придумывает квесты, мастер-классы и выездные активности. В её каникулах дети не скучают ни одной минуты — это проверено.",
        photo: "/moke/teacher_4.png"
    }
]

export const MOCK_GALLERY_IMAGES: GalleryImage[] = [
    { src: "moke/club_1.jpg", alt: "" },
    { src: "moke/event-1.jpeg", alt: "Театральные игры" },
    { src: "moke/club_2.jpg", alt: "" },
    { src: "moke/event-4.jpg", alt: "Космическая лекция" }
]

export const MOCK_GALLERY_PHOTOS: GalleryPhoto[] = [
    { id: 1, url: "/moke/club_1.jpg", thumbnail: "/moke/club_1.jpg", alt: "" },
    { id: 2, url: "/moke/event-1.jpeg", thumbnail: "/moke/event-1.jpeg", alt: "Театральные игры" },
    { id: 3, url: "/moke/club_2.jpg", thumbnail: "/moke/club_2.jpg", alt: "Рисование" },
    { id: 4, url: "/moke/event-4.jpg", thumbnail: "/moke/event-4.jpg", alt: "" },
    { id: 5, url: "/moke/club_3.jpg", thumbnail: "/moke/club_3.jpg", alt: "" },
    { id: 6, url: "/moke/club_4.jpg", thumbnail: "/moke/club_4.jpg", alt: "Каникулы" }
]
