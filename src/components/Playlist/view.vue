<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ playlist?.name }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="dismiss">
                        <ion-icon :icon="close" slot="icon-only" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col size="6" size-sm="5" size-md="4" size-lg="4" v-for="song in playlist?.songs"
                        :key="song.id">
                        <LocalCard :song="song" />
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { LocalPlaylist } from '@/types/Playlist';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonContent, modalController, IonGrid, IonRow, IonCol, toastController } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import LocalCard from '../LocalCard.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const playlist = ref<LocalPlaylist>()
const props = defineProps<{ id: number }>()
onMounted(async () => {
    try {
        playlist.value = await Playlist.getPlaylist(props.id)
    } catch (error) {
        const toast = await toastController.create({
            message: t('server.error.get.playlist'),
            color: 'danger',
            duration: 2000
        })
        await toast.present()
    }
})
const dismiss = () => {
    modalController.dismiss()
}
</script>