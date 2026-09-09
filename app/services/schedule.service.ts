import type { ApiFetch } from "~/composables/useApi"
import type { WeekGridResponse, WeekScheduleSlot, WeeklySlot } from "~/types"

/**
 * Маппинг сырого слота расписания с бэка в UI-модель WeeklySlot.
 *
 * WHY день недели конвертируется: бэк отдаёт ISO-нумерацию (Пн=0…Вс=6),
 * а приложение (useSchedule, моки enroll-флоу) живёт в JS-конвенции (Вс=0…Сб=6).
 * (d + 1) % 7 переводит одну в другую: Пн 0→1, …, Вс 6→0.
 *
 * Диапазон 0..6 гарантирован CHECK-констрейнтом schedule_day_of_week_in_range на бэке.
 */
function toWeeklySlot(slot: WeekScheduleSlot): WeeklySlot {
    return {
        id: slot.schedule_id,
        activity: { id: slot.activity.id, name: slot.activity.name },
        dayOfWeek: ((slot.day_of_week + 1) % 7) as WeeklySlot["dayOfWeek"],
        startTime: slot.start_time,
        endTime: slot.end_time,
        groupName: slot.group_name,
        maxCapacity: slot.capacity.max,
        available: slot.capacity.free
    }
}

/**
 * Недельная сетка расписания.
 * Эндпоинт: GET /api/v1/public/schedule/
 */
export class ScheduleService {
    constructor(private readonly fetch: ApiFetch) {}

    /**
     * @param weekStart понедельник запрашиваемой недели (YYYY-MM-DD); по умолчанию — текущая
     * @returns слоты недели без отменённых, в UI-модели
     */
    async getWeek(weekStart?: string): Promise<WeeklySlot[]> {
        const res = await this.fetch<WeekGridResponse>("/v1/public/schedule/", {
            query: weekStart ? { week_start: weekStart } : undefined
        })
        return res.slots.filter((slot) => !slot.is_cancelled).map(toWeeklySlot)
    }
}

export const useScheduleService = () => new ScheduleService(useApi().apiFetch)
