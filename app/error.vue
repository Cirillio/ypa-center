<script lang="ts" setup>
import type { NuxtError } from "#app"

const props = defineProps<{
    error: NuxtError
}>()

const is404 = computed(() => props.error.status === 404)

useHead({
    title: is404.value ? "Страница не найдена — Улица Радости" : "Произошла ошибка — Улица Радости",
    meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const goHome = () => clearError({ redirect: "/" })
const goBack = () => useRouter().back()
const reload = () => window.location.reload()

onMounted(() => window.scrollTo({ top: 0, behavior: "instant" }))
</script>

<template>
    <NuxtLayout>
        <!-- 404 -->
        <section
            v-if="is404"
            class="gradient-bg-ps flex min-h-dvh w-full items-center justify-center pt-(--header-height)"
        >
            <UContainer
                class="flex items-center justify-center gap-10 max-md:flex-col max-md:py-12 md:gap-16"
            >
                <div class="grid aspect-square h-60 justify-center md:h-120">
                    <div
                        class="group hover:ring-error flex items-center justify-center overflow-hidden rounded-md ring-4 ring-transparent transition"
                    >
                        <AppPhoto
                            src="/core/404_page.png"
                            alt="404"
                            class="h-full w-full object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-6"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-6 max-md:items-center max-md:text-center">
                    <div class="flex flex-col gap-2">
                        <h1
                            class="text-secondary flex flex-col space-y-0.5 text-4xl font-extrabold sm:text-5xl lg:text-6xl"
                        >
                            <span> Страница </span>
                            <span class="text-primary"> потерялась </span>
                        </h1>
                        <p class="text-default/90 max-w-sm text-xl leading-snug font-semibold">
                            Кажется, Вы забрели не туда! Но не переживайте, мы поможем Вам найти
                            правильный путь.
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <UButton
                            label="Вернуться"
                            leading-icon="ph:arrow-left-bold"
                            size="lg"
                            color="secondary"
                            variant="ghost"
                            class="w-fit px-6 text-xl font-bold"
                            @click="goBack"
                        />

                        <UButton
                            label="На главную"
                            trailing-icon="ph:arrow-right-bold"
                            size="lg"
                            variant="ghost"
                            class="w-fit px-6 text-xl font-bold"
                            @click="goHome"
                        />
                    </div>
                </div>
            </UContainer>
        </section>

        <!-- Generic error -->
        <section
            v-else
            class="gradient-bg-ps flex min-h-dvh w-full items-center justify-center pt-(--header-height)"
        >
            <UContainer class="flex flex-col items-center gap-8 py-16 text-center">
                <p
                    class="text-primary/20 floating-element-slow text-[8rem] leading-none font-extrabold tracking-tight select-none sm:text-[12rem]"
                >
                    {{ error.status }}
                </p>

                <div class="-mt-6 flex flex-col items-center gap-3">
                    <h1 class="text-secondary text-4xl font-extrabold sm:text-5xl">
                        Что-то пошло не так
                    </h1>
                    <p class="text-default/90 max-w-sm text-lg leading-snug font-semibold">
                        Мы уже работаем над этим. Попробуй зайти чуть позже.
                    </p>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-3">
                    <UButton
                        label="Обновить страницу"
                        trailing-icon="ph:arrow-clockwise-bold"
                        size="xl"
                        class="px-6 font-bold"
                        @click="reload"
                    />
                    <UButton
                        label="На главную"
                        trailing-icon="ph:house-bold"
                        size="xl"
                        variant="ghost"
                        class="px-6 font-bold"
                        @click="goHome"
                    />
                </div>

                <div
                    class="bg-primary/5 text-primary/40 mt-8 max-w-lg rounded-lg border border-dashed border-current p-4 font-mono text-sm"
                >
                    {{ error.message || "Неизвестная ошибка" }}
                </div>
            </UContainer>
        </section>
    </NuxtLayout>
</template>
