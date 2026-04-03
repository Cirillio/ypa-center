<template>
    <div class="relative flex size-full flex-col md:justify-center">
        <div
            class="relative flex aspect-square w-full max-w-full items-center justify-center p-4 sm:max-w-sm md:mx-auto md:max-w-none"
        >
            <div
                id="hero_main_bg"
                class="to-default relative z-10 aspect-square size-full from-amber-100 via-sky-50 p-4 md:overflow-hidden md:rounded-full md:bg-linear-to-b"
            >
                <!-- HOUSES -->
                <NuxtImg
                    class="relative z-10 h-full w-full translate-y-8 scale-120 object-contain object-bottom"
                    src="/core/ColorfulHouses.png"
                    alt="Улица Радости"
                    format="webp"
                    quality="90"
                    loading="eager"
                    fetchpriority="high"
                />
                <div
                    class="absolute top-2 right-2 bottom-2 left-2 z-0 hidden rounded-full border-6 border-white md:block"
                />
            </div>

            <!-- SUN -->
            <div
                class="floating-element absolute top-12 left-2/3 z-10 size-32 -translate-x-1/4 rotate-15 min-[460px]:size-52 sm:size-44 md:top-6 md:size-56 lg:-top-4 lg:size-72 xl:size-92"
            >
                <NuxtImg
                    src="/core/Sun.png"
                    alt=""
                    class="size-full object-contain object-bottom"
                    format="webp"
                    quality="90"
                    loading="eager"
                />
            </div>

            <!-- URA -->
            <div
                class="floating-element absolute -top-4 left-1/2 z-10 size-26 -translate-x-1/6 -rotate-10 max-sm:-translate-x-1/12 min-[460px]:-top-12 min-[460px]:size-40 sm:-top-6 sm:size-32 md:-top-24 md:size-52 lg:-top-30 xl:-top-36 xl:size-64"
            >
                <NuxtImg
                    src="/core/URA.png"
                    alt="Ура!"
                    class="size-full object-contain object-bottom"
                    format="webp"
                    quality="90"
                    loading="eager"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>
