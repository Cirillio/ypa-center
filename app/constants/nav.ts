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
