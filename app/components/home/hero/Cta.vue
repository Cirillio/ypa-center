<template>
    <div class="flex flex-col gap-2">
        <UButton to="/enroll" size="lg" class="group w-fit md:px-4 md:py-2">
            <span class="text-base font-bold md:text-lg">Записаться на пробное</span>
            <UIcon
                name="ph:rocket-launch-duotone"
                class="size-4.5 transition group-hover:translate-x-1.5 group-hover:scale-110 group-hover:rotate-5 md:size-5.5"
            />
        </UButton>
        <UButton
            to="/subscription"
            size="xl"
            color="secondary"
            class="group w-fit md:px-5 md:py-2.5"
        >
            <span class="text-lg font-bold">Оформить абонемент</span>
            <UIcon
                name="ph:calendar-dots-fill"
                class="size-6 transition group-hover:scale-110 group-hover:rotate-6"
            />
        </UButton>
    </div>

    <div class="flex flex-col gap-1">
        <span class="text-default/75 ml-4 font-bold md:text-lg">Или закажите звонок!</span>
        <CallbackForm bg="white" />
    </div>
</template>

<script lang="ts" setup></script>
