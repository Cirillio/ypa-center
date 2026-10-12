<template>
    <div class="flex min-h-screen flex-col">
        <LayoutHeader />
        <UMain>
            <slot />
        </UMain>
        <LayoutFooter />
    </div>
</template>
