import type { StatusData } from "~/types/status"
import type {
    Activity,
    Club,
    ClubShort,
    ClubWithSlots,
    EventShort,
    GalleryImage,
    GalleryPhoto,
    ScheduleSlot,
    Subgroup,
    Teacher,
    WeekdaySlot,
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
        description:
            "Интерактивные занятия с элементами актёрского мастерства для детей 6–10 лет. Интерактивные занятия с элементами актёрского мастерства для детей 6–10 лет. Интерактивные занятия с элементами актёрского мастерства для детей 6–10 лет.",
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

export const MOCK_SUBGROUPS: Subgroup[] = [
    { id: 1, name: "КМ — младшие (6–9 лет)", slug: "km-junior", capacity: 6 },
    { id: 2, name: "КМ — старшие (10–16 лет)", slug: "km-senior", capacity: 6 },
    { id: 3, name: "АЯ — первоклашки (1 кл.)", slug: "en-grade1", capacity: 6 },
    { id: 4, name: "АЯ — начальная школа (2–6 кл.)", slug: "en-primary", capacity: 6 },
    { id: 5, name: "АЯ — подростки (7–9 кл.)", slug: "en-teens", capacity: 6 },
    { id: 6, name: "АЯ — экзамены (ОГЭ/ЕГЭ)", slug: "en-exams", capacity: 6 },
    { id: 7, name: "Творчество (4–8 лет)", slug: "art-kids", capacity: 6 },
    { id: 8, name: "Рукоделие (8–12 лет)", slug: "craft-kids", capacity: 6 },
    { id: 9, name: "ГДЕЁЖ (5–7 лет)", slug: "preschool-main", capacity: 6 },
    { id: 10, name: "Настолки (6+)", slug: "boardgames-all", capacity: 8 }
]

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 1, club_id: 1, subgroup_id: 1 },
    { id: 2, club_id: 1, subgroup_id: 2 },
    { id: 3, club_id: 2, subgroup_id: 3 },
    { id: 4, club_id: 2, subgroup_id: 4 },
    { id: 5, club_id: 2, subgroup_id: 5 },
    { id: 6, club_id: 2, subgroup_id: 6 },
    { id: 7, club_id: 3, subgroup_id: 7 },
    { id: 8, club_id: 3, subgroup_id: 8 },
    { id: 9, club_id: 4, subgroup_id: 9 },
    { id: 10, club_id: 5, subgroup_id: 10 }
]

export const MOCK_WEEKDAY_SLOTS: WeekdaySlot[] = [
    { id: 1, dayOfWeek: 1, startTime: "15:00", endTime: "16:00" },
    { id: 2, dayOfWeek: 1, startTime: "16:00", endTime: "17:00" },
    { id: 3, dayOfWeek: 1, startTime: "17:00", endTime: "18:00" },
    { id: 4, dayOfWeek: 2, startTime: "15:00", endTime: "16:00" },
    { id: 5, dayOfWeek: 2, startTime: "16:00", endTime: "17:00" },
    { id: 6, dayOfWeek: 2, startTime: "17:00", endTime: "18:00" },
    { id: 7, dayOfWeek: 3, startTime: "15:00", endTime: "16:00" },
    { id: 8, dayOfWeek: 3, startTime: "16:00", endTime: "17:00" },
    { id: 9, dayOfWeek: 3, startTime: "17:00", endTime: "18:00" },
    { id: 10, dayOfWeek: 4, startTime: "15:00", endTime: "16:00" },
    { id: 11, dayOfWeek: 4, startTime: "16:00", endTime: "17:00" },
    { id: 12, dayOfWeek: 4, startTime: "17:00", endTime: "18:00" },
    { id: 13, dayOfWeek: 5, startTime: "15:00", endTime: "16:00" },
    { id: 14, dayOfWeek: 5, startTime: "16:00", endTime: "17:00" },
    { id: 15, dayOfWeek: 5, startTime: "17:00", endTime: "18:00" },
    { id: 16, dayOfWeek: 6, startTime: "10:00", endTime: "11:00" },
    { id: 17, dayOfWeek: 6, startTime: "11:00", endTime: "13:30" }
]

