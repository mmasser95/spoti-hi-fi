<template>
    <ion-content>
        <ion-grid>
            <!-- Input de búsqueda -->
            <ion-row class="ion-justify-content-center">
                <ion-col size="12" size-md="6">
                    <ion-input v-model="query" placeholder="Buscar canción"></ion-input>
                </ion-col>
            </ion-row>

            <!-- Resultados -->
            <ion-row class="ion-justify-content-center">
                <ion-col v-for="item in results" :key="item.id" size="12" size-sm="6" size-md="4" size-lg="3">
                    <SpotifyCard :song="item" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
</template>
<script lang="ts" setup>
import { External } from '@/APIService/external';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonInput } from '@ionic/vue';
import debounce from 'lodash/debounce';
import { ref, watch } from 'vue';
import SpotifyCard from '@/components/SpotifyCard.vue';
import { SpotifyTrack } from '@/types/SpotifySearch';

const query = ref("")
const search = debounce(async (v: string) => {
    if (!!v && v !== "") {
        let res = await External.searchSpotify(v)
        results.value = res.tracks.items
    }
}, 1000)

const results = ref<SpotifyTrack[]>()

watch(query, (v) => {
    search(v)
})
</script>
<style scoped></style>