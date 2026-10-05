<script lang="ts" setup>
// Галочка согласия на обработку ПД: бэк требует явное true, по умолчанию не отмечена.
defineProps<{
    disabled?: boolean
}>()

const checked = defineModel<boolean>({ required: true })
</script>

<template>
    <UCheckbox
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