export const MOCK_SCHEDULE_SLOTS: ScheduleSlot[] = [
    // Кружок Мышления — КМ-мл (activity 1)
    { activity_id: 1, weekday_slot_id: 1, participants: 5 },
    { activity_id: 1, weekday_slot_id: 4, participants: 5 },
    { activity_id: 1, weekday_slot_id: 7, participants: 5 },
    { activity_id: 1, weekday_slot_id: 10, participants: 4 },
    { activity_id: 1, weekday_slot_id: 13, participants: 6 },
    // Кружок Мышления — КМ-ст (activity 2)
    { activity_id: 2, weekday_slot_id: 2, participants: 2 },
    { activity_id: 2, weekday_slot_id: 3, participants: 2 },
    { activity_id: 2, weekday_slot_id: 5, participants: 4 },
    { activity_id: 2, weekday_slot_id: 6, participants: 0 },
    { activity_id: 2, weekday_slot_id: 8, participants: 1 },
    { activity_id: 2, weekday_slot_id: 11, participants: 2 },
    { activity_id: 2, weekday_slot_id: 12, participants: 0 },
    { activity_id: 2, weekday_slot_id: 14, participants: 3 },
    { activity_id: 2, weekday_slot_id: 15, participants: 4 },
    // Английский — первоклашки (activity 3)
    { activity_id: 3, weekday_slot_id: 16, participants: 3 },
    // Английский — начальная школа (activity 4)
    { activity_id: 4, weekday_slot_id: 4, participants: 3 },
    { activity_id: 4, weekday_slot_id: 5, participants: 2 },
    { activity_id: 4, weekday_slot_id: 8, participants: 5 },
    { activity_id: 4, weekday_slot_id: 14, participants: 5 },
    // Английский — подростки (activity 5)
    { activity_id: 5, weekday_slot_id: 6, participants: 6 },
    { activity_id: 5, weekday_slot_id: 12, participants: 6 },
    { activity_id: 5, weekday_slot_id: 15, participants: 3 },
    // Английский — экзамены (activity 6)
    { activity_id: 6, weekday_slot_id: 11, participants: 5 },
    // Творчество (activity 7)
    { activity_id: 7, weekday_slot_id: 4, participants: 3 },
    // Рукоделие (activity 8)
    { activity_id: 8, weekday_slot_id: 7, participants: 6 },
    // Подготовка к школе (activity 9)
    { activity_id: 9, weekday_slot_id: 17, participants: 3 },
    // Настольные игры (activity 10)
    { activity_id: 10, weekday_slot_id: 9, participants: 0 }
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
            "Улучшение успеваемости по точным наукам без дополнительного репетиторства",
            "Навык находить нестандартный выход там, где другие заходят в тупик",
            "Повышение скорости и точности обработки информации",
            "Устойчивая концентрация внимания на протяжении всего урока",
            "Умение методично разбирать сложные задачи на простые шаги"
        ],
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
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
            "Преодоление языкового барьера и первая уверенная речь уже за 2 месяца",
            "Понимание речи носителей на слух без субтитров",
            "Словарный запас под реальные жизненные ситуации, а не учебник",
            "Готовность к школьным олимпиадам и международным экзаменам",
            "Способность читать и смотреть контент на английском для удовольствия"
        ],
        teacher: { name: "Надежда Геннадьевна Макуха", photo: "/moke/teacher_1.png" },
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
            "Создание законченных художественных проектов, которыми можно гордиться",
            "Уверенность в своих творческих силах без страха «сделать неправильно»",
            "Владение акварелью, гуашью, лепкой и работой с тканями и природными материалами",
            "Развитая мелкая моторика и усидчивость, которая помогает в учёбе",
            "Сформированный художественный вкус и чувство цвета и композиции"
        ],
        teacher: { name: "Надежда Геннадьевна Макуха", photo: "/moke/teacher_1.png" },
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
            "Полная готовность к школьной программе: чтение, письмо, счёт",
            "Усидчивость и умение работать в коллективе с первого дня в классе",
            "Развитый фонематический слух — основа грамотного письма",
            "Уверенное владение базовыми математическими операциями в игровой форме",
            "Психологическая готовность: ребёнок идёт в школу с интересом, а не со страхом"
        ],
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
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
            "Умение просчитывать ходы наперёд и строить многоходовые стратегии",
            "Навык конструктивного общения, переговоров и принятия совместных решений",
            "Спортивное поведение: достойно выигрывать и не опускать руки при поражении",
            "Развитое критическое мышление через анализ игровых ситуаций",
            "Социализация и новые друзья в среде с общими интересами"
        ],
        teacher: { name: "Яков Леонидович Мордвинов", photo: "/moke/teacher_3.png" },
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
