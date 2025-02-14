<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>Lista de Reproducción</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="dismiss" slot="icon-only">
                    <ion-icon :icon="close"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <ion-list>
            <ion-reorder-group :disabled="false" @ionItemReorder="reorderPlaylist">
                <ion-item v-for="(song, index) in playlist" :key="index">
                    <ion-label>
                        <h2>{{ song.title }}</h2>
                        <p>{{ song.artist }}</p>
                    </ion-label>
                    <ion-reorder />
                </ion-item>
            </ion-reorder-group>
        </ion-list>
    </ion-content>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { modalController, IonIcon, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonLabel, IonReorder, IonItem, IonReorderGroup, IonList, IonContent, ItemReorderEventDetail, ItemReorderCustomEvent } from "@ionic/vue";
import { usePlaylist } from "@/store/usePlaylist";
import { storeToRefs } from "pinia";
import { close } from "ionicons/icons";


const isOpen = ref(true);
const { playlist } = storeToRefs(usePlaylist());

const dismiss = async () => {
    isOpen.value = false;
    await modalController.dismiss();
};

// Reordenar la lista de reproducción
const reorderPlaylist = (event:ItemReorderCustomEvent) => {
    const movedItem = playlist.value.splice(event.detail.from, 1)[0];
    playlist.value.splice(event.detail.to, 0, movedItem);
    event.detail.complete();
};
</script>