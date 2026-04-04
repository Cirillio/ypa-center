<script lang="ts" setup></script>

<template>
    <section id="map" name="center-map" class="relative z-10 flex w-full flex-col bg-white">
        <UContainer class="py-12 sm:py-20 md:py-24">
            <SectionLeading subtitle="Мы на карте" center> </SectionLeading>

            <div
                class="hover:ring-primary overflow-hidden rounded-md ring-2 ring-transparent transition"
            >
                <div class="relative h-150 w-full">
                    <div class="h-full w-full" style="position: relative; overflow: hidden">
                        <a
                            href="https://yandex.ru/maps/org/ulitsa_radosti/58873423499/?utm_medium=mapframe&utm_source=maps"
                            style="color: #eee; font-size: 12px; position: absolute; top: 0px"
                            >Улица Радости</a
                        ><a
                            href="https://yandex.ru/maps/65/novosibirsk/category/further_education/184106162/?utm_medium=mapframe&utm_source=maps"
                            style="color: #eee; font-size: 12px; position: absolute; top: 14px"
                            >Дополнительное образование в Новосибирске</a
                        ><a
                            href="https://yandex.ru/maps/65/novosibirsk/category/club_for_children_and_teenagers/184107202/?utm_medium=mapframe&utm_source=maps"
                            style="color: #eee; font-size: 12px; position: absolute; top: 28px"
                            >Клуб для детей и подростков в Новосибирске</a
                        ><iframe
                            src="https://yandex.ru/map-widget/v1/?from=mapframe&indoorLevel=1&ll=83.095882%2C54.841172&mode=search&oid=58873423499&ol=biz&source=mapframe&utm_source=share&z=17.4"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            allowfullscreen
                            class="block w-full"
                            style="position: relative"
                        ></iframe>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>
