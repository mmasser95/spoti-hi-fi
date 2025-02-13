<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>{{ song.name }}</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="dismiss">Cerrar</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <ion-item>
            <ion-label>Artista</ion-label>
            <ion-text>{{ artistsNames }}</ion-text>
        </ion-item>
        <ion-item>
            <ion-label>Álbum</ion-label>
            <ion-text>{{ song.album.name }}</ion-text>
        </ion-item>
        <ion-item>
            <ion-label>Duración</ion-label>
            <ion-text>{{ formattedDuration }}</ion-text>
        </ion-item>
        <ion-item>
            <ion-label>Imagen</ion-label>
            <img class="thumbnail" :src="song.album.images[0]?.url" alt="Thumbnail" />
        </ion-item>
        <!-- Mostrar los resultados de YouTube -->
        <ion-list>
            <ion-item v-for="(result, index) in youtubeResults" :key="index">
                <YoutubeCard :video="result"></YoutubeCard>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script lang="ts" setup>
import { External } from '@/APIService/external';
import { SpotifyTrack } from '@/types/SpotifySearch';
import { YoutubeTrack } from '@/types/YoutubeSearch';
import { IonHeader,IonList,IonContent, modalController, IonToolbar, IonTitle, IonButtons, IonButton, IonItem, IonLabel, IonText } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
import YoutubeCard from './YoutubeCard.vue';
const props = defineProps<{ song: SpotifyTrack }>()
const artistsNames = computed(() =>
    props.song.artists.map(artist => artist.name).join(", ")
);
const youtubeResults = ref<YoutubeTrack[]>()
const formattedDuration = computed(() => {
    const minutes = Math.floor(props.song.duration_ms / 60000);
    const seconds = ((props.song.duration_ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
});
const dismiss = () => {
    modalController.dismiss(null, 'cancel')
}
onMounted(async () => {
    const query = `${props.song.artists.map(artist => artist.name).join(", ")} ${props.song.name}`;
    try {
        // Llamamos a la API de AdonisJS para obtener los primeros 5 resultados de YouTube
        const results = await External.searchYoutube(query);
        youtubeResults.value = results.slice(0, 5);  // Tomamos los primeros 5 resultados
    } catch (error) {
        console.error("Error al buscar en YouTube:", error);
    }
});
</script>

<style scoped>
.thumbnail {
    max-width: 200px;
}
</style>