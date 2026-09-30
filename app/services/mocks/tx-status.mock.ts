// MOCK(tx-status): имитация GET /checkout/transactions/{id} до выкатки ручки на бэке.
// Сценарий – подстрокой в tx: test – успех на третьем опросе, canceled, slow, missing.
// Настоящий UUID из живого чекаута – вечный PENDING: мок не знает исхода и не должен врать об успехе.
import type { TransactionStatusDto } from "~/types"

const NETWORK_DELAY_MS = 600
const PENDING_TICKS_BEFORE_SUCCESS = 2

// Счётчик опросов по каждой транзакции, чтобы сценарии разных tx не мешали друг другу
const pollsByTx = new Map<string, number>()

// Ошибка формы FetchError из ofetch: status/statusCode и RFC 9457 тело в data
class MockFetchError extends Error {
    readonly status = 404
    readonly statusCode = 404
    readonly data = {
        type: "urn:problem-type:notfound",
        title: "Не найдено",
        status: 404,
        detail: "Транзакция не найдена.",
        code: "NOT_FOUND"
    }
}

// Собирает ответ статуса транзакции для текущего шага сценария.
function buildStatus(txId: string, status: TransactionStatusDto["status"]): TransactionStatusDto {
    const createdAt = new Date()
    return {
        id: txId,
        status,
        type: "SUBSCRIPTION",
        amount: 700000,
        canceled_reason: status === "CANCELED" ? "bank_declined" : null,
        created_at: createdAt.toISOString(),
        expires_at: new Date(createdAt.getTime() + 30 * 60_000).toISOString()
    }
}

// Отдаёт статус транзакции по сценарию, зашитому в её id, с задержкой сети.
export async function getMockTransactionStatus(txId: string): Promise<TransactionStatusDto> {
    await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))

    if (txId.includes("missing")) throw new MockFetchError("Not Found")
    if (txId.includes("canceled")) return buildStatus(txId, "CANCELED")
    if (!txId.includes("test")) return buildStatus(txId, "PENDING")

    const polls = (pollsByTx.get(txId) ?? 0) + 1
    pollsByTx.set(txId, polls)
    return buildStatus(txId, polls > PENDING_TICKS_BEFORE_SUCCESS ? "SUCCEEDED" : "PENDING")
}
