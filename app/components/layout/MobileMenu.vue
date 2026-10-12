<script lang="ts" setup>
import { onKeyStroke, useMediaQuery } from "@vueuse/core"
import { EnrollRoutesEnum, HEADER_ACTIONS, NAV_ROUTES } from "~/constants/nav"
import { useMobileMenuStore } from "~/stores/mobile-menu-store"

const mobileMenuStore = useMobileMenuStore()
const { isMenuOpen } = storeToRefs(mobileMenuStore)
const route = useRoute()

// Блокируем скролл страницы пока меню открыто
const overflowWatch = watch(isMenuOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : ""
})

onUnmounted(() => {
    document.body.style.overflow = ""
    overflowWatch()
})

// Меню не должно «залипать» открытым: Esc, навигация назад/вперёд и переход на десктопную ширину его закрывают.
onKeyStroke("Escape", () => mobileMenuStore.closeMenu())
watch(
    () => route.fullPath,
    () => mobileMenuStore.closeMenu()
)
const isDesktop = useMediaQuery("(min-width: 1024px)")
watch(isDesktop, (matches) => {
    if (matches) mobileMenuStore.closeMenu()
})
</script>

<template>
    <Transition name="menu">
        <div
            v-if="isMenuOpen"
            id="mobile-menu"
            class="border-primary/20 fixed top-(--ui-header-height) right-0 left-0 z-98 h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto border-t bg-white/92 backdrop-blur-md lg:hidden"
        >
            <UContainer class="flex h-full flex-col gap-6 py-6">
                <nav class="w-full" aria-label="Основная навигация">
                    <ul class="flex w-full list-none flex-col gap-2">
                        <TransitionGroup name="nav-item">
                            <li
                                v-for="(r, i) in NAV_ROUTES"
                                v-show="isMenuOpen"
                                :key="r.label"
                                :style="{ transitionDelay: `${i * 55}ms` }"
                            >
                                <UButton
                                    :to="r.to"
                                    :label="r.label"
                                    :icon="r.icon"
                                    block
                                    variant="ghost"
                                    size="xl"
                                    class="px-5 py-3 text-lg font-semibold"
                                    :ui="{ label: 'mx-auto' }"
                                    @click="mobileMenuStore.closeMenu()"
                                />
                            </li>
                        </TransitionGroup>
                    </ul>
                </nav>

                <Transition name="actions">
                    <div v-if="isMenuOpen" class="mt-auto flex flex-col gap-3 pb-4">
                        <UButton
                            :to="HEADER_ACTIONS.cabinet.to"
                            :label="HEADER_ACTIONS.cabinet.label"
                            :trailing-icon="HEADER_ACTIONS.cabinet.icon"
                            color="info"
                            variant="soft"
                            size="xl"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                            @click="mobileMenuStore.closeMenu()"
                        />

                        <USeparator color="secondary" />

                        <UButton
                            :to="EnrollRoutesEnum.Trial"
                            label="Пробное занятие"
                            trailing-icon="ph:person-simple-run-bold"
                            size="xl"
                            variant="soft"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                            @click="mobileMenuStore.closeMenu()"
                        />
                        <UButton
                            :to="HEADER_ACTIONS.subscription.to"
                            :label="HEADER_ACTIONS.subscription.label"
                            :trailing-icon="HEADER_ACTIONS.subscription.icon"
                            color="secondary"
                            size="xl"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                            @click="mobileMenuStore.closeMenu()"
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
