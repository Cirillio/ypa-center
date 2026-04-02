<template>
    <div class="flex gap-2 max-lg:flex-col md:gap-4 lg:items-center">
        <UButton to="/enroll" size="xl" class="group w-fit md:px-5 md:py-2.5">
            <span class="font-bold md:text-xl">Записаться</span>
            <UIcon
                name="ph:rocket-launch-duotone"
                class="size-5 transition group-hover:translate-x-1.5 group-hover:scale-110 group-hover:rotate-5 md:size-6"
            />
        </UButton>
        <UButton to="/subscription" size="lg" color="secondary" class="group w-fit md:px-4 md:py-2">
            <span class="font-bold md:text-lg">Оформить абонемент</span>
            <UIcon
                name="ph:pencil-duotone"
                class="size-5 transition group-hover:translate-x-1.5 group-hover:scale-110 group-hover:rotate-5 md:size-5.5"
            />
        </UButton>
    </div>

    <div class="flex flex-col gap-1">
        <span class="text-default/75 ml-4 font-bold md:text-lg">Или закажите звонок!</span>
        <AppCallbackForm bg="white" />
    </div>
</template>

<script lang="ts" setup></script>
