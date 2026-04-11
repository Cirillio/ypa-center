<script lang="ts" setup>
const { contactInfo, seo, stats, pricing } = useAppConfig()

useSeoMeta({
    title: `${seo.siteName} — Центр умного развития детей в Новосибирске`,
    description:
        "Кружки, продлёнка и каникулярные программы для детей школьного возраста. Настольные игры, рисование, пианино и многое другое. Запишитесь онлайн.",
    ogTitle: `${seo.siteName} — Центр умного развития`,
    ogDescription: `Место, где дети учатся думать, творить и верить в себя. ${contactInfo.address}.`,
    ogType: "website",
    ogImage: seo.ogImage
})

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                name: seo.siteName,
                description: `Центр умного развития детей в Новосибирске. Место, где дети учатся думать, творить и верить в себя. Работаем более ${stats.workingYearsText}.`,
                url: seo.siteUrl,
                telephone: contactInfo.phoneTo,
                email: contactInfo.email,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: contactInfo.address,
                    addressLocality: "Новосибирск",
                    addressCountry: "RU"
                },
                geo: {
                    "@type": "GeoCoordinates",
                    latitude: seo.geo.lat,
                    longitude: seo.geo.lng
                },
                openingHours: "Mo-Fr 08:00-20:00",
                sameAs: contactInfo.socials.map((s) => s.href),
                // Добавляем оффер на пробное занятие
                makesOffer: {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Пробное занятие",
                        description: "Знакомство с педагогами и направлениями центра."
                    },
                    price: pricing.trialLesson,
                    priceCurrency: pricing.currency,
                    availability: "https://schema.org/InStock"
                },
                // Ключевые слова
                keywords: `детский центр, кружки для детей, продленка, Новосибирск, ${stats.studentsCount} счастливых детей`
            })
        }
    ]
})
</script>

<template>
    <div class="flex w-full min-w-0 flex-col">
        <HomeHeroSection />
        <HomeHowItWorksSection />
        <HomeAboutSection />
        <HomeTopClubsSection />
        <HomeEventsSection />
        <HomeGallerySection />
        <HomeSubscriptionsSection />
        <FaqSection />
    </div>
</template>
