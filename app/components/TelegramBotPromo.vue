<template>
    <div
        class="ring-info bg-info/5 relative mt-4 flex flex-col gap-0.5 overflow-hidden rounded-md p-4 ring-2"
    >
        <UIcon
            name="ph:telegram-logo-duotone"
            class="text-info absolute -right-8 -bottom-8 size-28 opacity-10 xl:size-32"
        />
        <span class="text-info text-lg font-bold md:text-xl xl:text-2xl">Личный кабинет</span>
        <span class="text-info/80 text-sm font-semibold md:text-base">
            Просмотреть свои записи и баланс вы можете в нашем
            <strong>телеграм-боте</strong>.
            <br />
            Укажите свой телеграм в анкете, и наш бот сам с вами свяжется.
            <br />
            Либо можете перейти в него по ссылке:
        </span>
        <a
            target="_blank"
            rel="noopener noreferrer"
            class="group text-default/90 hover:text-default mt-1.5 flex w-fit items-center gap-0.5 text-sm font-bold transition hover:underline md:text-lg"
            :href="telegramHref"
            >Telegram
            <UIcon
                name="ph:arrow-right-bold"
                class="size-5 transition group-hover:translate-x-0.5"
            />
        </a>
    </div>
</template>

<script lang="ts" setup>
const { contactInfo } = useAppConfig()
const telegramHref = contactInfo.socials.find((i) => i.label === "Telegram")?.href
</script>

<style></style>
