<script lang="ts" setup>
import { vMaska } from "maska/vue"
import type { FormSubmitEvent } from "@nuxt/ui"
import { Maskas } from "~/constants/masks"
import type { EventRegistration } from "~/schemas/event.schema"

const state = defineModel<EventRegistration>({ required: true })

defineProps<{ schema: unknown; loading?: boolean }>()

const emit = defineEmits<{
    submit: [event: FormSubmitEvent<EventRegistration>]
}>()

const referralItems = [
    "ВКонтакте",
    "Telegram",
    "От друзей / знакомых",
    "Поисковик (Google, Яндекс)",
    "Флаер / баннер",
    "Другое"
]

const participantItems = ["1", "2", "3", "4", "5"]
</script>

<template>
    <div class="sticky top-[calc(var(--header-height)+1rem)] rounded-sm bg-white px-6 py-4">
        <h3 class="text-default mb-6 text-2xl font-bold">2. Заполните анкету</h3>

        <UForm
            id="eventRegistration"
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit.prevent="emit('submit', $event)"
        >
            <UFormField label="ФИО участника (ребёнка)" name="participantName" required>
                <UInput
                    v-model="state.participantName"
                    placeholder="Иванов Иван Иванович"
                    class="w-full"
                    variant="soft"
                />
            </UFormField>

            <UFormField label="ФИО родителя" name="parentFullName" required>
                <UInput
                    v-model="state.parentFullName"
                    placeholder="Иванова Мария Петровна"
                    class="w-full"
                    variant="soft"
                />
            </UFormField>

            <UFormField label="Телефон" name="phone" required>
                <UInput
                    v-model="state.phone"
                    v-maska="Maskas.Phone"
                    :placeholder="Maskas.Phone"
                    type="tel"
                    class="w-full"
                    variant="soft"
                />
            </UFormField>

            <UFormField label="Telegram (Имя пользователя)" name="telegram" required>
                <UInput
                    v-model="state.telegram"
                    v-maska="{
                        mask: Maskas.Telegram,
                        tokens: { '*': { pattern: /[a-zA-Z0-9_]/, repeated: true } }
                    }"
                    placeholder="прим. @ivanIvanoff"
                    class="w-full"
                    variant="soft"
                />
            </UFormField>

            <UFormField label="Количество участников" name="participants" required>
                <USelect
                    v-model="state.participants"
                    variant="soft"
                    :items="participantItems"
                    :content="{ bodyLock: false }"
                    placeholder="Выберите количество"
                    class="w-full"
                />
            </UFormField>

            <UFormField label="Откуда вы о нас узнали?" name="referralSource" required>
                <USelect
                    v-model="state.referralSource"
                    :items="referralItems"
                    variant="soft"
                    placeholder="Выберите вариант"
                    :content="{ bodyLock: false }"
                    class="w-full"
                />
            </UFormField>

            <UFormField label="Комментарии" name="comments">
                <UTextarea
                    v-model="state.comments"
                    placeholder="Дополнительные пожелания или вопросы..."
                    :rows="3"
                    autoresize
                    variant="soft"
                    class="w-full"
                />
            </UFormField>

            <UButton
                type="submit"
                label="Перейти к оплате"
                :loading="loading"
                class="text-lg"
                block
            />

            <span class="text-muted text-sm">
                Нажимая на кнопку, вы соглашаетесь с
                <NuxtLink
                    to="/privacy"
                    class="text-primary hover:text-primary/75 underline underline-offset-2 transition duration-150"
                >
                    Политикой конфиденциальности
                </NuxtLink>
                и даёте согласие на
                <NuxtLink
                    to="/consent"
                    class="text-primary hover:text-primary/75 underline underline-offset-2 transition duration-150"
                >
                    обработку персональных данных
                </NuxtLink>
            </span>

            <ul class="mt-4 flex flex-col gap-1">
                <li
                    v-for="item in [
                        { icon: 'ph:shield-check-duotone', text: 'Безопасный платёж через ЮКассу' },
                        {
                            icon: 'ph:calendar-check-duotone',
                            text: 'Подтверждение придёт в Telegram'
                        },
                        { icon: 'ph:percent-duotone', text: 'Без скрытых комиссий' }
                    ]"
                    :key="item.text"
                    class="text-default/60 flex items-center gap-1.5 text-sm font-medium"
                >
                    <UIcon :name="item.icon" class="text-secondary/70 size-5 shrink-0" />
                    {{ item.text }}
                </li>
            </ul>
        </UForm>
    </div>
</template>
