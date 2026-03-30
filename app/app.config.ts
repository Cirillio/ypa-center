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
    }
})
