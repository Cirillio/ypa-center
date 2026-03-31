<script lang="ts" setup>
const currentYear = new Date().getFullYear()

const appConfig = useAppConfig()

const contacts = appConfig.contactInfo

interface FooterLink {
    label: string
    to: string
}

interface FooterGroup {
    title: string
    links: FooterLink[]
}

const FOOTER_GROUPS: FooterGroup[] = [
    {
        title: "Навигация",
        links: [
            { label: "Кружки", to: "/clubs" },
            { label: "О нас", to: "/about" },
            { label: "Галерея", to: "/gallery" },
            { label: "Учителя", to: "/teachers" }
        ]
    },
    {
        title: "Информация",
        links: [
            { label: "События", to: "/#events" },
            { label: "Фото", to: "/#gallery" },
            { label: "Частые вопросы", to: "/#faq" }
        ]
    },
    {
        title: "Контакты",
        links: [
            { label: contacts.phone, to: "tel:" + contacts.phoneTo },
            { label: contacts.email, to: "mailto:" + contacts.email }
        ]
    }
]
</script>

<template>
    <footer class="bg-default z-10">
        <UContainer class="py-12">
            <!-- Top row: link groups + brand -->
            <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
                <!-- Link groups -->
                <div v-for="group in FOOTER_GROUPS" :key="group.title" class="flex flex-col gap-3">
                    <h4 class="text-default/90 text-sm font-bold tracking-widest uppercase">
                        {{ group.title }}
                    </h4>
                    <nav class="flex flex-col gap-1.5">
                        <NuxtLink
                            v-for="link in group.links"
                            :key="link.label"
                            :to="link.to"
                            class="text-default/70 hover:text-primary w-fit text-base font-medium transition-colors"
                        >
                            {{ link.label }}
                        </NuxtLink>
                    </nav>
                </div>

                <!-- Brand + socials (right column) -->
                <div class="col-span-2 flex flex-col items-start gap-4 sm:col-span-1 sm:items-end">
                    <NuxtLink to="/" class="group flex items-center gap-2.5">
                        <NuxtImg
                            src="/core/Sun.png"
                            class="h-12 transition-transform duration-300 group-hover:rotate-10"
                        />
                        <span class="text-secondary text-3xl leading-tight font-extrabold">
                            <span class="text-primary">У</span>лица
                            <span class="text-primary">Ра</span>дости
                        </span>
                    </NuxtLink>

                    <p class="text-default/75 text-base font-medium sm:text-right">
                        Место, где дети учатся думать,<br />
                        творить и верить в себя.
                    </p>

                    <!-- Social icons -->
                    <div class="flex gap-2">
                        <UButton
                            v-for="social in contacts.socials"
                            :key="social.label"
                            :to="social.href"
                            :aria-label="social.label"
                            :variant="'ghost'"
                            :icon="social.icon"
                            target="_blank"
                            class="p-2"
                        />
                    </div>
                </div>
            </div>

            <!-- Divider + bottom row -->
            <div
                class="border-default mt-10 flex flex-col items-center justify-between gap-3 border-t pt-5 sm:flex-row"
            >
                <a
                    :href="contacts.mapLink"
                    target="_blank"
                    class="text-default/35 hover:text-primary text-xs font-medium transition"
                >
                    {{ contacts.address }}
                </a>
                <span class="text-default/35 text-xs font-medium">
                    &copy; {{ currentYear }} Улица Радости. Все права защищены.
                </span>
            </div>
        </UContainer>
    </footer>
</template>
