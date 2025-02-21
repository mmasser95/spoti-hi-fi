<template>
    <ion-header>
        <ion-toolbar>
            <ion-title class="ion-text-center">Playlist</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <ion-list>
            <ion-reorder-group :disabled="false" @ionItemReorder="reorderPlaylist($event)">
                <ion-item-sliding v-for="(song, index) in playlist" :key="song.id">
                    <ion-item :class="{ 'playing': song.id === currentSong.id }">
                        <ion-label :class="{ 'playing': song.id === currentSong.id }" @click="selectSong(index)">
                            <h2>{{ song.title }}</h2>
                            <p>{{ song.artist }}</p>
                        </ion-label>
                        <ion-reorder />
                    </ion-item>
                    <ion-item-options slot="end" @ionSwipe="deleteSong(index)">
                        <ion-item-option color="danger" @click="deleteSong(index)">
                            <ion-icon slot="icon-only" :icon="trash" />
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-reorder-group>
        </ion-list>
    </ion-content>
</template>

<script lang="ts" setup>
import { modalController, IonIcon, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonLabel, IonReorder, IonItem, IonReorderGroup, IonList, IonContent, ItemReorderEventDetail, ItemReorderCustomEvent, IonItemOption, IonItemOptions, IonItemSliding } from "@ionic/vue";
import { usePlaylist } from "@/store/usePlaylist";
import { storeToRefs } from "pinia";
import { close, trash } from "ionicons/icons";


const { playlist, currentIndex, currentSong } = storeToRefs(usePlaylist());

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
const deleteSong = (index: number) => {
    if (playlist.value.length === 0) return; // Evitar eliminar si la lista ya está vacía

    // Si la canción eliminada es la que se está reproduciendo
    if (index === currentIndex.value) {
        // Si hay una siguiente canción en la lista, reproducirla
        if (index < playlist.value.length - 1) {
            currentIndex.value++;
        }
        // Si la eliminada era la última, retroceder al anterior si existe
        else if (index > 0) {
            currentIndex.value--;
        } else {
            // Si no quedan canciones, resetear el índice y parar la reproducción
            currentIndex.value = -1;
            
        }
    } else if (index < currentIndex.value) {
        // Si eliminamos una canción antes de la actual, el índice se debe ajustar
        currentIndex.value--;
    }

    // Eliminar la canción de la lista
    playlist.value.splice(index, 1);

    // Si la playlist queda vacía, resetear el índice
    if (playlist.value.length === 0) {
        currentIndex.value = -1;
    }
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