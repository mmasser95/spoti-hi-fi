<template>
    <ion-card ref="cardRef">
        <ion-img :src="album.coverImage" :alt="album.name" />
        <ion-card-header>
            <ion-card-title>{{ album.name }}</ion-card-title>
            <ion-card-subtitle>{{ artistsNames }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex-align-center">
            <ion-badge></ion-badge>
            <ion-button fill="outline" shape="round" @click="addAlbumToPlaylist">
                <ion-icon slot="icon-only" :icon="musicalNoteOutline" />
            </ion-button>
            <ion-button fill="outline" shape="round" @click="showAlbum">
                <ion-icon slot="icon-only" :icon="eyeOutline" />
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import { AlbumResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonBadge, IonButton, modalController } from '@ionic/vue';
import { computed, ref } from 'vue';
import ViewAlbum from '@/components/ViewAlbum.vue';
import { usePlaylist } from '@/store/usePlaylist';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/store/useAuth';
import { add, eyeOutline, musicalNoteOutline } from 'ionicons/icons';
import { onLongPress } from '@vueuse/core';
const { addToPlaylist } = usePlaylist()
const { url: base_url } = storeToRefs(useAuth())
const props = defineProps<{ album: AlbumResult }>()
const cardRef = ref<HTMLElement>()
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
const addAlbumToPlaylist = () => {
    for (const song of props.album.songs) {
        addToPlaylist({
            artist: song.artists.map(a=>a.name).join(', '),
            url: `${base_url.value}/${song.filePath.split("/")[1]}`,
            title: song.title,
            artwork: props.album.coverImage
        })
    }
}
onLongPress(cardRef, () => { })
</script>