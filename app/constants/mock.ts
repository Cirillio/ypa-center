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
        id: "thinking-club",
        title: "Кружок Мышления",
        shortDesc: "Развиваем логику, память и нестандартное мышление через авторские методики",
        img: "moke/club_1.jpg",
        spotsAvailable: 3
    },
    {
        id: "english",
        title: "Английский язык",
        shortDesc: "Изучаем язык через игры и живое общение для детей всех возрастов",
        img: "moke/club_2.jpg",
        spotsAvailable: 2
    },
    {
        id: "creativity",
        title: "Творчество и Рукоделие",
        shortDesc: "Раскрываем таланты через рисование, лепку и создание уникальных поделок",
        img: "moke/club_3.jpg",
        spotsAvailable: 5
    },
    {
        id: "pre-school",
        title: "Подготовка к школе",
        shortDesc: "Комплексная подготовка: чтение, письмо и математика в игровой форме",
        img: "moke/event-1.jpeg",
        spotsAvailable: 1
    },
    {
        id: "board-games",
        title: "Настольные игры",
        shortDesc: "Развиваем стратегическое мышление и навыки общения в игровом клубе",
        img: "moke/event-3.jpg",
        spotsAvailable: 4
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
        price: "1500р"
    },
    {
        id: "event-2",
        label: "Игры для самых маленьких",
        description: "Развивающие и сенсорные игры для детей 2–4 лет с педагогом.",
        img: "moke/event-2.jpg",
        date: "2026-04-15",
        time: "10:00",
        price: "300р"
    },
    {
        id: "event-3",
        label: "Игровой клуб",
        description: "Свободная игровая зона и настольные игры для семейных посещений.",
        img: "moke/event-3.jpg",
        date: "2026-04-18",
        time: "17:00",
        price: null
    },
    {
        id: "event-4",
        label: "Космическая лекция",
        description: "Путешествие по Солнечной системе с демонстрациями и мастер-классом.",
        img: "moke/event-4.jpg",
        date: "2026-04-20",
        time: "18:30",
        price: "700р"
    }
]

