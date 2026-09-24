<script lang="ts" setup>
/**
 * Компонент формы обратного звонка.
 * Делегирует бизнес-логику композаблу useCallbackForm.
 */

const selectedTime = ref("")

const toast = useToast()

const modalOpen = ref(false)

const onSuccessSubmit = (time: string) => {
    selectedTime.value = time
    modalOpen.value = true
}

const onErrorSubmit = (error: ApiError) => {
    toast.add({
        title: error.title,
        description: error.description,
        icon: "ph:x-circle-bold",
        color: "error"
    })
}
</script>

<template>
    <div class="bg-default flex max-w-xs flex-col rounded-lg p-2 sm:p-6 xl:max-w-sm">
        <CallbackModal v-model:open="modalOpen" :time="selectedTime" @close="modalOpen = false" />

        <CallbackForm @success="onSuccessSubmit" @error="onErrorSubmit" />

        <span class="text-default/70 mt-2 px-4 text-xs leading-tight">
            Нажимая на кнопку, вы даете согласие на
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
    </div>
</template>
