<script lang="ts" setup>
// Галочка согласия на обработку ПД: бэк требует явное true; вошедшему с согласием из регистрации не показывается.
defineProps<{
    disabled?: boolean
}>()

const checked = defineModel<boolean>({ required: true })

// ПОЧЕМУ: согласие уже дано отдельной галочкой при регистрации (pd_consent_at) – отправляем его, не переспрашивая
const hasStoredConsent = useStoredConsent()
// ПОЧЕМУ watchEffect, а не watch по флагу: форма после отправки сбрасывает галочку в false, а скрытую не поставить руками
watchEffect(() => {
    if (hasStoredConsent.value && !checked.value) checked.value = true
})
</script>

<template>
    <UCheckbox
        v-if="!hasStoredConsent"
        :model-value="checked"
        :disabled="disabled"
        @update:model-value="checked = $event === true"
    >
        <template #label>
            <span class="text-muted cursor-pointer text-sm leading-snug">
                Даю согласие на
                <NuxtLink
                    to="/consent"
                    target="_blank"
                    class="text-primary font-semibold underline underline-offset-2"
                >
                    обработку персональных данных
                </NuxtLink>
                и принимаю
                <NuxtLink
                    to="/privacy"
                    target="_blank"
                    class="text-primary font-semibold underline underline-offset-2"
                >
                    политику обработки
                </NuxtLink>
            </span>
        </template>
    </UCheckbox>
</template>
