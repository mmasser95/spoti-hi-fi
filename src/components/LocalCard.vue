<template>
    <ion-card ref="cardRef" @click="playSong">
        <ion-img :src="song.album.coverImage" :alt="song.title" />
        <ion-card-header>
            <ion-card-title>{{ song.title }}</ion-card-title>
            <ion-card-subtitle>{{ artistsNames }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="ion-text-center">
            <ion-badge v-if="isInPlaylist" color="primary">{{ t('badge.added') }}</ion-badge>
            <div class="flex-align-center">
                <ion-button fill="outline" shape="round" @click.stop="addToUserPlaylist">
                    <ion-icon slot="icon-only" :icon="add" />
                </ion-button>
                <ion-button v-if="!isDownloaded(song.id)" shape="round" fill="outline" @click.stop="descargar">
                    <ion-icon slot="icon-only" :icon="downloadOutline" />
                </ion-button>
            </div>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { getElements, insertSong, saveSong } from '@/composables/useLocalSystem';
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { LocalSong } from '@/types/LocalElements';
import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton, IonIcon, actionSheetController, modalController } from '@ionic/vue';
import { onLongPress } from '@vueuse/core';
import { add, close, download, downloadOutline, list, musicalNote, text } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import useLocal from '@/store/useLocal';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const store = usePlaylist()
const { playlist, currentIndex } = storeToRefs(store)
const { addToPlaylist, changeToLastSongInPlaylist } = store
const { url: base_url } = storeToRefs(useAuth())
const { isDownloaded, addIdToDownloaded } = useLocal()
const cardRef = ref<HTMLElement>()
const props = defineProps<{
    song: LocalSong
}>()

const fileName = computed(() => props.song.filePath.split("/")[1])
const myUrl = computed(() => `${base_url.value}/${fileName.value}`)

const artistsNames = computed(() => props.song.artists
    .map(artist => artist.name)
    .join(", "))
const isInPlaylist = computed(() => playlist.value
    .map(song => song.id)
    .some(id => id == props.song.id))

const playSong = () => {
    if (!isInPlaylist.value) {
        addIt()
        changeToLastSongInPlaylist()
    }
}

const addIt = () => {
    addToPlaylist({
        id: props.song.id,
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
    addIdToDownloaded(props.song.id)
}

onLongPress(cardRef, async () => {
    const action = await actionSheetController.create({
        buttons: [
            {
                text: t('action.play'),
                icon: musicalNote,
                handler: addIt
            },
            {
                text: t('action.download'),
                icon: download,
                handler: descargar
            },
            {
                text: t('action.add.to.playlist'),
                icon: list,
                handler: addToUserPlaylist
            },
            {
                text: t('cancel'),
                role: "cancel",
                icon: close
            }
        ]
    })
    await action.present()
})
const addToUserPlaylist = async () => {
    const playlists = await Playlist.getAllPlaylists()
    const buttons: {
        text: string,
        icon?: string,
        handler?: () => void,
        role?: string
    }[] = playlists.map(playlist => ({
        text: playlist.name,
        icon: list,
        handler: () => Playlist.addSongToPlaylist(playlist.id, props.song.id)
    }))
    // buttons.push({
    //     text:"Crear nueva playlist",
    //     icon:add,
    //     handler:createPlaylist
    // })
    buttons.push({
        text: t('cancel'),
        role: "cancel"
    })
    const action = await actionSheetController.create({
        buttons
    })
    await action.present()
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