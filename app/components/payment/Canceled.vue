<script lang="ts" setup>
const props = defineProps<{
    reason?: string
}>()

const emit = defineEmits<{ retry: [] }>()

const { contactInfo } = useAppConfig()
const telegramHref = contactInfo.directorTelegram

const shaking = ref(false)

onMounted(() => {
    shaking.value = true
    setTimeout(() => {
        shaking.value = false
    }, 550)
})

const REASON_MAP: Record<string, string> = {
    expired_on_confirmation: 'Время оплаты истекло',
    insufficient_funds: 'Недостаточно средств на карте',
    card_expired: 'Карта недействительна',
    '3d_secure_failed': 'Ошибка подтверждения 3D-Secure',
    payment_method_rejected: 'Платёж отклонён банком',
    fraud_suspected: 'Платёж отклонён',
    internal_timeout: 'Технический сбой',
    general_decline: 'Платёж отклонён'
}

const title = computed(() =>
    props.reason ? (REASON_MAP[props.reason] ?? 'Платёж отменён') : 'Платёж отменён'
)

const isFraud = computed(() => props.reason === 'fraud_suspected')
</script>

<template>
    <div class="flex min-h-64 flex-col items-center justify-center gap-6 rounded-sm bg-white px-6 py-10">
        <UIcon
            name="ph:x-circle-bold"
            :class="['size-16 text-red-400', { 'icon-shake': shaking }]"
        />

        <div class="space-y-1 text-center">
            <p class="text-default text-xl font-bold">{{ title }}</p>
            <p class="text-muted text-sm">
                {{ isFraud ? 'Обратитесь в поддержку' : 'Вы можете попробовать снова' }}
            </p>
        </div>

        <div class="flex w-full flex-col gap-2">
            <UButton
                v-if="!isFraud"
                label="Попробовать снова"
                block
                @click="emit('retry')"
            />
            <UButton
                :to="telegramHref"
                target="_blank"
                label="Написать в поддержку"
                variant="soft"
                leading-icon="simple-icons:telegram"
                block
            />
        </div>
    </div>
</template>

<style scoped>
@keyframes shake {
    0%,
    100% {
        transform: rotate(0deg);
    }
    20% {
        transform: rotate(-4deg);
    }
    40% {
        transform: rotate(4deg);
    }
    60% {
        transform: rotate(-4deg);
    }
    80% {
        transform: rotate(4deg);
    }
}

.icon-shake {
    animation: shake 0.5s ease-in-out;
}
</style>
