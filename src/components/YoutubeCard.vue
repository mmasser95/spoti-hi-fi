<template>
    <ion-card>
        <ion-img :src="video.thumbnail.url" :alt="video.title" class="thumbnail" />
        <ion-card-header>
            <ion-card-title>{{ video.title }}</ion-card-title>
            <ion-card-subtitle>
                {{ video.channel.name }} • {{ formattedViews }} • {{ video.uploadedAt }}
            </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <p v-if="video.description">{{ video.description }}</p>
            <ion-badge v-if="video.live" color="danger">🔴 En Vivo</ion-badge>
            <ion-badge v-else-if="video.shorts" color="primary">📱 Short</ion-badge>
            <ion-badge v-else color="medium">{{ video.duration_formatted }}</ion-badge>
            <ion-badge v-if="video.private" color="warning">🔒 Privado</ion-badge>
        </ion-card-content>
        <ion-button expand="full" fill="outline" @click="downloadMp3">
            Descargar audio
        </ion-button>
    </ion-card>
</template>

<script lang="ts" setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonBadge, IonButton, IonImg, loadingController } from '@ionic/vue';
import { computed } from 'vue';
import type { YoutubeTrack } from '@/types/YoutubeSearch';
import { External } from '@/APIService/external';

const props = defineProps<{
    video: YoutubeTrack,
    spotifyId: string,
    title: string,
    artists: {
        spotifyId: string,
        name: string
    }[],
    album: {
        spotifyId: string,
        name: string,
        coverImage:string,
        artists: {
            spotifyId: string,
            name: string
        }[]
    },
}>();

// Formatea las vistas en formato legible
const formattedViews = computed(() => {
    if (props.video.views >= 1_000_000) {
        return (props.video.views / 1_000_000).toFixed(1) + 'M vistas';
    } else if (props.video.views >= 1_000) {
        return (props.video.views / 1_000).toFixed(1) + 'K vistas';
    }
    return props.video.views + ' vistas';
});

const downloadMp3 = async () => {
    const loader = await loadingController.create({
        message: `Descargando ${props.title}...`,
        spinner: 'circles'
    })
    await loader.present()
    try {
        let data = await External.downloadMp3(props.video.url, props.video.id, props.spotifyId, props.title, props.artists,props.album)
    } catch (error) {
        console.error(error);
    } finally {
        await loader.dismiss()
    }
}
</script>

<style scoped>
.thumbnail {
    width: 100%;
    height: auto;
    border-radius: 8px 8px 0 0;
}

ion-card-content p {
    font-size: 0.9rem;
    color: var(--ion-color-medium);
}

ion-badge {
    margin-right: 5px;
}
</style>
