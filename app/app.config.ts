import type { ContactTimeOption } from "./types"

const START_YEAR = 2023
const currentYears = new Date().getFullYear() - START_YEAR

const pluralize = (count: number): string => {
    const lastDigit = count % 10
    const lastTwoDigits = count % 100
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "лет"
    if (lastDigit === 1) return "год"
    if (lastDigit >= 2 && lastDigit <= 4) return "года"
    return "лет"
}

export default defineAppConfig({
    ui: {
        colors: {
            primary: "green",
            neutral: "taupe"
        },
        container: {
            base: "max-w-[88rem]"
        },
        button: {
            slots: {
                base: "cursor-pointer"
            },
            compoundVariants: [
                {
                    color: "secondary",
                    variant: "solid",
                    class: "text-white"
                },
                {
                    color: "primary",
                    variant: "solid",
                    class: "text-white"
                }
            ]
        },
        formField: {
            slots: {
                root: "w-full",
                label: "block font-semibold text-base text-default mb-0.5",
                description: "text-muted text-xs",
                error: "mt-1.5 text-error text-sm font-medium",
                hint: "text-muted text-xs",
                help: "mt-1.5 text-muted text-xs",
                container: "mt-1.5"
            }
        },

        input: {
            slots: {
                root: "w-full",
                base: "w-full px-4! rounded-sm placeholder:text-dimmed/60 transition duration-150 text-lg!"
            },
            defaultVariants: {
                variant: "soft",
                size: "lg",
                color: "primary"
            },
            compoundVariants: [
                {
                    color: "error",
                    variant: "soft",
                    class: "ring-2 ring-inset ring-error"
                }
            ],
            variants: {
                variant: {
                    soft: "bg-default/50 text-default hover:bg-default focus-visible:bg-default"
                }
            }
        },

        select: {
            compoundVariants: [
                {
                    color: "error",
                    variant: "soft",
                    class: "ring-2 ring-inset ring-error"
                },
                {
                    variant: "soft",
                    class: "bg-default/50 focus:bg-default/75 disabled:opacity-50 disabled:bg-default focus:ring-primary ring-2 ring-transparent hover:bg-default text-default focus-visible:bg-default"
                }
            ],
            slots: {
                base: "w-full px-4! text-lg! rounded-sm cursor-pointer transition duration-150",
                placeholder: "text-dimmed/60",
                trailingIcon: "text-muted",
                content:
                    "bg-default shadow-none rounded-sm ring-2 ring-transparent hover:ring-primary transition border-0",
                item: "rounded-sm cursor-pointer data-highlighted:not-data-disabled:before:bg-primary/10 data-highlighted:not-data-disabled:text-default! ring-0  px-4! transition duration-150",
                itemLabel: "text-base font-semibold",
                viewport: "p-1"
            },
            variants: {
                size: {
                    md: {
                        base: "px-3 py-2 text-lg!"
                    }
                }
            },
            defaultVariants: {
                size: "lg",
                color: "primary",
                variant: "soft"
            }
        },

        checkbox: {
            compoundVariants: [
                {
                    color: "primary",
                    class: "*:text-white!"
                }
            ],
            slots: {
                base: "rounded-xs ring-0 border-0 bg-default!"
            }
        },

        textarea: {
            compoundVariants: [
                {
                    color: "error",
                    variant: "soft",
                    class: "ring-2 ring-inset ring-error"
                },
                {
                    variant: "soft",
                    class: "bg-default/50 hover:bg-default text-default focus-visible:bg-default"
                }
            ],
            slots: {
                root: "w-full",
                base: "w-full px-4! rounded-sm text-lg! placeholder:text-dimmed/60 transition duration-150 resize-none"
            },
            variants: {
                variant: {
                    outline:
                        "bg-default ring ring-inset ring-accented hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
                }
            },
            defaultVariants: {
                size: "lg",
                color: "primary",
                variant: "outline"
            }
        }
    },
    contactInfo: {
        phone: "+7 (913) 452-60-39",
        phoneTo: "+79134526039",
        email: "info@ulitsa-radosti.ru",
        directorTelegram: "https://t.me/MakukhaNG",
        address: "г. Новосибирск, ул Ильича, 23",
        workingHours: "Пн-Пт: 8:00-20:00",
        mapLink: "https://yandex.ru/maps/-/CPbt6Xni",
        socials: [
            { icon: "simple-icons:vk", href: "https://vk.com/joystreetacadem", label: "ВКонтакте" },
            { icon: "simple-icons:telegram", href: "https://t.me/joystreet", label: "Telegram" }
        ]
    },
    contactTimeOptions: [
        {
            label: "Утром (09:00 – 12:00)",
            time: "09:00-12:00",
            value: "morning"
        },
        {
            label: "Днем (12:00 – 18:00)",
            time: "12:00-18:00",
            value: "afternoon"
        },
        {
            label: "Вечером (18:00 – 21:00)",
            time: "18:00-21:00",
            value: "evening"
        }
    ] as ContactTimeOption[],
    seo: {
        siteUrl: "https://ypa-center.ru",
        siteName: "Улица Радости",
        ogImage: "/og/default.jpg",
        geo: {
            lat: 54.841454,
            lng: 83.095098
        }
    },
    pricing: {
        trialLesson: 1200,
        currency: "RUB"
    },
    promo: {
        aboutVideoUrl:
            "https://vkvideo.ru/video_ext.php?oid=-165630070&id=456240305&hash=e391c488a55c0602&hd=4"
    },
    subscriptions: [
        { lessons: 4, price: 4000 },
        { lessons: 8, price: 7000 },
        { lessons: 12, price: 10000 },
        { lessons: 16, price: 11000 },
        { lessons: 20, price: 12000 },
        { lessons: null, price: 15000, label: "Безлимит", highlight: true }
    ] as Array<{ lessons: number | null; price: number; label?: string; highlight?: boolean }>,
    faq: [
        {
            label: "С какого возраста можно записаться?",
            icon: "ph:baby",
            content:
                "Мы принимаем детей от 2 лет. Для самых маленьких есть специальные развивающие и сенсорные занятия с педагогом, а для ребят постарше — кружки, продлёнка и каникулярные программы."
        },
        {
            label: "Как записаться на пробное занятие?",
            icon: "ph:pencil-simple",
            content:
                "Оставьте заявку через форму на сайте или закажите обратный звонок — мы свяжемся с вами и подберём удобное время. Пробное занятие стоит 1 200 ₽."
        },
        {
            label: "Есть ли абонементы и скидки?",
            icon: "ph:ticket",
            content:
                "Да! Мы предлагаем абонементы на 4 и 8 занятий со скидкой до 20%. Для многодетных семей и при записи на несколько направлений — дополнительные скидки."
        },
        {
            label: "Какие направления у вас есть?",
            icon: "ph:compass",
            content:
                "Настольные игры, рисование, пианино, каникулярные программы, театральные игры и многое другое. Полный список — на странице «Кружки»."
        },
        {
            label: "Где вы находитесь и как добраться?",
            icon: "ph:map-pin",
            content:
                "Наш центр расположен по адресу, который указан на странице «О нас». Мы находимся в шаговой доступности от остановок общественного транспорта. Есть парковка для автомобилей."
        }
    ],
    stats: {
        studentsCount: "300+",
        workingSince: START_YEAR,
        workingYearsText:
            currentYears === 0 ? "Меньше года" : `${currentYears} ${pluralize(currentYears)}`
    }
})
