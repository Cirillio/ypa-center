<script lang="ts" setup>
import { useWindowScroll } from "@vueuse/core"
import { NAV_ROUTES, EnrollRoutesEnum } from "~/constants/nav"
import { useMobileMenuStore } from "~/store/mobile-menu-store"

const SCROLL_THRESHOLD = 10
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > SCROLL_THRESHOLD)

const mobileMenuStore = useMobileMenuStore()
const { isMenuOpen } = storeToRefs(mobileMenuStore)
</script>

<template>
    <header
        class="fixed top-0 right-0 left-0 z-99 flex justify-center transition-all duration-300"
        :class="isScrolled || isMenuOpen ? 'bg-white/85 backdrop-blur-sm' : 'bg-transparent'"
    >
        <UContainer
            class="relative flex h-(--header-height) w-full items-center justify-between p-2"
        >
            <!-- LOGO -->
            <NuxtLink
                to="/"
                class="group header-left focus-visible:ring-primary flex h-full cursor-pointer items-center gap-2 rounded-md ring-2 ring-transparent outline-0 focus-visible:opacity-90 max-md:py-2 md:gap-4"
                aria-label="На главную Улица Радости"
            >
                <NuxtImg
                    src="/core/Sun.png"
                    alt="Логотип Улица Радости"
                    class="h-full transition-transform delay-75 duration-300 ease-in-out group-hover:rotate-10"
                    format="webp"
                    quality="90"
                    loading="eager"
                    fetchpriority="high"
                />

                <div class="flex flex-col items-start">
                    <span
                        class="text-secondary flex gap-1 text-xl font-extrabold transition-colors duration-300 md:text-3xl"
                    >
                        <span class="flex">
                            <span class="text-primary"> У </span>
                            лица
                        </span>
                        <span class="flex">
                            <span class="text-primary"> Ра </span>
                            <span> дости </span>
                        </span>
                    </span>
                    <span class="text-primary -mt-1.5 text-sm font-bold max-md:text-xs"
                        >Центр умного развития</span
                    >
                </div>
            </NuxtLink>

            <div class="header-right flex items-center gap-4">
                <!-- NAV -->
                <nav class="h-full max-lg:hidden" aria-label="Основная навигация">
                    <ul class="flex list-none items-center gap-2">
                        <li v-for="r in NAV_ROUTES" :key="r.label">
                            <UButton
                                :label="r.label"
                                :to="r.to"
                                variant="ghost"
                                class="min-h-full flex-1 px-5 text-base font-semibold"
                            />
                        </li>
                    </ul>
                </nav>

                <!-- ACTION -->
                <UButton
                    :to="EnrollRoutesEnum.Subscription"
                    label="Собрать абонемент"
                    color="secondary"
                    leading-icon="ph:puzzle-piece-bold"
                    class="h-full px-2 py-2 text-base font-semibold max-lg:hidden xl:px-4"
                    aria-label="Записаться на абонемент"
                    :ui="{ trailingIcon: 'size-5' }"
                />

                <!-- BURGER -->
                <UButton
                    size="xl"
                    :color="isMenuOpen ? 'primary' : 'neutral'"
                    variant="ghost"
                    class="aspect-square transition-transform duration-500 lg:hidden"
                    :class="isMenuOpen ? 'rotate-90' : 'rotate-0'"
                    :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
                    @click="() => mobileMenuStore.toggleMenu()"
                >
                    <Transition name="burger" mode="out-in">
                        <UIcon
                            :key="isMenuOpen ? 'close' : 'open'"
                            class="size-5.5"
                            :name="isMenuOpen ? 'ph:x-bold' : 'ph:list-bold'"
                        />
                    </Transition>
                </UButton>
            </div>
        </UContainer>
    </header>

    <AppMobileMenu />
</template>

<style scoped>
.burger-enter-active,
.burger-leave-active {
    transition:
        opacity 0.125s ease,
        transform 0.125s ease;
}
.burger-enter-from {
    opacity: 0;
    transform: rotate(15deg) scale(0.95);
}
.burger-leave-to {
    opacity: 0;
    transform: rotate(-15deg) scale(0.95);
}
</style>
