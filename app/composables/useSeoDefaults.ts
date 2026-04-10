export const useSeoDefaults = () => {
    const { siteUrl } = useAppConfig().seo

    useSeoMeta({
        ogImage: `${siteUrl}/og/default.jpg`,
        twitterCard: "summary_large_image",
        twitterImage: `${siteUrl}/og/default.jpg`
    })
}
