<script lang="ts" setup>
import { NAV_ROUTES } from "~/constants/nav"
import { useMobileMenuStore } from "~/store/mobile-menu"

const mobileMenuStore = useMobileMenuStore()
const { isMenuOpen } = storeToRefs(mobileMenuStore)

// Блокируем скролл страницы пока меню открыто
const overflowWatch = watch(isMenuOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : ""
})

onUnmounted(() => {
    document.body.style.overflow = ""
    overflowWatch()
})

// Закрываем меню и навигируем — работает даже если маршрут тот же
function navigate(to: string) {
    mobileMenuStore.closeMenu()
    navigateTo(to)
}
</script>

<template>
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
                                    :icon="r.icon"
                                    block
                                    variant="ghost"
                                    size="xl"
                                    class="px-5 py-3 text-lg font-semibold"
                                    :ui="{ label: 'mx-auto' }"
                                    @click="navigate(r.to)"
                                />
                            </li>
                        </TransitionGroup>
                    </ul>
                </nav>

                <Transition name="actions">
                    <div v-if="isMenuOpen" class="mt-auto flex flex-col gap-3 pb-4">
                        <UButton
                            label="Пробное занятие"
                            trailing-icon="ph:rocket-launch-duotone"
                            size="xl"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                            @click="navigate('/enroll')"
                        />
                        <UButton
                            label="Оформить абонемент"
                            color="secondary"
                            trailing-icon="ph:calendar-dots-fill"
                            size="xl"
                            class="w-full justify-center py-3 text-base font-semibold"
                            :ui="{ trailingIcon: 'size-5' }"
                            @click="navigate('/enroll')"
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
