<template>
    <section
        class="gradient-bg-ps-hero z-0 flex min-h-dvh w-full items-center overflow-hidden py-(--header-height)"
    >
        <UPageHero as="div" orientation="horizontal" class="w-full">
            <template #headline>
                <span
                    class="text-primary/70 text-xs font-extrabold tracking-[0.015rem] uppercase lg:text-sm"
                >
                    Новосибирск &nbsp;•&nbsp; Академгородок
                </span>
            </template>

            <template #title>
                <span
                    class="text-secondary flex flex-col text-4xl leading-[1.06] font-extrabold text-balance lg:text-5xl xl:text-6xl"
                >
                    Кружки, <br />
                    продленка, <br />
                    каникулы — <br />

                    <span class="text-primary">
                        <span>
                            <span class="text-secondary">на</span> <span>Улице Радости</span></span
                        ><span class="text-secondary">!</span>
                    </span>
                </span>
            </template>

            <template #description>
                <span
                    class="text-default/95 flex max-w-[24rem] flex-col gap-4 text-lg leading-snug font-semibold text-balance sm:max-w-lg sm:text-lg md:text-xl"
                >
                    Место, где дети учатся думать, творить и верить в себя. Кружки, продлёнка и
                    каникулярные программы — в уютной атмосфере рядом с домом!
                </span>
            </template>

            <template #links>
                <HomeHeroCta />
            </template>

            <UCarousel
                v-slot="{ item, index }"
                v-bind="carousel"
                class="ml-auto aspect-square max-h-140 overflow-hidden rounded-lg shadow-lg transition"
                :ui="{
                    container: '-ms-0',
                    item: 'ps-0',
                    dots: isHydrated
                        ? 'px-3 py-2 rounded-lg bg-default/75 bottom-4 w-fit gap-2 left-4 backdrop-blur-sm'
                        : 'hidden',
                    dot: 'bg-white shadow-sm data-[state=active]:ring-primary/25 data-[state=active]:ring-2 backdrop-blur-sm data-[state=active]:shadow-none data-[state=active]:bg-primary/75 size-3'
                }"
            >
                <AppPhoto
                    :src="item"
                    :quality="index === 0 ? 100 : 75"
                    alt="Фото центра"
                    class="aspect-square h-full w-full object-cover object-center"
                    :is-preload="index === 0"
                />
            </UCarousel>
        </UPageHero>
    </section>
</template>

<script lang="ts" setup>
const photos = [
    "/core/default.png",
    "/moke/club_1.jpg",
    "/moke/club_2.jpg",
    "/moke/teacher_1.png",
    "/moke/teacher_3.png"
]

const carouselDelay = 5000

const { isHydrated } = useIsHydrated()

// Автопрокрутка отключается при prefers-reduced-motion для a11y и до гидратации
const carousel = computed(() => {
    const isReducedMotion =
        import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    return {
        items: photos,
        dots: true,
        loop: true,
        autoplay:
            isHydrated.value && !isReducedMotion
                ? {
                      delay: carouselDelay,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true
                  }
                : false
    }
})
</script>
