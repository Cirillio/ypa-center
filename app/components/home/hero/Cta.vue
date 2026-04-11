<template>
    <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
            <UButton
                :to="EnrollRoutesEnum.Subscription"
                color="secondary"
                size="lg"
                class="group w-fit"
            >
                <span class="text-base font-bold md:text-lg">Собрать абонемент</span>
                <UIcon
                    name="ph:puzzle-piece-duotone"
                    class="size-4.5 transition group-hover:scale-110 group-hover:rotate-6 md:size-5.5"
                />
            </UButton>
            <span class="text-default/90 ml-1 text-xs font-bold">
                Выгоднее разового — от <span class="text-primary">450 ₽</span> за занятие
            </span>
        </div>

        <UButton
            :to="EnrollRoutesEnum.Trial"
            size="lg"
            color="primary"
            variant="soft"
            class="group w-fit"
        >
            <span class="font-semibold">Записаться на пробное</span>
            <UIcon
                name="ph:arrow-right-bold"
                class="size-3.5 transition group-hover:translate-x-1"
            />
        </UButton>

        <div class="flex flex-col gap-1.5">
            <span class="text-default/70 ml-1 text-sm font-semibold">Или закажите звонок</span>
            <CallbackForm bg="white" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
</script>
