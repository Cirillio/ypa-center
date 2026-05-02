<template>
    <div class="flex w-full flex-col justify-center">
        <picture
            class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg opacity-90"
        >
            <AppPhoto
                src="/core/my-status-placeholder.png"
                class="size-full translate-x-18 translate-y-4 scale-140 rotate-15 object-cover"
                alt="Личный кабинет"
                :quality="100"
            />
            <div
                class="absolute top-0 left-0 z-10 size-full bg-linear-to-t from-black/90 via-black/15 to-transparent"
            ></div>
            <div class="absolute bottom-4 left-6 z-20">
                <h2 class="text-4xl font-bold text-white text-shadow-md">
                    Вся информация в одном месте
                </h2>
                <p class="max-w-md text-2xl leading-tight text-white/85 text-shadow-xs">
                    Авторизуйтесь, чтобы просмотреть свои активные записи, абонементы и баланс
                    занятий.
                </p>
            </div>
        </picture>
    </div>
</template>