export const MOCK_CLUBS_FULL: Club[] = [
    {
        id: 1,
        name: "Кружок Мышления",
        slug: "thinking-club",
        description:
            "Мы рассматриваем мышление не как врождённый дар, а как тренируемый навык. На занятиях ребята развивают логику, память и нестандартный подход к задачам через авторские методики Якова Леонидовича Мордвинова. За 20 лет практики он собрал уникальную коллекцию головоломок и создал интерактивные тренажёры, которые учат детей анализировать информацию, строить стратегии и не бояться сложных интеллектуальных вызовов. Это база, которая поможет ребёнку уверенно чувствовать себя в любой школьной дисциплине.",
        photo: "moke/club_1.jpg",
        skills: ["Логическое мышление", "Память", "Концентрация", "Решение задач"],
        outcomes: [
            "Улучшение успеваемости в школе по точным наукам",
            "Навык находить выход из нестандартных ситуаций",
            "Повышение скорости обработки информации"
        ],
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
        schedule: { days: ["Пн", "Вт", "Ср", "Чт", "Пт"], timeStart: "15:00", timeEnd: "18:00" },
        age: { min: 6, max: 16 },
        price: 120000,
        spots_total: 6,
        spots_available: 3
    },
    {
        id: 2,
        name: "Английский язык",
        slug: "english",
        description:
            "Забудьте о скучной зубрёжке правил. Наш подход — это погружение в язык через живое общение, игры и обсуждение тем, которые действительно интересны детям. Мы учим не просто переводить слова, а думать на английском, понимать юмор и культурный контекст. Группы формируются бережно, учитывая возраст и текущий уровень подготовки. Программа охватывает путь от первых шагов первоклассников до глубокой подготовки к государственным экзаменам (ОГЭ и ЕГЭ), сохраняя при этом искренний интерес к изучению иностранного языка.",
        photo: "moke/club_2.jpg",
        skills: ["Разговорная речь", "Грамматика", "Восприятие на слух"],
        outcomes: [
            "Преодоление языкового барьера за 2 месяца",
            "Понимание речи носителей на слух",
            "Словарный запас под реальные жизненные ситуации"
        ],
        teacher: { name: "Надежда Геннадьевна Макуха", photo: "/moke/teacher_1.png" },
        schedule: { days: ["Вт", "Ср", "Чт", "Пт", "Сб"], timeStart: "16:00", timeEnd: "18:00" },
        age: { min: 6, max: 18 },
        price: 150000,
        spots_total: 6,
        spots_available: 2
    },
    {
        id: 3,
        name: "Творчество и Рукоделие",
        slug: "creativity",
        description:
            "В нашей мастерской каждый ребёнок становится маленьким творцом. Мы не просто учим рисовать или лепить, мы развиваем художественный вкус и чувство прекрасного. Используя акварель, гуашь, пластилином, ткани и природные материалы, дети создают уникальные поделки и картины. Занятия помогают развить мелкую моторику, усидчивость и, главное, дарят радость от созидания. Это пространство, где нет 'неправильных' линий, а любая фантазия находит своё воплощение в материальном мире.",
        photo: "moke/club_3.jpg",
        skills: ["Мелкая моторика", "Цветовосприятие", "Креативность"],
        outcomes: [
            "Создание собственных художественных проектов",
            "Уверенность в своих творческих силах",
            "Навык работы с различными материалами и техниками"
        ],
        teacher: { name: "Надежда Геннадьевна Макуха", photo: "/moke/teacher_1.png" },
        schedule: { days: ["Вт", "Ср"], timeStart: "15:00", timeEnd: "16:00" },
        age: { min: 4, max: 12 },
        price: 130000,
        spots_total: 6,
        spots_available: 3
    },
    {
        id: 4,
        name: "Подготовка к школе",
        slug: "pre-school",
        description:
            "Программа 'ГДЕЁЖ' — это мягкий и эффективный мостик из детского сада в школьную жизнь. Мы уделяем внимание не только академическим навыкам — чтению, письму и счёту, но и психологической готовности ребёнка. В игровой форме мы тренируем фонематический слух, логическое мышление и умение работать в коллективе. Наша цель — сделать так, чтобы 1 сентября ребёнок шёл в школу не со страхом перед неизвестностью, а с горящими глазами и уверенностью в своих силах.",
        photo: "moke/event-1.jpeg",
        skills: ["Чтение", "Письмо", "Базовая математика", "Социализация"],
        outcomes: [
            "Полная готовность к школьной программе",
            "Навык усидчивости и работы в коллективе",
            "Развитие фонематического слуха и грамотности"
        ],
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
        schedule: { days: ["Сб"], timeStart: "11:00", timeEnd: "13:30" },
        age: { min: 5, max: 7 },
        price: 180000,
        spots_total: 6,
        spots_available: 3
    },
    {
        id: 5,
        name: "Настольные игры",
        slug: "board-games",
        description:
            "Настольные игры — это лучший способ научиться общаться, договариваться и стратегически мыслить в безопасной игровой среде. Наш клуб предлагает огромную коллекцию современных игр на любой вкус: от весёлых пати-геймов до сложных экономических стратегий. Здесь дети учатся не только планировать свои ходы наперёд, но и достойно проигрывать, радоваться успехам друзей и работать в команде. Это идеальное место для социализации и качественного досуга без гаджетов.",
        photo: "moke/event-3.jpg",
        skills: ["Стратегия", "Командная работа", "Эмоциональный интеллект"],
        outcomes: [
            "Умение просчитывать ходы наперед",
            "Навык конструктивного общения и переговоров",
            "Спортивное поведение: умение выигрывать и проигрывать"
        ],
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
        schedule: { days: ["Ср"], timeStart: "17:00", timeEnd: "18:00" },
        age: { min: 6, max: 99 },
        price: 100000,
        spots_total: 6,
        spots_available: 6
    }
]

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
    { src: "moke/club_1.jpg", alt: "Занятие в кружке Мышления" },
    { src: "moke/event-1.jpeg", alt: "Театральные игры" },
    { src: "moke/club_2.jpg", alt: "Урок английского языка" },
    { src: "moke/event-4.jpg", alt: "Космическая лекция" }
]

export const MOCK_GALLERY_PHOTOS: GalleryPhoto[] = [
    {
        id: 1,
        url: "/moke/club_1.jpg",
        thumbnail: "/moke/club_1.jpg",
        alt: "Занятие в кружке Мышления"
    },
    { id: 2, url: "/moke/event-1.jpeg", thumbnail: "/moke/event-1.jpeg", alt: "Театральные игры" },
    {
        id: 3,
        url: "/moke/club_2.jpg",
        thumbnail: "/moke/club_2.jpg",
        alt: "Урок английского языка"
    },
    { id: 4, url: "/moke/event-4.jpg", thumbnail: "/moke/event-4.jpg", alt: "Космическая лекция" },
    {
        id: 5,
        url: "/moke/club_3.jpg",
        thumbnail: "/moke/club_3.jpg",
        alt: "Занятия по творчеству и рукоделию"
    },
    { id: 6, url: "/moke/club_4.jpg", thumbnail: "/moke/club_4.jpg", alt: "Каникулярная программа" }
]
