<script lang="ts" setup>
import type { Teacher } from "~/types"
import { MOCK_TEACHERS } from "~/constants/mock"

const { data, pending, error } = await useFetch<Teacher[]>("/api/teachers/")

const teachers = computed(() => (data.value && data.value.length > 0 ? data.value : MOCK_TEACHERS))

useSeoMeta({
    title: "Команда — Улица Радости",
    description:
        "Познакомьтесь с педагогами детского центра «Улица Радости». Внимательные специалисты, которые любят детей и своё дело.",
    ogTitle: "Наша команда — Улица Радости",
    ogDescription: "Педагоги, которые вдохновляют детей учиться, творить и верить в себя."
})
</script>

<template>
    <main class="gradient-bg-ps">
        <TeachersSection />
        <TeachersGrid :teachers="teachers" :pending="pending" :error="!!error" />
    </main>
</template>
