<script lang="ts" setup>
export type PaymentStatus = "succeeded" | "canceled" | "pending" | "invalid_pid"

defineProps<{
    status: PaymentStatus
    reason?: string
    enrollPath?: string
}>()

defineEmits<{ retry: [] }>()
</script>

<template>
    <PaymentSucceeded v-if="status === 'succeeded'" />
    <PaymentCanceled v-else-if="status === 'canceled'" :reason="reason" @retry="$emit('retry')" />
    <PaymentPending v-else-if="status === 'pending'" />
    <PaymentInvalidPid v-else-if="status === 'invalid_pid'" :enroll-path="enrollPath" />
</template>
