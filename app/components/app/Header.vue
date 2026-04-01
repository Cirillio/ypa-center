<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui"
import { useWindowScroll } from "@vueuse/core"

const SCROLL_THRESHOLD: number = 10
const { y } = useWindowScroll()
const isScrolled = computed<boolean>(() => y.value > SCROLL_THRESHOLD)

const NAV_ROUTES: NavigationMenuItem[] = [
    { label: "Кружки", to: "/clubs" },
    { label: "События", to: "/#events" },
    { label: "О нас", to: "/about" },
    { label: "Галерея", to: "/gallery" }
]
</script>

<template>
    <header
        class="fixed top-0 right-0 left-0 z-99 flex justify-center transition-all duration-300"
        :class="isScrolled ? 'bg-white/85 backdrop-blur-sm' : 'bg-transparent'"
    >
        <UContainer
            class="relative flex h-(--header-height) w-full items-center justify-between p-2"
        >
            <!-- LOGO -->
            <NuxtLink
                to="/"
                class="group header-left focus-visible:ring-primary flex h-full cursor-pointer items-center gap-4 rounded-md ring-2 ring-transparent outline-0 focus-visible:opacity-90"
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
                    <h6
                        class="text-secondary flex gap-1 text-3xl font-extrabold transition-colors duration-300"
                    >
                        <span class="flex">
                            <span class="text-primary"> У </span>
                            лица
                        </span>
                        <span class="flex">
                            <span class="text-primary"> Ра </span>
                            <span> дости </span>
                        </span>
                    </h6>
                    <h6 class="text-primary -mt-1.5 text-sm font-bold">Центр умного развития</h6>
                </div>
            </NuxtLink>

            <div class="header-right flex items-center gap-4">
                <!-- NAV -->
                <nav class="flex h-full list-none items-center space-x-2 max-lg:hidden">
                    <li v-for="r in NAV_ROUTES" :key="r.label">
                        <UButton
                            :label="r.label"
                            :to="r.to"
                            :variant="'ghost'"
                            class="min-h-full flex-1 px-5 text-base font-semibold"
                        />
                    </li>
                </nav>

                <!-- ACTION -->

                <UButton
                    to="/enroll"
                    label="Записаться"
                    trailing-icon="ph:rocket-launch-duotone"
                    class="h-full px-4 py-2 text-base font-semibold max-md:hidden"
                    :ui="{
                        trailingIcon: 'size-5'
                    }"
                />

                <UTooltip
                    :content="{
                        align: 'end'
                    }"
                    :delay-duration="75"
                    :ui="{
                        content: 'shadow-none ring-0 bg-secondary max-md:hidden text-white p-4'
                    }"
                >
                    <UButton
                        to="/subscription"
                        color="secondary"
                        icon="ph:pencil-duotone"
                        class="h-full p-2 text-base font-semibold max-md:hidden"
                        :ui="{
                            trailingIcon: 'size-5'
                        }"
                    />
                    <template #content>
                        <span class="text-base font-bold">Оформить абонемент</span>
                    </template>
                </UTooltip>

                <UPopover
                    :ui="{
                        content: 'shadow-none bg-white ring-2 ring-primary'
                    }"
                    :content="{
                        align: 'end'
                    }"
                >
                    <UButton
                        label="Меню"
                        trailing-icon="ph:list-bold"
                        size="xl"
                        color="neutral"
                        variant="soft"
                        class="lg:hidden"
                        :ui="{
                            label: 'max-sm:hidden'
                        }"
                    />

                    <template #content>
                        <div class="flex p-2">
                            <!-- NAV -->
                            <nav class="flex h-full w-full list-none flex-col space-x-2">
                                <li v-for="r in NAV_ROUTES" :key="r.label">
                                    <UButton
                                        :label="r.label"
                                        :to="r.to"
                                        block
                                        size="xl"
                                        :variant="'ghost'"
                                        class="justify-start px-4 text-lg font-semibold"
                                    />
                                </li>
                            </nav>
                        </div>
                    </template>
                </UPopover>
            </div>
        </UContainer>
    </header>
</template>
