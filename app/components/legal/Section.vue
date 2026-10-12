<script lang="ts" setup>
defineProps<{
    title: string
    updatedAt: string
}>()
</script>

<template>
    <UContainer class="flex flex-col py-20 md:py-32">
        <div class="mx-auto max-w-3xl">
            <div class="border-default mb-10 flex flex-col gap-2 border-b pb-8">
                <p class="text-muted text-sm font-medium tracking-widest uppercase">
                    Юридические документы
                </p>
                <h1 class="text-secondary text-3xl font-extrabold md:text-4xl">
                    {{ title }}
                </h1>
                <p class="text-muted mt-1 text-sm">Последнее обновление: {{ updatedAt }}</p>
            </div>

            <article class="prose prose-neutral dark:prose-invert max-w-none">
                <slot />
            </article>

            <div class="bg-primary/5 ring-primary mt-24 rounded-md px-6 py-5 ring-2">
                <p class="text-primary text-base leading-relaxed font-semibold">
                    По вопросам, связанным с этим документом, обращайтесь:
                    <strong class="text-default/80">МАУДО «Улица Радости»</strong>, г. Новосибирск.
                    Email:
                    <a href="mailto:info@ypa-center.ru" class="text-primary hover:underline">
                        info@ypa-center.ru
                    </a>
                </p>
            </div>
        </div>
    </UContainer>
</template>
