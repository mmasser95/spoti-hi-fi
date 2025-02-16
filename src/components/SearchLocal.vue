<template>
    <ion-content>
        <ion-grid>
            <!-- Input de búsqueda con selector -->
            <ion-row class="ion-justify-content-center ion-align-items-center">
                <ion-col size="12" size-md="4">
                    <ion-input v-model="query" :placeholder="searchPlaceHolder"></ion-input>
                </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-center ion-align-items-center">
                <ion-col size="12" size-md="4">
                    <ion-segment value="song" v-model="searchType">
                        <ion-segment-button value="song" content-id="song">
                            <ion-label>Song</ion-label>
                        </ion-segment-button>
                        <ion-segment-button value="artist" content-id="artist">
                            <ion-label>Artist</ion-label>
                        </ion-segment-button>
                        <ion-segment-button value="album" content-id="album">
                            <ion-label>Album</ion-label>
                        </ion-segment-button>
                    </ion-segment>
                </ion-col>
            </ion-row>
            <!-- Resultados -->
            <ion-segment-view>
                <ion-segment-content id="song">
                    <ion-row class="ion-justify-content-center">
                        <ion-col v-for="item in resultsSongs" :key="item.id" size="6" size-sm="4" size-md="3"
                            size-lg="2">
                            <LocalCard :song="item" />
                        </ion-col>
                    </ion-row>
                </ion-segment-content>
                <ion-segment-content id="artist">
                    <ion-row class="ion-justify-content-center">
                        <ion-col v-for="item in resultsArtists" :key="item.id" size="6" size-sm="4" size-md="3"
                            size-lg="2">

                        </ion-col>
                    </ion-row>
                </ion-segment-content>
                <ion-segment-content id="album">
                    <ion-row class="ion-justify-content-center">
                        <ion-col v-for="item in resultsAlbums" :key="item.id" size="6" size-sm="4" size-md="3"
                            size-lg="2"></ion-col>
                    </ion-row>
                </ion-segment-content>
            </ion-segment-view>
        </ion-grid>
    </ion-content>
</template>

<script lang="ts" setup>
import { External } from '@/APIService/external';
import { IonContent, IonGrid, IonRow, IonCol, IonInput, IonSegment, IonSegmentButton, IonLabel, IonSegmentContent, IonSegmentView } from '@ionic/vue';
import debounce from 'lodash/debounce';
import { computed, onMounted, ref, watch } from 'vue';
import LocalCard from '@/components/LocalCard.vue';
import { LocalAlbum, LocalArtist, LocalSong } from '@/types/LocalElements';


const query = ref("");
const resultsSongs = ref<LocalSong[]>()
const resultsArtists = ref<LocalArtist[]>()
const resultsAlbums = ref<LocalAlbum[]>()
const searchPlaceHolder = computed(() =>
    searchType.value == 'song'
        ? "Buscar canción"
        : searchType.value == 'artist'
            ? "Buscar artista"
            : "Buscar album")
const searchType = ref<"artist" | "album" | "song">("song")


const searchWithoutDebounce = async (v: string) => {
    if (!v) return;
    resultsSongs.value = await External.getLocalSongs()
}
const search = debounce(searchWithoutDebounce, 600);

watch(query, () => {
    search(query.value);
});

watch(searchType, () => query.value = "")

onMounted(() => searchWithoutDebounce("s"))
</script>

<style scoped></style>
