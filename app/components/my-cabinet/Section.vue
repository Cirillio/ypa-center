<script lang="ts" setup>
defineProps<{
    isAuthed: boolean
}>()

defineEmits<{
    logout: []
}>()
</script>

<template>
    <PageSection>
        <UContainer class="flex items-start justify-between">
            <SectionLeading icon="ph:user-bold" subtitle="Личный кабинет" as="h1">
                <template #title>
                    <span class="text-primary"
                        >Мой <span class="text-secondary">кабинет</span></span
                    >
                </template>

                <template #description>
                    <template v-if="isAuthed">
                        Здесь собраны ваши абонементы, разовые занятия и расписание ближайших
                        активностей.
                    </template>
                    <template v-else>
                        Вы не вошли в аккаунт. Войдите, чтобы увидеть свои абонементы и расписание.
                    </template>
                </template>
            </SectionLeading>
            <UButton
                v-if="isAuthed"
                color="error"
                variant="soft"
                trailing-icon="ph:sign-out-bold"
                class="w-fit text-lg font-semibold"
                @click="$emit('logout')"
            >
                Выйти
            </UButton>
        </UContainer>
    </PageSection>
</template>
