<script lang="ts" setup>
const {
    handleOtp,
    resendCode,
    secondsLeft,
    canResend,
    isLoading,
    error,
    resetFlow,
    step,
    email,
    code
} = useMailConfirm()

const handleOtpFlow = async () => {
    if (step.value === "email" || step.value === "code") await handleOtp()
    else if (step.value === "accepted") resetFlow()
}

const resend = async () => {
    resetFlow()
    await resendCode()
}

const MOCK_DATA = {
    parent: {
        name: "Иванова Ольга Евгеньевна",
        phone: "+7 (999) 999-99-99",
        email: "olga.e@example.com"
    },
    children: [
        {
            name: "Иванов Иван",
            birthdate: "12.03.2015"
        },
        {
            name: "Иванова Марья",
            birthdate: "11.06.2017"
        }
    ],
    subscriptions: [
        {
            id: "FSA32-7JH3",
            createdAt: "2024-05-20T14:30:00Z",
            isExpired: false,
            sum: "12.000",
            participant: {
                name: "Иванов Иван"
            },
            clubs: [
                {
                    name: "Кружок мышления",
                    subgroup: {
                        name: "Общая",
                        capacity: 6
                    },
                    weeklySlot: {
                        dayOfWeek: "Пн",
                        startTime: "16:00",
                        endTime: "17:00"
                    },
                    left: 2,
                    maxUses: 4
                },
                {
                    name: "Английский язык",
                    subgroup: {
                        name: "Начинающие",
                        capacity: 8
                    },
                    weeklySlot: {
                        dayOfWeek: "Ср",
                        startTime: "17:30",
                        endTime: "18:30"
                    },
                    left: 0,
                    maxUses: 4
                },
                {
                    name: "Шахматы",
                    subgroup: {
                        name: "Продвинутые",
                        capacity: 10
                    },
                    weeklySlot: {
                        dayOfWeek: "Пт",
                        startTime: "15:00",
                        endTime: "16:00"
                    },
                    left: 4,
                    maxUses: 4
                }
            ]
        },
        {
            id: "KLS99-2XP1",
            createdAt: "2024-06-01T10:00:00Z",
            isExpired: false,
            sum: "8.500",
            participant: {
                name: "Иванова Марья"
            },
            clubs: [
                {
                    name: "Рисование",
                    subgroup: {
                        name: "Младшая",
                        capacity: 12
                    },
                    weeklySlot: {
                        dayOfWeek: "Вт",
                        startTime: "15:00",
                        endTime: "16:00"
                    },
                    left: 3,
                    maxUses: 4
                },
                {
                    name: "Танцы",
                    subgroup: {
                        name: "Ритмика",
                        capacity: 15
                    },
                    weeklySlot: {
                        dayOfWeek: "Чт",
                        startTime: "16:30",
                        endTime: "17:30"
                    },
                    left: 4,
                    maxUses: 4
                }
            ]
        },
        {
            id: "EXP00-9ZZ9",
            createdAt: "2023-12-15T09:00:00Z",
            isExpired: true,
            sum: "5.000",
            participant: {
                name: "Иванов Иван"
            },
            clubs: [
                {
                    name: "Робототехника",
                    subgroup: {
                        name: "Базовая",
                        capacity: 10
                    },
                    weeklySlot: {
                        dayOfWeek: "Сб",
                        startTime: "10:00",
                        endTime: "11:30"
                    },
                    left: 0,
                    maxUses: 8
                }
            ]
        }
    ],
    trials: [
        {
            id: "AR90-5HP1",
            participant: {
                name: "Иванов Иван"
            },
            sum: "1200",
            createdAt: "2026-05-10T14:30:00Z",
            club: {
                name: "Английский язык",
                subgroup: {
                    name: "Начинающие",
                    capacity: 8
                }
            },
            dateTime: {
                date: "2026-05-15",
                startTime: "17:30",
                endTime: "18:30"
            }
        }
    ],
    events: [
        {
            id: "UH65-GP10",
            participant: {
                name: "Иванова Ольга"
            },
            sum: "1200",
            createdAt: "2026-05-11T15:33:11Z",
            event: {
                name: "Настольные игры",
                capacity: 9
            },
            dateTime: {
                date: "2026-05-21",
                startTime: "19:00",
                endTime: "22:00"
            }
        }
    ]
}

export type MOCK_SUBSCIBITION_TYPE = {
    id: string
    createdAt: string
    isExpired: boolean
    sum: string
    participant: {
        name: string
    }
    clubs: {
        name: string
        subgroup: {
            name: string
            capacity: number
        }
        weeklySlot: {
            dayOfWeek: string
            startTime: string
            endTime: string
        }
        left: number
        maxUses: number
    }[]
}

export type MOCK_TRIAL_TYPE = {
    id: string
    createdAt: string
    sum: string
    participant: {
        name: string
    }
    club: {
        name: string
        subgroup: {
            name: string
            capacity: number
        }
    }
    dateTime: {
        date: string
        startTime: string
        endTime: string
    }
}

