<template>
    <div class="flex items-center gap-4">
        <UButton to="/enroll" size="xl" class="group w-fit px-5 py-2.5">
            <span class="text-xl font-bold">Записаться</span>
            <UIcon
                name="ph:rocket-launch-duotone"
                class="size-6 transition group-hover:translate-x-1.5 group-hover:scale-110 group-hover:rotate-5"
            />
        </UButton>
        <UButton to="/subscription" size="lg" color="secondary" class="group w-fit px-4 py-2">
            <span class="text-lg font-bold">Оформить абонемент</span>
            <UIcon
                name="ph:pencil-duotone"
                class="size-5.5 transition group-hover:translate-x-1.5 group-hover:scale-110 group-hover:rotate-5"
            />
        </UButton>
    </div>

    <div class="flex flex-col gap-1">
        <span class="text-default/75 ml-4 text-lg font-bold">Или закажите звонок!</span>
        <AppCallbackForm bg="white" />
    </div>
</template>

<script lang="ts" setup></script>
