<template>
    <ion-card>
        <ion-img :src="song.album.coverImage" :alt="song.title" />
        <ion-card-header>
            <ion-card-title>{{ song.title }}</ion-card-title>
            <ion-card-subtitle>{{ artistsNames }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <ion-badge v-if="isInPlaylist" color="warning">Añadida</ion-badge>
            <ion-button @click="addIt" v-else>Añadir</ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { LocalSong } from '@/types/LocalElements';
import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton, IonIcon } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const store = usePlaylist()
const { playlist } = storeToRefs(store)
const { addToPlaylist } = store
const { url: base_url } = storeToRefs(useAuth())

const props = defineProps<{
    song: LocalSong
}>()

const artistsNames = computed(() => props.song.artists
    .map(artist => artist.name)
    .join(", "))
const isInPlaylist = computed(() => playlist.value
    .map(song => song.url)
    .some(url => url == `${base_url.value}/${props.song.filePath.split("/")[1]}`))

const addIt = () => {
    addToPlaylist({
        artist: artistsNames.value,
        url: `${base_url.value}/${props.song.filePath.split("/")[1]}`,
        title: props.song.title,
        artwork: props.song.album.coverImage
    })
}
</script>