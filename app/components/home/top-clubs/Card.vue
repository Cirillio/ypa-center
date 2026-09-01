<script lang="ts" setup>
withDefaults(
    defineProps<{
        name: string
        shortDescription: string
        coverImage?: string
        // featured — крупная карточка в раскладке из 3 кружков (растянута на 2 строки)
        featured?: boolean
    }>(),
    {
        coverImage: "",
        featured: false
    }
)

// Обложка опциональна на бэке — пустой src в AppPhoto даёт состояние ошибки
const FALLBACK_COVER = "/core/clubs-main.jpg"
</script>

<template>
    <div
        class="focus-visible:outline-primary group relative flex flex-col overflow-hidden rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
    >
        <div class="relative h-full min-h-0 overflow-hidden">
            <AppPhoto
                :src="coverImage || FALLBACK_COVER"
                class="object-cover object-center transition duration-300 group-hover:scale-105"
                :alt="'Кружок — ' + name"
            />
        </div>

        <div
            class="absolute bottom-0 z-0 h-full w-full bg-linear-to-t from-black/80 to-transparent"
        ></div>

        <div
            class="text-default absolute bottom-0 z-10 flex flex-col items-start gap-1 px-3 py-4 md:gap-2 md:p-4"
        >
            <h3
                class="font-bold text-white transition"
                :class="featured ? 'text-2xl lg:text-4xl xl:text-6xl' : 'text-2xl lg:text-3xl'"
            >
                {{ name }}
            </h3>
            <p
                class="leading-snug font-medium text-balance text-white/90"
                :class="featured ? 'text-base md:text-2xl' : 'text-base md:text-xl'"
            >
                {{ shortDescription }}
            </p>
        </div>
    </div>
</template>
