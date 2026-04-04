<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui"
import { useWindowScroll } from "@vueuse/core"

const SCROLL_THRESHOLD: number = 10
const { y } = useWindowScroll()
const isScrolled = computed<boolean>(() => y.value > SCROLL_THRESHOLD)

const isMenuOpen = ref<boolean>(false)

const NAV_ROUTES: NavigationMenuItem[] = [
    { label: "Кружки", to: "/clubs" },
    { label: "События", to: "/#events" },
    { label: "О нас", to: "/about" },
    { label: "Галерея", to: "/gallery" }
]

const route = useRoute()
const routeWatch = watch(
    () => route.fullPath,
    () => {
        isMenuOpen.value = false
    }
)

const menuOpenWatch = watch(isMenuOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
})

onUnmounted(() => {
    menuOpenWatch()
    routeWatch()
})
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
            >
                <NuxtImg
                    src="/core/Sun.png"
                    alt=""
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
                <nav class="h-full max-lg:hidden">
                    <ul class="flex list-none items-center gap-2">
                        <li v-for="r in NAV_ROUTES" :key="r.label">
                            <UButton
                                :label="r.label"
                                :to="r.to"
                                :variant="'ghost'"
                                class="min-h-full flex-1 px-5 text-base font-semibold"
                            />
                        </li>
                    </ul>
                </nav>

                <!-- ACTION -->

                <UButton
                    to="/enroll"
                    label="Абонемент"
                    color="secondary"
                    trailing-icon="ph:pencil-bold"
                    class="h-full px-2 py-2 text-base font-semibold max-lg:hidden xl:px-4"
                    :ui="{
                        trailingIcon: 'size-5',
                        label: 'max-xl:hidden'
                    }"
                />

                <UButton
                    to="/enroll"
                    label="Пробное занятие"
                    trailing-icon="ph:rocket-launch-duotone"
                    class="h-full px-2 py-2 text-base font-semibold max-lg:hidden xl:px-4"
                    :ui="{
                        trailingIcon: 'size-5',
                        label: 'max-xl:hidden'
                    }"
                />

                <UButton
                    icon="ph:list-bold"
                    size="xl"
                    color="neutral"
                    variant="ghost"
                    class="text-default/80 lg:hidden"
                    @click="isMenuOpen = !isMenuOpen"
                />
            </div>
        </UContainer>
    </header>

    <Transition name="menu">
        <div
            v-if="isMenuOpen"
            class="border-primary/20 fixed top-(--header-height) right-0 left-0 z-98 h-[calc(100dvh-var(--header-height))] overflow-y-auto border-t bg-white/92 backdrop-blur-md lg:hidden"
        >
            <UContainer class="flex h-full flex-col gap-6 py-6">
                <nav class="w-full">
                    <ul class="flex w-full list-none flex-col gap-2">
                        <TransitionGroup name="nav-item">
                            <li
                                v-for="(r, i) in NAV_ROUTES"
                                v-show="isMenuOpen"
                                :key="r.label"
                                :style="{ transitionDelay: `${i * 55}ms` }"
                            >
                                <UButton
                                    :label="r.label"
                                    :to="r.to"
                                    block
                                    variant="soft"
                                    size="xl"
                                    class="px-5 py-3 text-lg font-semibold"
                                />
                            </li>
                        </TransitionGroup>
                    </ul>
                </nav>

                <Transition name="actions">
                    <div v-if="isMenuOpen" class="mt-auto flex flex-col gap-3 pb-4">
                        <UButton
                            to="/enroll"
                            label="Пробное занятие"
                            trailing-icon="ph:rocket-launch-duotone"
                            size="xl"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                        />
                        <UButton
                            to="/enroll"
                            label="Абонемент"
                            color="secondary"
                            trailing-icon="ph:pencil-bold"
                            size="xl"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                        />
                    </div>
                </Transition>
            </UContainer>
        </div>
    </Transition>
</template>

<style scoped>
.menu-enter-active {
    transition:
        opacity 280ms ease-out,
        transform 280ms ease-out;
}
.menu-leave-active {
    transition:
        opacity 220ms ease-in,
        transform 220ms ease-in;
}
.menu-enter-from,
.menu-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

.nav-item-enter-active {
    transition:
        opacity 300ms ease-out,
        transform 300ms ease-out;
}
.nav-item-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.actions-enter-active {
    transition:
        opacity 320ms ease-out,
        transform 320ms ease-out;
    transition-delay: 220ms;
}
.actions-enter-from {
    opacity: 0;
    transform: translateY(8px);
}
</style>
