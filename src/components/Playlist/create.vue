<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Create Playlist</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="dismiss">
                        <ion-icon :icon="close" slot="icon-only" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <form @submit.prevent="submitForm">
                    <ion-row>
                        <ion-col>
                            <ion-input label="Nombre" label-placement="floating" v-model="nombre" />
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <ion-button type="submit"></ion-button>
                        </ion-col>
                    </ion-row>
                </form>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonPage, IonButton, IonButtons, modalController } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { ref } from 'vue';
const nombre = ref("")
const dismiss = () => {
    modalController.dismiss({}, "cancel")
}
const submitForm = async () => {
    console.log(`Submit con nombre ${nombre.value}`);
    await Playlist.createPlaylist(nombre.value)
    modalController.dismiss({ nombre: nombre.value }, "submit")
}
</script>