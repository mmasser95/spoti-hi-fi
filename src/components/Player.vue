<template>
    <ion-buttons>
        <ion-button @click="prev">
            <ion-icon slot="icon-only" :icon="playSkipBack"></ion-icon>
        </ion-button>
        <ion-button @click="playAudio" v-if="!isPlaying">
            <ion-icon slot="icon-only" :icon="play"></ion-icon>
        </ion-button>
        <ion-button @click="pauseAudio" v-if="isPlaying">
            <ion-icon slot="icon-only" :icon="pause"></ion-icon>
        </ion-button>
        <ion-button @click="stopAudio" v-if="isMid">
            <ion-icon slot="icon-only" :icon="stop"></ion-icon>
        </ion-button>
        <ion-button @click="next">
            <ion-icon slot="icon-only" :icon="playSkipForward"></ion-icon>
        </ion-button>
    </ion-buttons>
</template>
<script lang="ts" setup>
import { usePlaylist } from '@/store/usePlaylist';
import { IonButton, IonButtons, IonIcon } from '@ionic/vue';
import { play, pause, stop, playSkipBack, playSkipForward } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
const store=usePlaylist()
const {
    isPlaying,
    isMid
}=storeToRefs(store)
const {
    prev,
    playAudio,
    pauseAudio,
    stopAudio,
    next
}=store

</script>
<style lang="css" scoped></style>