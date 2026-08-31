<template>
    <div
        class="border-primary/20 bg-primary/5 flex flex-col items-center gap-4 rounded-md border border-dashed px-6 py-12 text-center md:py-16"
    >
        <UIcon name="ph:sparkle-duotone" class="text-primary size-12" />
        <div class="flex flex-col gap-2">
            <h3 class="text-secondary text-xl font-extrabold md:text-2xl">
                Скоро откроем новые направления
            </h3>
            <p class="text-default/80 max-w-md text-base font-medium">
                Сейчас формируем группы на новый сезон. Загляните в полный каталог — там уже есть
                занятия, на которые можно записаться.
            </p>
        </div>
        <UButton to="/clubs" size="xl" class="group w-fit">
            <span class="font-bold md:text-lg">Весь каталог</span>
            <UIcon
                name="ph:arrow-right-bold"
                class="size-4 transition group-hover:translate-x-1 md:size-5"
            />
        </UButton>
    </div>
</template>
