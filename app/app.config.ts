export default defineAppConfig({
    ui: {
        colors: {
            primary: "green",
            neutral: "slate"
        },
        input: {
            slots: {
                root: ""
            }
        },
        popover: {
            slots: {
                content: "ring-0 shadow-sm"
            }
        },
        button: {
            slots: {
                base: "cursor-pointer"
            },
            compoundVariants: [
                {
                    color: "primary",
                    variant: "solid",
                    class: "text-white"
                },
                {
                    color: "secondary",
                    variant: "solid",
                    class: "text-white"
                }
            ]
        },
        container: {
            base: "max-w-[88rem]"
        }
    },
    contactInfo: {
        phone: "+7 (913) 452-60-39",
        phoneTo: "+79134526039",
        email: "info@ulitsa-radosti.ru",
        address: "г. Новосибирск, ул Ильича, 23",
        socials: [
            { icon: "simple-icons:vk", href: "#", label: "ВКонтакте" },
            { icon: "simple-icons:telegram", href: "https://t.me/MakukhaNG", label: "Telegram" }
        ],
        mapLink: "https://yandex.ru/maps/-/CPRON8mX",
        workingHours: "Пн-Пт: 8:00-20:00"
    }
})
