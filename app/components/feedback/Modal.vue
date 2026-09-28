<script lang="ts" setup>
/**
 * Кнопка «Написать нам» + модалка с формой обратной связи.
 * Самодостаточный компонент – подключается одной строкой в любом месте сайта.
 */

// ПОЧЕМУ один загрузчик: вызов на ховере греет кэш модуля, defineAsyncComponent потом берёт готовый чанк
const loadDialog = () => import("./Dialog.vue")
const FeedbackDialog = defineAsyncComponent(loadDialog)

const toast = useToast()

const isOpen = ref(false)
// Монтируем модалку при первом открытии; при закрытии не размонтируем, чтобы не ломать анимацию UModal
const hasBeenOpened = ref(false)

// Начинает загрузку чанка модалки заранее – к клику он обычно уже готов
const prefetchDialog = () => {
    // Ошибку префетча глушим: клик повторит загрузку и покажет тост
    loadDialog().catch(() => {})
}

// Открывает модалку только после загрузки чанка: без пустого кадра и «впрыгивающей» формы
const openModal = async () => {
    try {
        await loadDialog()
    } catch {
        // Чанк не скачался (сеть, деплой при открытой вкладке) – иначе кнопка молча не срабатывает
        toast.add({
            title: "Не удалось открыть форму",
            description: "Проверьте соединение и обновите страницу.",
            icon: "ph:x-circle-bold",
            color: "error"
        })
        return
    }
    hasBeenOpened.value = true
    isOpen.value = true
}
</script>

<template>
    <UButton
        label="Написать нам"
        variant="soft"
        class="w-fit"
        leading-icon="ph:envelope-simple-bold"
        @pointerenter.once="prefetchDialog"
        @focus.once="prefetchDialog"
        @touchstart.once.passive="prefetchDialog"
        @click="openModal"
    />

    <FeedbackDialog v-if="hasBeenOpened" v-model:open="isOpen" />
</template>
