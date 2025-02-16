<template>
    <ion-card>
        <ion-img :src="album.coverImage" :alt="album.name" />
        <ion-card-header>
            <ion-card-title>{{ album.name }}</ion-card-title>
            <ion-card-subtitle>{{ artistsNames }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <ion-badge></ion-badge>
            <ion-button expand="block" fill="outline" @click="showAlbum">Ver Album</ion-button>
            <ion-button expand="block">Añadir Album</ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import { AlbumResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonBadge, IonButton, modalController } from '@ionic/vue';
import { computed } from 'vue';
import ViewAlbum from '@/components/ViewAlbum.vue';

const props = defineProps<{ album: AlbumResult }>()

const artistsNames = computed(() => props.album.artists
    .map(artist => artist.name)
    .join(', '))

const showAlbum = async () => {
    const modal = await modalController.create({
        component: ViewAlbum,
        componentProps: {
            album: props.album
        }
    })
    await modal.present()
}
</script>