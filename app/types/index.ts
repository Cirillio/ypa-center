// Глобальные типы приложения

export interface ClubShort {
    title: string
    shortDesc: string
    img: string
    to: string
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

export interface Club {
    id: number
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
