<script lang="ts" setup>
// Виджет анкеты нового пользователя для завершения регистрации после подтверждения email.
import { vMaska } from "maska/vue"
import { Maskas } from "~/constants/masks"
import type { FormErrorEvent } from "@nuxt/ui"
import { REFERRAL_ITEMS } from "~/constants/referral-sources"
import type { ProfileCompletion } from "~/schemas/profile.schema"

const authStore = useAuthStore()
const { state, schema, isLoading, error, clearError, submit } = useProfileForm()
const form = useTemplateRef("form")

const emit = defineEmits<{
    completed: []
}>()

// Валидация только на сабмите: при вводе снимаем ошибку лишь изменённого поля.
const clearFieldError = (name: keyof ProfileCompletion) => {
    form.value?.clear(name)
    clearError()
}

// Фокус на первое ошибочное поле, чтобы клавиатурный пользователь не искал его.
const onError = (event: FormErrorEvent) => {
    const id = event.errors[0]?.id
    if (!id) return
    // ПОЧЕМУ rAF, а не nextTick: UForm эмитит error, пока поля ещё disabled
    // (loadingAuto), и снимает disabled уже после emit – следующим flush.
    requestAnimationFrame(() => document.getElementById(id)?.focus())
}

const onSubmit = async () => {
    const ok = await submit()
    if (ok) {
        emit("completed")
    }
}
</script>

<template>
    <section class="flex h-fit w-full max-w-sm flex-col items-center text-center">
        <UiRoundIcon name="ph:user-circle-plus-bold" class="mb-6 max-sm:hidden" />
        <h1 class="text-primary text-3xl font-bold sm:text-4xl">
            Завершение <span class="text-secondary">регистрации</span>
        </h1>
        <p class="text-default/70 mt-2 text-base">
            Заполните данные для создания профиля и оформления занятий.
        </p>

        <UForm
            ref="form"
            :schema="schema"
            :state="state"
            :validate-on="[]"
            class="mt-6 flex w-full flex-col gap-4 text-left"
            @submit="onSubmit"
            @error="onError"
        >
            <UFormField label="Подтверждённая почта" name="email">
                <UInput
                    :model-value="authStore.email"
                    disabled
                    size="xl"
                    variant="subtle"
                    class="w-full opacity-80"
                    :ui="{
                        base: 'bg-white shadow-sm'
                    }"
                />
            </UFormField>

            <UFormField label="Ваше ФИО" name="fullName" required>
                <UInput
                    v-model="state.fullName"
                    :disabled="isLoading"
                    placeholder="Иванова Мария Петровна"
                    autocomplete="name"
                    size="xl"
                    variant="subtle"
                    class="w-full"
                    :ui="{
                        base: 'bg-white shadow-sm'
                    }"
                    @update:model-value="clearFieldError('fullName')"
                />
            </UFormField>

            <UFormField label="Номер телефона" name="phone">
                <UInput
                    v-model="state.phone"
                    v-maska="Maskas.Phone"
                    :placeholder="Maskas.Phone"
                    type="tel"
                    :disabled="isLoading"
                    size="xl"
                    variant="subtle"
                    class="w-full"
                    :ui="{
                        base: 'bg-white shadow-sm'
                    }"
                    @update:model-value="clearFieldError('phone')"
                />
            </UFormField>

            <UFormField label="Откуда вы о нас узнали?" name="referralSource" required>
                <USelect
                    v-model="state.referralSource"
                    :items="REFERRAL_ITEMS"
                    :disabled="isLoading"
                    placeholder="Выберите вариант"
                    size="xl"
                    variant="subtle"
                    class="w-full"
                    :content="{ bodyLock: false }"
                    :ui="{
                        base: 'bg-white shadow-sm'
                    }"
                    @update:model-value="clearFieldError('referralSource')"
                />
            </UFormField>

            <UFormField name="consent">
                <UCheckbox
                    v-model="state.consent"
                    :disabled="isLoading"
                    color="primary"
                    @update:model-value="clearFieldError('consent')"
                >
                    <template #label>
                        <span class="text-default/80 text-xs leading-tight">
                            Я согласен на
                            <NuxtLink
                                to="/consent"
                                target="_blank"
                                class="text-primary hover:underline"
                            >
                                обработку персональных данных
                            </NuxtLink>
                            и ознакомлен с
                            <NuxtLink
                                to="/privacy"
                                target="_blank"
                                class="text-primary hover:underline"
                            >
                                политикой
                            </NuxtLink>
                        </span>
                    </template>
                </UCheckbox>
            </UFormField>

            <p v-if="error" class="text-error text-center text-sm">{{ error }}</p>

            <UButton
                type="submit"
                :loading="isLoading"
                block
                class="mt-1 text-lg font-semibold"
                label="Завершить регистрацию"
            />
        </UForm>
    </section>
</template>