export type MOCK_EVENT_TYPE = {
    id: string
    createdAt: string
    sum: string
    participant: {
        name: string
    }
    event: {
        name: string
        capacity: number
    }
    dateTime: {
        date: string
        startTime: string
        endTime: string
    }
}

const modalOpen = ref<boolean>(false)
const isLeaveConfirmed = ref<boolean>(false)
const resolveLeave = ref<((v: boolean) => void) | null>(null)

onBeforeRouteLeave(async () => {
    if (isLeaveConfirmed.value || !email.value || step.value === "email") return true

    modalOpen.value = true

    const confirmed = await new Promise<boolean>((resolve) => {
        resolveLeave.value = resolve
    })

    if (confirmed) {
        isLeaveConfirmed.value = true
        return true
    }

    return false
})

onBeforeUnmount(() => {
    resetFlow()
})

const handleStay = () => {
    modalOpen.value = false
    resolveLeave.value?.(false)
}

const handleLeave = () => {
    modalOpen.value = false
    resolveLeave.value?.(true)
}

const sortedSubscriptions = computed(() => {
    return [...MOCK_DATA.subscriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})

const sortedRecords = computed(() => {
    const trials = MOCK_DATA.trials.map((t) => ({ ...t, type: "trial" as const }))
    const events = MOCK_DATA.events.map((e) => ({ ...e, type: "event" as const }))
    return [...trials, ...events].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh">
        <UModal
            v-model:open="modalOpen"
            :ui="{
                overlay: 'bg-black/25 backdrop-blur-xs',
                content: 'ring-0 shadow-none'
            }"
        >
            <template #content>
                <div class="p-6">
                    <p class="mb-6 text-xl font-medium text-gray-900">
                        Вы уверены, что хотите выйти?
                    </p>
                    <div class="flex justify-end gap-3">
                        <UButton size="lg" variant="ghost" @click="handleStay"> Остаться </UButton>
                        <UButton color="error" size="lg" @click="handleLeave"> Уйти </UButton>
                    </div>
                </div>
            </template>
        </UModal>
        <MyStatusSection>
            <MyStatusCodeConfirmation
                v-model:email="email"
                v-model:code="code"
                :current-step="step"
                :is-loading="isLoading"
                :error="error || ''"
                :seconds-left="secondsLeft"
                :can-resend="canResend"
                :on-handle-otp="handleOtpFlow"
                :on-resend-code="resend"
                :on-reset="resetFlow"
            />
        </MyStatusSection>
        <main class="pb-16">
            <UContainer class="grid w-full grid-cols-11 gap-4">
                <section class="col-span-7 flex flex-col space-y-4 rounded-lg bg-white p-6">
                    <!-- PARENT CARD -->
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2.5"
                        >
                            <UIcon name="ph:user-bold" class="size-6" />
                        </div>
                        <div class="grid w-full grid-cols-2 grid-rows-2">
                            <span class="text-default/75 text-sm leading-tight">Родитель</span>
                            <span
                                class="col-start-1 row-start-2 truncate text-lg leading-tight font-semibold"
                                >{{ MOCK_DATA.parent.name }}</span
                            >
                            <span class="truncate text-lg leading-tight font-semibold">{{
                                MOCK_DATA.parent.phone
                            }}</span>
                            <span class="truncate text-lg leading-tight font-semibold">{{
                                MOCK_DATA.parent.email
                            }}</span>
                        </div>
                    </div>

                    <!-- CHILDREN CARDS -->
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-4">
                            <div
                                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2.5"
                            >
                                <UIcon name="ph:baby-bold" class="size-6" />
                            </div>
                            <span class="text-default text-xl leading-tight font-semibold"
                                >Дети</span
                            >
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div
                                v-for="(participant, i) in MOCK_DATA.children"
                                :key="i"
                                class="bg-secondary/5 flex flex-col rounded-lg px-6 py-4"
                            >
                                <span class="text-secondary text-lg leading-tight font-semibold">{{
                                    participant.name
                                }}</span>
                                <span class="text-default/75 text-sm">{{
                                    participant.birthdate
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- SUBSCRIPTIONS and ENROLLS CARDS-->
                    <div class="mt-4 grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-4">
                            <h2 class="text-primary ml-4 text-xl font-bold">Наши абонементы</h2>
                            <MyStatusSubscribitionCard
                                v-for="sub in sortedSubscriptions"
                                :key="sub.id"
                                v-bind="sub"
                            />
                        </div>
                        <div class="flex flex-col gap-4">
                            <h2 class="text-primary ml-4 text-xl font-bold">Наши записи</h2>
                            <template v-for="record in sortedRecords" :key="record.id">
                                <MyStatusTrialCard v-if="record.type === 'trial'" v-bind="record" />
                                <MyStatusEventCard
                                    v-else-if="record.type === 'event'"
                                    v-bind="record"
                                />
                            </template>
                        </div>
                    </div>
                </section>
                <section class="col-span-4 flex flex-col rounded-lg bg-white p-6"></section>
            </UContainer>
        </main>
    </div>
</template>
