<template>
    <div class="flex flex-col justify-center gap-6 px-2 max-sm:pt-6 sm:px-6">
        <p class="text-primary/70 text-xs font-bold tracking-[0.2em] uppercase">
            Новосибирск&nbsp;•&nbsp;Центр умного развития
        </p>

        <div class="flex flex-col gap-4">
            <h2
                class="text-secondary flex flex-col text-5xl leading-[0.88] font-extrabold sm:text-6xl lg:text-7xl xl:text-8xl"
            >
                Один абонемент —
                <span> <span class="text-primary">все</span></span>
                <span> <span class="text-primary">кружки</span></span>
            </h2>

            <h1
                class="text-default/95 max-w-[18rem] text-base leading-snug font-semibold text-balance sm:max-w-lg sm:text-lg md:text-xl"
            >
                Место, где дети учатся думать, творить и верить в себя. Кружки, продлёнка и
                каникулярные программы — в уютной атмосфере рядом с домом.
            </h1>
        </div>

        <div class="flex flex-wrap gap-2">
            <span
                class="border-primary/30 bg-primary/10 text-primary rounded-full border px-3 py-1.5 text-sm font-semibold"
            >
                От 450 ₽ за занятие
            </span>
            <span
                class="border-secondary/30 bg-secondary/10 text-secondary rounded-full border px-3 py-1.5 text-sm font-semibold"
            >
                Пробное — 1 200 ₽
            </span>
            <span
                class="border-default/20 bg-default/10 text-default/70 rounded-full border px-3 py-1.5 text-sm font-semibold"
            >
                Любые кружки на выбор
            </span>
        </div>

        <div class="md:hidden">
            <HomeHeroCta />
        </div>
    </div>
</template>

<script lang="ts" setup></script>
