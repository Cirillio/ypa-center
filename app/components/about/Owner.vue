<script lang="ts" setup></script>

<template>
    <section class="bg-default relative z-10 flex w-full overflow-hidden py-16 md:py-24">
        <UContainer class="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div class="flex w-full justify-center">
                <div class="h-132 w-full overflow-hidden rounded-lg">
                    <AppPhoto
                        src="/core/owner_photo.jpg"
                        alt="Основатель центра"
                        class="object-cover object-center"
                    />
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <SectionLeading subtitle="Основатель">
                    <template #title>
                        <span class="text-secondary">
                            Макуха<br />
                            <span class="text-primary">Наталья</span>
                        </span>
                    </template>
                    <template #description>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                    </template>
                </SectionLeading>

                <blockquote
                    class="border-primary/30 text-default/70 border-l-4 pl-4 text-base leading-relaxed font-semibold italic"
                >
                    «Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.»
                </blockquote>

                <UButton
                    :to="`https://t.me/MakukhaNG`"
                    target="_blank"
                    external
                    variant="ghost"
                    leading-icon="simple-icons:telegram"
                    label="Написать напрямую"
                    size="xl"
                    class="w-fit font-semibold"
                />
            </div>
        </UContainer>
    </section>
</template>
