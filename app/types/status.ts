export type StatusParent = {
    readonly name: string
    readonly phone: string
    readonly email: string
}

export type StatusChild = {
    readonly name: string
    readonly birthdate: string
}

export type StatusSubscriptionClub = {
    readonly name: string
    readonly subgroup: {
        readonly name: string
        readonly capacity: number
    }
    readonly weeklySlot: {
        readonly dayOfWeek: string
        readonly startTime: string
        readonly endTime: string
    }
    readonly left: number
    readonly maxUses: number
}

export type StatusSubscription = {
    readonly id: string
    readonly createdAt: string
    readonly isExpired: boolean
    readonly sum: string
    readonly participant: {
        readonly name: string
    }
    readonly clubs: readonly StatusSubscriptionClub[]
}

export type StatusTrial = {
    readonly id: string
    readonly createdAt: string
    readonly sum: string
    readonly participant: {
        readonly name: string
    }
    readonly club: {
        readonly name: string
        readonly subgroup: {
            readonly name: string
            readonly capacity: number
        }
    }
    readonly dateTime: {
        readonly date: string
        readonly startTime: string
        readonly endTime: string
    }
}

export type StatusEvent = {
    readonly id: string
    readonly createdAt: string
    readonly sum: string
    readonly participant: {
        readonly name: string
    }
    readonly event: {
        readonly name: string
        readonly capacity: number
    }
    readonly dateTime: {
        readonly date: string
        readonly startTime: string
        readonly endTime: string
    }
}

export type StatusData = {
    readonly parent: StatusParent
    readonly children: readonly StatusChild[]
    readonly subscriptions: readonly StatusSubscription[]
    readonly trials: readonly StatusTrial[]
    readonly events: readonly StatusEvent[]
}
