<template>
    <ion-header>
        <ion-toolbar>
            <ion-title class="ion-text-center">Playlist</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <ion-list>
            <ion-reorder-group :disabled="false" @ionItemReorder="reorderPlaylist($event)">
                <ion-item v-for="(song, index) in playlist" :key="song.url"
                    :class="{ 'playing': song.url === currentSong.url }">
                    <ion-label :class="{ 'playing': song.url === currentSong.url }" @click="selectSong(index)">
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
const { playlist, currentIndex, currentSong } = storeToRefs(usePlaylist());

const dismiss = async () => {
    isOpen.value = false;
    await modalController.dismiss();
};

// Reordenar la lista de reproducción
const reorderPlaylist = (event: ItemReorderCustomEvent) => {
    const currentUrl = currentSong.value.url

    const movedItem = playlist.value.splice(event.detail.from, 1)[0];
    playlist.value.splice(event.detail.to, 0, movedItem);

    const newIndex = playlist.value.findIndex(song => song.url === currentUrl)
    if (newIndex !== -1)
        currentIndex.value = newIndex

    event.detail.complete();
};
const selectSong = (index: number) => {
    currentIndex.value = index
}
</script>
<style scoped>
.playing h2 {
    /* background-color: #d3d3d3; */
    /* Color de fondo para la canción en reproducción */
    font-weight: bolder !important;
    color: #1ed760
}

.playing p {
    color: #1ed760
}
</style>