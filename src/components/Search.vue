<template>
    <ion-content>
        <ion-grid>
            <!-- Input de búsqueda con selector -->
            <ion-row class="ion-justify-content-center ion-align-items-center">
                <ion-col size="12" size-md="4">
                    <ion-input v-model="query" placeholder="Buscar canción"></ion-input>
                </ion-col>
                <!-- <ion-col size="auto">
                    <ion-segment v-model="searchSource">
                        <ion-segment-button value="spotify">Spotify</ion-segment-button>
                        <ion-segment-button value="youtube">YouTube</ion-segment-button>
                    </ion-segment>
                </ion-col> -->
            </ion-row>

            <!-- Resultados -->
            <ion-row class="ion-justify-content-center">
                <ion-col v-if="searchSource === 'spotify'" v-for="item in resultsSpotify" :key="item.id" size="6"
                    size-sm="4" size-md="3" size-lg="2">
                    <SpotifyCard :song="item" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
</template>

<script lang="ts" setup>
import { External } from '@/APIService/external';
import { IonContent, IonGrid, IonRow, IonCol, IonInput } from '@ionic/vue';
import debounce from 'lodash/debounce';
import { ref, watch } from 'vue';
import SpotifyCard from '@/components/SpotifyCard.vue';
import { SpotifyTrack } from '@/types/SpotifySearch';
import { YoutubeTrack } from '@/types/YoutubeSearch';

const query = ref("");
const searchSource = ref<"spotify" | "youtube">("spotify"); // Controla la fuente de búsqueda
const resultsSpotify = ref<(SpotifyTrack)[]>([]);
const resultsYoutube = ref<(YoutubeTrack)[]>([]);

const searchWithoutDebounce = async (v: string) => {
    if (!v) return;
    let res;
    if (searchSource.value === "spotify") {
        res = await External.searchSpotify(v);
        resultsSpotify.value = res.items;
    } else {
        res = await External.searchYoutube(v);
        resultsYoutube.value = res;
    }
}
const search = debounce(searchWithoutDebounce, 600);
watch(query, () => {
    search(query.value);
});
watch(searchSource, () => {
    searchWithoutDebounce(query.value)
})



</script>

<style scoped>
ion-segment {
    max-width: 200px;
}
</style>
