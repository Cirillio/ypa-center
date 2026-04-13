<script lang="ts" setup>
import { vMaska } from "maska/vue"
import type { FormSubmitEvent } from "@nuxt/ui"
import { Maskas } from "~/constants/masks"
import type { RegistrationForm } from "~/schemas/registration.schema"
import { SchoolClasses } from "~/types"

const state = defineModel<RegistrationForm>({ required: true })

defineProps<{ schema: unknown }>()

const emit = defineEmits<{
    submit: [event: FormSubmitEvent<RegistrationForm>]
}>()

const gradeItems = [...Object.values(SchoolClasses), "Другое"] as string[]

const referralItems = [
    "ВКонтакте",
    "Telegram",
    "От друзей / знакомых",
    "Поисковик (Google, Яндекс)",
    "Флаер / баннер",
    "Другое"
]
</script>

<template>
    <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit.prevent="emit('submit', $event)"
    >
        <UFormField label="ФИО ребенка" name="childFullName" required>
            <UInput
                v-model="state.childFullName"
                placeholder="Иванов Иван Иванович"
                class="w-full"
                variant="soft"
            />
        </UFormField>

        <UFormField label="Дата рождения" name="birthDate">
            <UInput
                v-model="state.birthDate"
                v-maska="Maskas.Date"
                :placeholder="Maskas.Date"
                type="text"
                class="w-full"
                variant="soft"
            />
        </UFormField>

        <UFormField label="Класс" name="grade" required>
            <USelect
                v-model="state.grade"
                variant="soft"
                :items="gradeItems"
                :content="{ bodyLock: false }"
                placeholder="Выберите класс"
                class="w-full"
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

        <UButton type="submit" label="Перейти к оплате" class="text-lg" block />

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
                    { icon: 'ph:calendar-check-duotone', text: 'Занятие можно перенести' },
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
</template>
