<script lang="ts" setup>
// Состояние «не удалось загрузить» с повтором; одно на все секции, чтобы ошибки выглядели одинаково.
withDefaults(
    defineProps<{
        message: string
        title?: string
        description?: string
        icon?: string
        actionLabel?: string
        retrying?: boolean
        size?: "sm" | "md" | "lg"
    }>(),
    {
        title: undefined,
        description: "Попробуйте ещё раз.",
        icon: "ph:warning-circle-duotone",
        actionLabel: "Повторить",
        retrying: false,
        size: "md"
    }
)

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
    <div
        role="alert"
        class="fade-up flex"
        :class="
            size === 'sm'
                ? 'items-center gap-3 px-4 py-3 max-sm:flex-col max-sm:items-stretch sm:gap-4'
                : 'flex-col items-center gap-4 text-center ' +
                  (size === 'lg' ? 'px-6 py-16 md:py-20' : 'px-6 py-8')
        "
    >
        <!-- lg: солнце за облаком, как на экране отказа оплаты -->
        <UiMascot v-if="size === 'lg'" mood="cloudy" />

        <!-- md / sm: иконка на мягком оранжевом ореоле -->
        <span
            v-else
            class="relative flex shrink-0 items-center justify-center"
            :class="size === 'sm' ? 'size-10' : 'size-20'"
            aria-hidden="true"
        >
            <span class="bg-primary/15 absolute inset-0 rounded-full blur-xl" />
            <UIcon
                :name="icon"
                class="text-primary relative"
                :class="size === 'sm' ? 'size-6' : 'size-12'"
            />
        </span>

        <div
            class="flex min-w-0 flex-col gap-1"
            :class="size === 'sm' ? 'flex-1' : size === 'lg' ? 'max-w-md' : 'max-w-sm'"
        >
            <p v-if="title || size === 'lg'" class="text-default text-2xl font-extrabold">
                {{ title ?? "Что-то пошло не так" }}
            </p>
            <p
                class="text-muted font-medium text-balance"
                :class="size === 'sm' ? 'text-sm' : 'text-base'"
            >
                {{ message }} <br />
                <template v-if="description"> {{ description }}</template>
            </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center justify-center gap-2">
            <UButton
                type="button"
                variant="soft"
                :size="size === 'lg' ? 'md' : 'sm'"
                icon="ph:arrow-clockwise"
                :label="actionLabel"
                :loading="retrying"
                :aria-busy="retrying"
                @click="emit('retry')"
            />
            <slot name="action" />
        </div>
    </div>
</template>
