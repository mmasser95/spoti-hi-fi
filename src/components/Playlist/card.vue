<template>
    <ion-card @click="viewPlaylist">
        <ion-card-header>
            <ion-card-title>{{ playlist.name }}</ion-card-title>
            <ion-card-subtitle>{{ playlist.user.email }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex-align-center">
            <ion-button shape="round" fill="outline" color="primary" @click.stop="addIt">
                <ion-icon slot="icon-only" :icon="musicalNoteOutline" />
            </ion-button>
            <ion-button shape="round" fill="outline" color="danger" @click.stop="deletePlaylist">
                <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { LocalPlaylist } from '@/types/Playlist';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonButtons, IonIcon, alertController, modalController } from '@ionic/vue';
import { musicalNoteOutline, trashOutline } from 'ionicons/icons';
import View from './view.vue';
import { usePlaylist } from '@/store/usePlaylist';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/store/useAuth';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const { addToPlaylist } = usePlaylist()
const { url } = storeToRefs(useAuth())
const props = defineProps<{ playlist: LocalPlaylist }>()
const emit = defineEmits<{
    delete: []
}>()
const deletePlaylist = async () => {
    const alert = await alertController.create({
        header: t('playlist.delete.header'),
        subHeader: t('playlist.delete.subheader'),
        message: t('playlist.delete.message'),
        buttons: [{ text: t('yes'), role: 'si' }, { text: t('no'), role: 'no' }]
    })
    alert.onDidDismiss().then(async ({ role }) => {
        if (role == 'si') {
            await Playlist.deletePlaylist(props.playlist.id)
            emit('delete')
        }
    })
    await alert.present()
}
const addIt = async () => {
    const p = await Playlist.getPlaylist(props.playlist.id)
    for (const song of p.songs) {
        addToPlaylist({
            id: song.id,
            title: song.title,
            artist: song.artists.map(a => a.name).join(', '),
            artwork: song.album.coverImage,
            url: `${url.value}/${song.filePath.split('/')[1]}`
        })
    }
}

const viewPlaylist = async () => {
    const modal = await modalController.create({
        component: View,
        componentProps: { id: props.playlist.id }
    })
    await modal.present()
}
</script>