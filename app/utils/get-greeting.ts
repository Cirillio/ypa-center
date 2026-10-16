// ПОЧЕМУ Новосибирск, а не пояс машины: сервер рендерит в UTC, клиент – в своём
// поясе; фиксированный пояс центра даёт одинаковый текст в SSR и после гидратации
const GREETING_TIMEZONE = "Asia/Novosibirsk"

// Приветствие по времени суток в часовом поясе центра («Доброе утро» … «Доброй ночи»).
export function getGreeting(date: Date = new Date()): string {
    const hour = Number(
        new Intl.DateTimeFormat("ru-RU", {
            hour: "numeric",
            hourCycle: "h23",
            timeZone: GREETING_TIMEZONE
        }).format(date)
    )

    if (hour >= 5 && hour < 12) return "Доброе утро"
    if (hour >= 12 && hour < 18) return "Добрый день"
    if (hour >= 18 && hour < 23) return "Добрый вечер"
    return "Доброй ночи"
}
