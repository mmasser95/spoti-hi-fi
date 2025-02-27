<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ t('create.playlist') }}</ion-title>
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
                            <ion-input :label="t('name')" label-placement="floating" v-model="nombre" />
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col class="ion-text-center">
                            <ion-button type="submit" expand="block">
                                <ion-icon :icon="add" slot="start" />
                                {{ t('create.playlist') }}
                            </ion-button>
                        </ion-col>
                    </ion-row>
                </form>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { IonContent, IonHeader, IonIcon, IonToolbar, IonGrid, IonCol, IonRow, IonTitle, IonInput, IonPage, IonButton, IonButtons, modalController } from '@ionic/vue';
import { add, close } from 'ionicons/icons';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const nombre = ref("")
const dismiss = () => {
    modalController.dismiss({}, "cancel")
}
const submitForm = async () => {
    await Playlist.createPlaylist(nombre.value)
    modalController.dismiss({ nombre: nombre.value }, "submit")
}
</script>