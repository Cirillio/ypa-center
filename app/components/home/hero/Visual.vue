<template>
    <div class="relative flex size-full flex-col justify-center">
        <div class="relative mx-auto flex aspect-square w-full items-center justify-center p-4">
            <div
                id="hero_main_bg"
                class="to-default relative z-10 aspect-square size-full overflow-hidden rounded-full bg-linear-to-b from-amber-100 via-sky-50 p-4"
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
                    class="absolute top-2 right-2 bottom-2 left-2 z-0 block rounded-full border-6 border-white"
                />
            </div>

            <!-- SUN -->
            <div
                class="floating-element absolute -top-4 left-2/3 z-10 size-92 -translate-x-1/4 rotate-15"
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
                class="floating-element absolute -top-36 left-1/2 z-10 size-64 -translate-x-1/6 -rotate-10"
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
