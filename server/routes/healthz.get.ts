// Liveness для Docker: отвечает, пока жив Nitro, и не ходит в бэкенд — его падение не должно рестартить фронт.
export default defineEventHandler(() => ({ status: "ok" }))
