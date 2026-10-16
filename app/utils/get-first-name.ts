// Имя из ФИО для обращения: анкета просит «Фамилия Имя Отчество», одно слово – это и есть имя.
export function getFirstName(fullName: string | null | undefined): string {
    const words = (fullName ?? "").trim().split(/\s+/).filter(Boolean)
    return words[words.length === 1 ? 0 : 1] ?? ""
}
