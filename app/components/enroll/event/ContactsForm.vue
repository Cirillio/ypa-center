<script lang="ts" setup>
// Контакты гостя для подтверждения записи; валидация по схеме при уходе с поля.
import { vMaska } from "maska/vue"
import { Maskas } from "~/constants/masks"
import { type EventContacts, eventContactsSchema } from "~/schemas/event-contacts.schema"

const contacts = defineModel<EventContacts>({ required: true })

// Меняет одно поле, не мутируя объект модели напрямую.
function update<K extends keyof EventContacts>(key: K, value: EventContacts[K]) {
    contacts.value = { ...contacts.value, [key]: value }
}
</script>

<template>
    <UForm
        :schema="eventContactsSchema"
        :state="contacts"
        :validate-on="['change']"
        class="flex flex-col gap-3"
        aria-label="Контакты"
    >
        <h3 class="text-default text-base font-semibold">Контакты для подтверждения</h3>

        <UFormField label="Имя" name="name">
            <UInput
                :model-value="contacts.name"
                autocomplete="name"
                placeholder="Как к вам обращаться"
                size="xl"
                variant="subtle"
                class="w-full"
                @update:model-value="update('name', String($event ?? ''))"
            />
        </UFormField>

        <UFormField label="Телефон" name="phone">
            <UInput
                v-maska="Maskas.Phone"
                :model-value="contacts.phone"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                :placeholder="Maskas.Phone"
                size="xl"
                variant="subtle"
                class="w-full"
                @update:model-value="update('phone', String($event ?? ''))"
            />
        </UFormField>

        <UFormField label="Почта" name="email" help="Пришлём подтверждение и напоминание">
            <UInput
                :model-value="contacts.email"
                type="email"
                autocomplete="email"
                placeholder="name@example.ru"
                size="xl"
                variant="subtle"
                class="w-full"
                @update:model-value="update('email', String($event ?? ''))"
            />
        </UFormField>

        <UFormField name="consent">
            <UiConsentCheckbox
                :model-value="contacts.consent"
                @update:model-value="update('consent', $event)"
            />
        </UFormField>
    </UForm>
</template>
