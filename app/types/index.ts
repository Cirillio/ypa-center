// Глобальные типы приложения

export interface Teacher {
    id: number
    name: string
    role: string
    description: string
    photo: string
    quote: string
}

export interface ClubShort {
    title: string
    shortDesc: string
    img: string
}

export interface EventShort {
    id: string
    label: string
    description: string
    img: string
    date: string
    time: string
    price: string | null
    isPinned: boolean
}

export interface GalleryImage {
    src: string
    alt: string
}

export interface GalleryPhoto {
    id: number
    url: string
    alt: string
    thumbnail: string
}

export interface Club {
    id: number
    slug: string
    name: string
    description: string
    photo: string
    teacher: {
        name: string
        photo: string
    }
    schedule: {
        days: string[]
        timeStart: string
        timeEnd: string
    }
    age: {
        min: number
        max: number
    }
    price: number
    spots_total: number
    spots_available: number
}

export interface WeeklySlot {
    id: number
    activity: {
        id: number
        name: string
    }
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
    startTime: string
    endTime: string
    groupName: string
    maxCapacity: number
    available: number
}
