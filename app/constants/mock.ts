import type {
    Club,
    ClubShort,
    ClubWithSlots,
    EventShort,
    GalleryImage,
    GalleryPhoto,
    Teacher,
    WeeklySlot
} from "~/types"

export const MOCK_CLUBS: ClubShort[] = [
    {
        id: "board-games",
        title: "Настольные игры",
        shortDesc: "Развиваем логику и стратегическое мышление через увлекательные настольные игры",
        img: "moke/club_1.jpg"
    },
    {
        id: "holidays",
        title: "Каникулы",
        shortDesc: "Организуем яркий и полезный досуг во время школьных каникул.",
        img: "moke/club_4.jpg"
    },
    {
        id: "drawing",
        title: "Рисование",
        shortDesc: "Раскрываем творческий потенциал через живопись и художественное творчество",
        img: "moke/club_2.jpg"
    },
    {
        id: "piano",
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
        price: "1500р",
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
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
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
        teacher: { name: "Надежда Геннадьевна Макуха", photo: "/moke/teacher_1.png" },
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
        teacher: { name: "Надежда Геннадьевна Макуха", photo: "/moke/teacher_1.png" },
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
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
        schedule: { days: ["Пн", "Вт", "Ср", "Чт", "Пт"], timeStart: "10:00", timeEnd: "14:00" },
        age: { min: 6, max: 14 },
        price: 250000,
        spots_total: 15,
        spots_available: 9
    }
]

export const MOCK_WEEKLY_SLOTS: WeeklySlot[] = [
    // ПОНЕДЕЛЬНИК (dayOfWeek: 1)
    {
        id: 1,
        activity: { id: 1, name: "Кружок Мышления" },
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

export const MOCK_TEACHERS: Teacher[] = [
    {
        id: 1,
        name: "Надежда Геннадьевна Макуха",
        role: "Учитель Английского Языка",
        description:
            "Надежда Геннадьевна Макуха, основатель УРа и старший преподаватель СУНЦ НГУ сама проводит занятия английским языком в Центре. Например, по пятницам проходят игры на английском языке для подростков. Легко запомнить: в пятницу в пять. На занятии комфортно человеку с любым уровнем языковой подготовки. Кто-то узнаёт что-то новое в языке, а кто-то открывает для себя новую игру. И то, и другое - увлекательно.  А уж в компании опытного методиста и педагога еще и полезно.",
        photo: "/moke/teacher_1.png",
        quote: "Язык открывает двери, которые иначе остаются закрытыми навсегда."
    },
    {
        id: 2,
        name: "Яков Леонидович Мордвинов",
        role: "Педагог Кружка Мышления",
        description:
            "Яков Леонидович Мордвинов проводит Кружок Мышления. Выпускник ФМШ и НГУ, кандидат физико-математических наук уже давно пришёл к выводу, что успешность в учёбе и любой деятельности зависит от уровня развития мышления. За 20 лет он собрал лучшие задания, создал много своих, запрограммировал тренажеры разных полезных навыков и сейчас охотно делится не только ими, но и своим хорошим настроением и с детьми, и со взрослыми. Чтобы понять, что такое Кружок Мышления, нужно прийти самому и попробовать. У разных людей получается разное описание.))) Ведь каждый проживает свой опыт",
        photo: "/moke/teacher_3.png",
        quote: "Думать — это навык. Как и любой навык, его можно тренировать."
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
