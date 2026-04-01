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
