<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ playlist.name }}</ion-card-title>
            <ion-card-subtitle>{{ playlist.user.email }} -- {{ playlist.createdAt }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex-align-center">
            <ion-button shape="round" fill="outline" color="primary">
                <ion-icon slot="icon-only" :icon="add" />
            </ion-button>
            <ion-button shape="round" fill="outline" color="danger" @click="deletePlaylist">
                <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { LocalPlaylist } from '@/types/Playlist';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonButtons, IonIcon, alertController } from '@ionic/vue';
import { add, eye, trashOutline } from 'ionicons/icons';
const props = defineProps<{ playlist: LocalPlaylist }>()
const emit = defineEmits<{
    delete: []
}>()
const deletePlaylist = async () => {
    const alert = await alertController.create({
        header: 'Eliminar playlist?',
        subHeader: 'Estas seguro?',
        message: 'Esta acción no se puede deshacer',
        buttons: [{ text: 'Si', role: 'si' }, { text: 'No', role: 'no' }]
    })
    alert.onDidDismiss().then(async ({ role }) => {
        if (role == 'si') {
            await Playlist.deletePlaylist(props.playlist.id)
            emit('delete')
        }
    })
    await alert.present()
}
</script>