export interface NavRoute {
    label: string
    to: string
    icon: string
}

export const NAV_ROUTES: NavRoute[] = [
    { label: "О нас", to: "/about", icon: "ph:info-duotone" },
    { label: "Кружки", to: "/clubs", icon: "ph:castle-turret-duotone" },
    { label: "События", to: "/#events", icon: "ph:calendar-star-duotone" },
    { label: "Галерея", to: "/gallery", icon: "ph:aperture-duotone" }
]

export enum EnrollRoutesEnum {
    Trial = "/enroll/trial",
    Event = "/enroll/event",
    Subscription = "/enroll/subscription"
}

export enum CabinetRoutesEnum {
    Login = "/login",
    Me = "/me"
}

export interface HeaderAction {
    label: string
    to: string
    icon: string
}

// Главные действия шапки: единый источник для десктопной шапки и мобильного меню, чтобы они не расходились.
export const HEADER_ACTIONS = {
    subscription: {
        label: "Абонемент",
        to: EnrollRoutesEnum.Subscription,
        icon: "ph:puzzle-piece-bold"
    },
    cabinet: { label: "Мой кабинет", to: CabinetRoutesEnum.Me, icon: "ph:user-bold" }
} as const satisfies Record<string, HeaderAction>
