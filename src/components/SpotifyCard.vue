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
            <p><strong>{{ t('album') }}:</strong> {{ song.album.name }}</p>
            <p><strong>{{ t('duration') }}:</strong> {{ formattedDuration }}</p>
            <p><strong>{{ t('popularity') }}:</strong> {{ song.popularity }}/100</p>
            <div class="flex-align-center">
                <ion-button fill="outline" shape="round" v-if="!song.isDownloaded" @click="openSongModal(song)"
                    color="primary">
                    <ion-icon :icon="download" slot="icon-only" />
                </ion-button>
                <ion-badge v-else color="danger">{{ t('downloaded') }}</ion-badge>
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script lang="ts" setup>
import { SpotifyTrack } from '@/types/SpotifySearch';
import { IonCard, IonCardContent, IonBadge, modalController, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonButton, IonIcon } from '@ionic/vue';
import { computed } from 'vue';
import SongModal from '@/components/SongModal.vue';
import { download } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

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
