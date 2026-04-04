<template>
    <div class="flex flex-col justify-center gap-4 px-2 max-md:gap-6 max-sm:pt-6 sm:gap-8 sm:px-6">
        <div class="flex flex-col gap-4">
            <h1
                class="text-secondary flex flex-col text-6xl leading-[0.88] font-extrabold md:text-6xl lg:text-7xl xl:text-8xl"
            >
                <span> <span class="text-primary">У</span>лица </span>
                <span> <span class="text-primary">РА</span>дости </span>
            </h1>

            <p
                class="text-default/75 max-w-[18rem] text-base leading-snug font-semibold sm:max-w-sm sm:text-lg md:text-xl"
            >
                Место, где дети учатся думать, творить и верить в себя. Кружки, продлёнка и
                каникулярные программы — в уютной атмосфере рядом с домом.
            </p>
        </div>

        <HomeHeroStats />
        <HomeHeroCta />
    </div>
</template>

<script lang="ts" setup></script>
