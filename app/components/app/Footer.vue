<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

const currentYear = new Date().getFullYear()

const appConfig = useAppConfig()

const contacts = appConfig.contactInfo

interface FooterLink {
    label: string
    to: string
}

const NAVIGATION_LINKS: FooterLink[] = [
    { label: "О нас", to: "/about" },
    { label: "Кружки", to: "/clubs" },
    { label: "События", to: "/#events" },
    { label: "Учителя", to: "/teachers" },
    { label: "Галерея", to: "/gallery" }
]

const CONTACT_LINKS: FooterLink[] = [
    { label: contacts.phone, to: "tel:" + contacts.phoneTo },
    { label: contacts.email, to: "mailto:" + contacts.email }
]
</script>

<template>
    <footer class="bg-default z-10 flex flex-col items-center gap-12 py-12">
        <UContainer class="flex flex-col items-center gap-4 md:gap-8">
            <NuxtImg
                src="/core/Sun.png"
                alt=""
                class="floating-element-slow h-20 transition-transform duration-300 group-hover:rotate-10 md:h-24 lg:h-28"
                format="webp"
                quality="90"
                loading="lazy"
            />

            <h3 class="text-primary text-center text-2xl leading-tight font-bold md:text-3xl">
                Готовы к нам
                <span class="text-secondary after:text-primary after:content-['?']"
                    >присоединиться</span
                >
            </h3>
            <div class="flex items-center gap-2 max-md:flex-col-reverse">
                <UButton :to="EnrollRoutesEnum.Trial" variant="soft" size="md" class="group w-fit">
                    <span class="font-bold">Записаться на пробное</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-4 transition group-hover:translate-x-0.5"
                    />
                </UButton>

                <UButton :to="EnrollRoutesEnum.Subscription" color="secondary" class="group w-fit">
                    <span class="font-bold md:text-lg">Собрать абонемент</span>
                    <UIcon
                        name="ph:puzzle-piece-duotone"
                        class="size-4.5 transition group-hover:scale-110 group-hover:rotate-6 md:size-5.5"
                    />
                </UButton>
            </div>
        </UContainer>
        <USeparator>
            <template #default>
                <div class="flex gap-2">
                    <UIcon name="ph:butterfly-duotone" class="size-8 text-amber-400" />
                    <UIcon name="ph:building-apartment-duotone" class="text-primary size-8" />
                    <UIcon name="ph:tree-duotone" class="size-8 text-green-600" />
                </div>
            </template>
        </USeparator>
        <UContainer class="">
            <!-- Top row: link groups + brand -->
            <div class="flex justify-between gap-8 max-md:flex-col">
                <div class="flex flex-col gap-8">
                    <!-- Навигация -->
                    <div class="flex flex-col gap-3">
                        <h2 class="text-default/95 text-base font-bold tracking-widest uppercase">
                            Навигация
                        </h2>
                        <nav
                            class="flex flex-col gap-x-6 gap-y-1.5 md:flex-row md:items-center"
                            aria-label="Навигация в подвале"
                        >
                            <NuxtLink
                                v-for="link in NAVIGATION_LINKS"
                                :key="link.label"
                                :to="link.to"
                                class="text-default/90 hover:text-primary active:text-primary w-fit text-base font-medium transition-colors"
                            >
                                {{ link.label }}
                            </NuxtLink>
                        </nav>
                    </div>

                    <!-- Контакты -->
                    <div class="flex flex-col gap-3">
                        <h2 class="text-default/95 text-base font-bold tracking-widest uppercase">
                            Контакты
                        </h2>
                        <nav class="flex flex-col gap-1.5" aria-label="Контактная информация">
                            <NuxtLink
                                v-for="link in CONTACT_LINKS"
                                :key="link.label"
                                :to="link.to"
                                class="text-default/90 hover:text-primary active:text-primary w-fit text-base font-medium transition-colors"
                            >
                                {{ link.label }}
                            </NuxtLink>
                        </nav>
                    </div>
                </div>

                <!-- Brand + socials (right column) -->
                <div class="flex shrink-0 flex-col items-start gap-4 lg:items-end">
                    <NuxtLink to="/" class="group flex items-center gap-2.5">
                        <span
                            class="text-secondary shrink-0 text-2xl leading-tight font-extrabold md:text-3xl"
                        >
                            <span class="text-primary">У</span>лица
                            <span class="text-primary">Ра</span>дости
                        </span>
                    </NuxtLink>

                    <p
                        class="text-default/80 max-w-xs text-base font-semibold text-balance lg:text-right"
                    >
                        Место, где дети учатся думать, творить и верить в себя.
                    </p>

                    <!-- Social icons -->
                    <div class="flex gap-2 max-md:flex-col">
                        <UButton
                            v-for="social in contacts.socials"
                            :key="social.label"
                            :to="social.href"
                            :aria-label="social.label"
                            :label="social.label"
                            :variant="'ghost'"
                            color="info"
                            :icon="social.icon"
                            target="_blank"
                            class="p-2"
                        />
                    </div>
                </div>
            </div>
            <!-- Divider + bottom row -->
            <div
                class="border-default/50 mt-10 flex flex-col items-center justify-between gap-3 border-t pt-5 sm:flex-row"
            >
                <a
                    :href="contacts.mapLink"
                    target="_blank"
                    class="text-default/60 active:text-primary hover:text-primary text-xs font-medium transition"
                >
                    {{ contacts.address }}
                </a>
                <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    <NuxtLink
                        to="/privacy"
                        class="text-default/60 active:text-primary hover:text-primary text-xs font-medium transition"
                    >
                        Политика конфиденциальности
                    </NuxtLink>
                    <NuxtLink
                        to="/consent"
                        class="text-default/60 active:text-primary hover:text-primary text-xs font-medium transition"
                    >
                        Согласие на обработку ПД
                    </NuxtLink>
                    <span class="text-default/60 text-xs font-medium">
                        &copy; {{ currentYear }} Улица Радости. Все права защищены.
                    </span>
                </div>
            </div>
        </UContainer>
    </footer>
</template>
