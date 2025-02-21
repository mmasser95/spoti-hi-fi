<template>
        <Modal :title="album.name">
            <ion-card>
                <ion-img :src="album.coverImage" alt="Album Cover" />
                <ion-card-header>
                    <ion-card-title>{{ album.name }}</ion-card-title>
                    <ion-card-subtitle>
                        {{ artistsNames }}
                    </ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <p>{{ album.description }}</p>
                </ion-card-content>
            </ion-card>
            <!-- Lista de canciones -->
            <ion-list>
                <ion-item v-for="song in album.songs" :key="song.id">
                    <ion-label>
                        <h2>{{ song.title }}</h2>
                    </ion-label>
                    <ion-badge v-if="isInPlaylist(song)" color="success">En playlist</ion-badge>
                    <ion-button fill="clear" @click="addIt(song)">
                        <ion-icon :icon="addCircleOutline" />
                    </ion-button>
                </ion-item>
            </ion-list>
        </Modal>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, IonList, IonItem, IonLabel, IonButton, IonBadge, modalController, IonIcon} from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
import { AlbumResult } from '@/types/SearchResults';
import { usePlaylist } from '@/store/usePlaylist';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/store/useAuth';
import Modal from '@/layout/modal.vue';

const { addToPlaylist } = usePlaylist()
const { url } = storeToRefs(useAuth())
// Props
const props = defineProps<{ album: AlbumResult }>();

const artistsNames = computed(() => props.album.artists.map(a => a.name).join(", "))

// Store de la playlist
const { playlist } = storeToRefs(usePlaylist());

// Función para verificar si la canción ya está en la playlist
const isInPlaylist = (song: any) => {
    return playlist.value.some(s => s.id === song.id);
};


// Función para añadir canción a la playlist
const addIt = (song: AlbumResult['songs'][0]) => {
    addToPlaylist({
        id: song.id,
        artist: song.artists.map(a => a.name).join(', '),
        url: `${url.value}/${song.filePath.split("/")[1]}`,
        title: song.title,
        artwork: song.album.coverImage
    })
};
</script>

<style scoped>
ion-card {
    margin-bottom: 20px;
}

ion-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
</style>
