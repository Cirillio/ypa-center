<script lang="ts" setup>
/**
 * Форма обратной связи (свободное сообщение, не заявка на звонок).
 * Делегирует бизнес-логику композаблу useFeedbackForm.
 */
import { useMounted } from "@vueuse/core"
import { feedbackSchema } from "~/schemas/feedback.schema"

const emit = defineEmits<{ success: [] }>()

const toast = useToast()
const turnstileRef = ref()

const { form, captchaToken, isLoading, isSpamBlocked, isSubmitDisabled, onSubmit } =
    useFeedbackForm({
        onSuccess: () => {
            toast.add({
                title: "Сообщение отправлено",
                description: "Спасибо! Мы ответим вам на почту в ближайшее время.",
                icon: "ph:check-circle-bold",
                color: "success"
            })
            turnstileRef.value?.reset()
            emit("success")
        },
        onError: (err) => {
            toast.add({
                title: err.title,
                description: err.description,
                icon: "ph:x-circle-bold",
                color: "error"
            })
            turnstileRef.value?.reset()
        }
    })

const isMounted = useMounted()

// Единый стиль полей — как в CallbackForm
const inputUi = {
    base: "md:text-lg !text-base bg-white font-semibold text-default placeholder:text-default/75"
}
</script>

<template>
    <UForm
        id="feedbackForm"
        :schema="feedbackSchema"
        :state="form"
        class="flex flex-col gap-2"
        :validate-on="[]"
        @submit="
            (event) => {
                onSubmit(event)
            }
        "
    >
        <div class="flex items-start gap-2">
            <UiRoundIcon name="ph:user" class="max-sm:hidden" />
            <UFormField name="name" class="w-full">
                <UInput
                    v-model="form.name"
                    :disabled="isLoading"
                    name="name"
                    placeholder="Ваше имя"
                    autocomplete="name"
                    type="text"
                    size="xl"
                    color="secondary"
                    variant="subtle"
                    class="w-full"
                    :ui="inputUi"
                />
            </UFormField>
        </div>

        <div class="flex items-start gap-2">
            <UiRoundIcon name="ph:envelope-simple" class="max-sm:hidden" />
            <UFormField name="email" class="w-full">
                <UInput
                    v-model="form.email"
                    :disabled="isLoading"
                    name="email"
                    type="email"
                    placeholder="Ваш email"
                    autocomplete="email"
                    size="xl"
                    color="secondary"
                    variant="subtle"
                    class="w-full"
                    :ui="inputUi"
                />
            </UFormField>
        </div>

        <div class="flex items-start gap-2">
            <UiRoundIcon name="ph:chat-circle-text" class="max-sm:hidden" />
            <UFormField name="message" class="w-full">
                <UTextarea
                    v-model="form.message"
                    :disabled="isLoading"
                    name="message"
                    placeholder="О чём хотите спросить или рассказать?"
                    :rows="4"
                    autoresize
                    size="xl"
                    color="secondary"
                    variant="subtle"
                    class="w-full"
                    :ui="inputUi"
                />
            </UFormField>
        </div>

        <NuxtTurnstile
            ref="turnstileRef"
            v-model="captchaToken"
            :options="{ appearance: 'interaction-only' }"
        />

        <!-- Кнопка отправки с подсказкой при блокировке спама -->
        <UTooltip
            :ui="{
                content:
                    'ring-0 shadow-none bg-primary md:text-lg md:px-4 font-semibold md:py-3.5 text-white'
            }"
            :delay-duration="75"
            :content="{ side: 'top' }"
            :text="
                isSpamBlocked
                    ? 'Вы недавно уже отправляли сообщение. Пожалуйста, подождите.'
                    : undefined
            "
        >
            <UButton
                :disabled="isSubmitDisabled || !isMounted"
                :loading="isLoading || isSpamBlocked || !isMounted"
                color="primary"
                type="submit"
                :label="!isMounted ? 'Загрузка...' : isSpamBlocked ? 'Ожидайте...' : 'Отправить'"
                :variant="!isSubmitDisabled ? 'solid' : 'soft'"
                class="w-full justify-center text-lg font-semibold focus-visible:ring-0"
            />
        </UTooltip>

        <span class="text-default/70 mt-2 px-4 text-xs leading-tight">
            Нажимая на кнопку, вы даёте согласие на
            <NuxtLink
                target="_blank"
                external
                to="/privacy"
                class="hover:text-primary underline transition-colors"
            >
                обработку персональных данных
            </NuxtLink>
            и соглашаетесь с
            <NuxtLink
                target="_blank"
                external
                to="/consent"
                class="hover:text-primary underline transition-colors"
            >
                политикой конфиденциальности </NuxtLink
            >.
        </span>
    </UForm>
</template>
