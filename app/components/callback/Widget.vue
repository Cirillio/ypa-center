<script lang="ts" setup>
/**
 * Компонент формы обратного звонка.
 * Делегирует бизнес-логику композаблу useCallbackForm.
 */

const selectedTime = ref("")

const toast = useToast()

const modalOpen = ref(false)
// Монтируем модалку после первого успешного сабмита; при закрытии не размонтируем ради transition
const hasBeenSubmitted = ref(false)

const onSuccessSubmit = (time: string) => {
    selectedTime.value = time
    hasBeenSubmitted.value = true
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
    <div class="bg-default flex w-full flex-col rounded-lg p-5 sm:p-6 md:max-w-xs xl:max-w-sm">
        <LazyCallbackModal
            v-if="hasBeenSubmitted"
            v-model:open="modalOpen"
            :time="selectedTime"
            @close="void (modalOpen = false)"
        />

        <CallbackForm @success="onSuccessSubmit" @error="onErrorSubmit" />
    </div>
</template>
