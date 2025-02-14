<template>
    <ion-card>
        <ion-img :src="song.album.images[0]?.url" alt="Album cover" />

        <ion-card-header>
            <ion-card-title>
                {{ song.name }}
            </ion-card-title>
            <ion-card-subtitle>
                {{ artistsNames }}
            </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
            <p><strong>Álbum:</strong> {{ song.album.name }}</p>
            <p><strong>Duración:</strong> {{ formattedDuration }}</p>
            <p><strong>Popularidad:</strong> {{ song.popularity }}/100</p>
            <ion-button v-if="!song.isDownloaded" @click="openSongModal(song)" fill="outline" color="primary">
                Descargar
            </ion-button>
            <ion-badge v-else color="danger">Descargado</ion-badge>
        </ion-card-content>
    </ion-card>
</template>

<script lang="ts" setup>
import { SpotifyTrack } from '@/types/SpotifySearch';
import { IonCard, IonCardContent,IonBadge, modalController, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonButton } from '@ionic/vue';
import { computed } from 'vue';
import SongModal from '@/components/SongModal.vue';

const props = defineProps<{ song: SpotifyTrack }>();

const artistsNames = computed(() =>
    props.song.artists.map(artist => artist.name).join(", ")
);

const formattedDuration = computed(() => {
    const minutes = Math.floor(props.song.duration_ms / 60000);
    const seconds = ((props.song.duration_ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
});

const openSongModal = async (song: SpotifyTrack) => {
    const modal = await modalController.create({
        component: SongModal,
        componentProps: {
            song: song
        }
    });

    await modal.present();
};
</script>

<style scoped>
ion-img {
    width: 100%;
    height: auto;
    border-radius: 8px 8px 0 0;
}

ion-card-content p {
    margin: 5px 0;
}
</style>
