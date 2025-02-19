<template>
    <ion-card>
        <ion-img :src="song.album.coverImage" :alt="song.title" />
        <ion-card-header>
            <ion-card-title>{{ song.title }}</ion-card-title>
            <ion-card-subtitle>{{ artistsNames }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex-align-center">
            <ion-badge v-if="isInPlaylist" color="primary">Añadida</ion-badge>
            <ion-button fill="outline" shape="round" @click="addIt" v-else>
                <ion-icon slot="icon-only" :icon="add" />
            </ion-button>
            <ion-button shape="round" fill="outline" @click="descargar">
                <ion-icon slot="icon-only" :icon="downloadOutline" />
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import { getElements, insertSong, saveSong } from '@/composables/useLocalSystem';
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { LocalSong } from '@/types/LocalElements';
import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton, IonIcon } from '@ionic/vue';
import { add, download, downloadOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const store = usePlaylist()
const { playlist } = storeToRefs(store)
const { addToPlaylist } = store
const { url: base_url } = storeToRefs(useAuth())

const props = defineProps<{
    song: LocalSong
}>()

const fileName = computed(() => props.song.filePath.split("/")[1])
const myUrl = computed(() => `${base_url.value}/${fileName.value}`)

const artistsNames = computed(() => props.song.artists
    .map(artist => artist.name)
    .join(", "))
const isInPlaylist = computed(() => playlist.value
    .map(song => song.url)
    .some(url => url == myUrl.value))

const addIt = () => {
    addToPlaylist({
        artist: artistsNames.value,
        url: myUrl.value,
        title: props.song.title,
        artwork: props.song.album.coverImage
    })
}

const descargar = async () => {
    const req = await fetch(myUrl.value)
    const blob = await req.blob()
    await saveSong(fileName.value, blob)
    await insertSong(props.song.id, props.song.title, artistsNames.value, fileName.value, props.song.album.coverImage)
}
</script>

<style>
.flex-align-center {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
}
</style>