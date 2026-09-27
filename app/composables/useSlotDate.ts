import { useDayjs } from "#dayjs"

// Слоты заданы в часовом поясе центра; без явного пояса SSR (UTC) и клиент считали разные даты.
const CENTER_TIMEZONE = "Asia/Novosibirsk"

export const useFormatDate = () => {
    const dayjs = useDayjs()

    // ПОЧЕМУ явно tz: defaultTimezone модуля не применяется к dayjs() на сервере.
    // Локаль не задаём: подписи дат строит formatEventDate через Intl, dayjs-ru на сервере не грузится.
    const centerNow = () => dayjs().tz(CENTER_TIMEZONE)

    const getClosestDate = (dayOfWeek: number, startTime: string) => {
        const now = centerNow()
        const [hours, minutes] = startTime.split(":").map(Number)

        // dayjs: 0 = Вс, 1 = Пн, ..., 6 = Сб
        let target = centerNow()
            .day(dayOfWeek === 7 ? 0 : dayOfWeek)
            .hour(hours!)
            .minute(minutes!)
            .second(0)
            .millisecond(0)

        if (target.isBefore(now)) {
            target = target.add(1, "week")
        }

        return target
    }

    return { getClosestDate }
}
