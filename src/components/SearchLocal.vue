<template>
    <ion-content>
        <ion-refresher v-if="!serverError" slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-refresher v-else slot="fixed" @ionRefresh="handleRefresh2($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-grid>
            <!-- Input de búsqueda con selector -->
            <ion-row class="ion-justify-content-center ion-align-items-center">
                <ion-col size="12" size-md="4">
                    <ion-input v-model="query" :placeholder="searchPlaceHolder"></ion-input>
                    <ion-toggle v-model="serverError" :enable-on-off-labels="true">Local</ion-toggle>
                </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-center ion-align-items-center" v-if="!serverError">
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
            <ion-segment-view v-if="!serverError">
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
                            <ArtistCard :artist="item" />
                        </ion-col>
                    </ion-row>
                </ion-segment-content>
                <ion-segment-content id="album">
                    <ion-row class="ion-justify-content-center">
                        <ion-col v-for="item in resultsAlbums" :key="item.id" size="6" size-sm="4" size-md="3"
                            size-lg="2">
                            <AlbumCard :album="item" />
                        </ion-col>
                    </ion-row>
                </ion-segment-content>
            </ion-segment-view>
            <ion-row class="ion-justify-content-center" v-if="!!serverError">
                <ion-col v-for="item in localSongs" :key="item.url" size="6" size-sm="4" size-md="3" size-lg="2">
                    <DeviceSongCard :song="item" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
</template>

<script lang="ts" setup>
import { External } from '@/APIService/external';
import { IonContent, IonGrid, IonRow, IonCol, IonInput, IonSegment, IonSegmentButton, IonLabel, IonSegmentContent, IonSegmentView, RefresherCustomEvent, IonRefresher, IonRefresherContent, IonToggle } from '@ionic/vue';
import debounce from 'lodash/debounce';
import { computed, onMounted, ref, watch } from 'vue';
import LocalCard from '@/components/LocalCard.vue';
import { LocalSong } from '@/types/LocalElements';
import ArtistCard from '@/components/ArtistCard.vue';
import { AlbumResult, ArtistResult } from '@/types/SearchResults';
import AlbumCard from '@/components/AlbumCard.vue';
import { getElements } from '@/composables/useLocalSystem';
import { Song } from '@/types/Song';
import DeviceSongCard from '@/components/DeviceSongCard.vue';


const query = ref("");
const resultsSongs = ref<LocalSong[]>()
const localSongs = ref<Song[]>()
const resultsArtists = ref<ArtistResult[]>()
const resultsAlbums = ref<AlbumResult[]>()
const serverError = ref<boolean>(false)
const searchPlaceHolder = computed(() =>
    searchType.value == 'song'
        ? "Buscar canción"
        : searchType.value == 'artist'
            ? "Buscar artista"
            : "Buscar album")
const searchType = ref<"artist" | "album" | "song">("song")


const searchWithoutDebounce = async (v: string) => {
    if (searchType.value == 'song')
        resultsSongs.value = await External.searchSongs(v)
    if (searchType.value == 'artist')
        resultsArtists.value = await External.searchArtists(v)
    if (searchType.value == 'album')
        resultsAlbums.value = await External.searchAlbums(v)
}


const search = debounce(searchWithoutDebounce, 600);

watch(query, () => {
    search(query.value);
});

watch(searchType, () => query.value = "")

onMounted(async () => {
    try {
        resultsSongs.value = await External.searchSongs("")
        resultsAlbums.value = await External.searchAlbums("")
        resultsArtists.value = await External.searchArtists("")
    } catch (error) {
        console.warn("No se pudo conectar al servidor")
        serverError.value = true
        localSongs.value = await getElements()
    }
})

watch(serverError, async (v) => {
    if (v) {
        if (!localSongs.value)
            localSongs.value = await getElements()
        else
            if (localSongs.value.length < 1)
                localSongs.value = await getElements()
    }
})

const handleRefresh = async (event: RefresherCustomEvent) => {
    await searchWithoutDebounce(query.value)
    event.target.complete()
}
const handleRefresh2 = async (event: RefresherCustomEvent) => {
    localSongs.value=await getElements()
    event.target.complete()
}
</script>

<style scoped></style>
