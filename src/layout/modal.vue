<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ title }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="dismiss">
                        <ion-icon slot="icon-only" :icon="close" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <slot></slot>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import { modalController, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonContent } from '@ionic/vue';
import { close } from 'ionicons/icons';

defineProps<{
    title: string
}>()
const dismiss = () => {
    modalController.dismiss()
}
</script>