<template>
    <div>error</div>
</template>

<script lang="ts" setup>
throw createError({ statusCode: 500, statusMessage: "Test error", fatal: true })
</script>

<style></style>
