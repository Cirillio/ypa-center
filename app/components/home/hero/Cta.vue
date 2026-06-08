<template>
    <div class="max-md: flex flex-col items-start gap-4">
        <UButton
            :to="EnrollRoutesEnum.Subscription"
            color="secondary"
            size="lg"
            class="group w-fit"
        >
            <UIcon
                name="ph:puzzle-piece-duotone"
                class="size-5 transition group-hover:scale-110 group-hover:rotate-6 md:size-6"
            />
            <span class="text-lg font-bold md:text-xl">Собрать абонемент</span>
        </UButton>

        <UButton
            leading-icon="ph:calendar-dot-bold"
            :to="EnrollRoutesEnum.Trial"
            variant="soft"
            size="md"
            class="text-base md:text-lg"
        >
            Разовое занятие
        </UButton>
    </div>
</template>

<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
</script>
