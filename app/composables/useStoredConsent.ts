// Дано ли согласие на ПД при регистрации: вошедшему родителю формы не переспрашивают галочку.
export function useStoredConsent() {
    const auth = useAuthStore()
    const me = useMeService()
    // ПОЧЕМУ hydrate в onMounted: на публичных страницах флаг входа приходит из SSR (там токенов нет) и остаётся false
    onMounted(() => auth.hydrate())
    // ПОЧЕМУ свой ключ, а не "me-profile": анониму профиль не запрашиваем вовсе (иначе 401 на каждой странице с формой)
    const { data } = useAsyncData(
        "me-consent",
        () => (auth.isAuthed ? me.getProfile() : Promise.resolve(null)),
        { server: false, watch: [() => auth.isAuthed] }
    )
    return computed<boolean>(() => auth.isAuthed && data.value?.hasConsent === true)
}
