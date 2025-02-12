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
import { onMounted, ref, watch } from 'vue';
import { Howl } from 'howler';
import { IonButton, IonButtons, IonIcon } from '@ionic/vue';
import { play, pause, stop, playSkipBack, playSkipForward } from 'ionicons/icons';
import { MediaSession } from '@jofr/capacitor-media-session'
import { Song } from '@/types/Song';
const song = defineModel<Song>()
const player = ref<Howl>()
const isPlaying = ref(false)
const isMid = ref(false)

const emit = defineEmits<{
    prev: [],
    next: []
}>()

watch(song, (value) => {
    if (!!value && value.url !== "") {
        if (!!player.value)
            player.value.unload()
        player.value = new Howl({
            src: value.url
        })
        if (isPlaying.value) {
            player.value.play()
        } else {
            if (isMid.value)
                isMid.value = false
        }
    }
})

const playAudio = () => {
    if (!!song.value) {
        isMid.value = true
        isPlaying.value = true
        player.value?.play()
    }
}
const pauseAudio = () => {
    isPlaying.value = false
    player.value?.pause()
}
const stopAudio = () => {
    isMid.value = false
    isPlaying.value = false
    player.value?.stop()
}

const prev = () => {
    emit('prev')
}
const next = () => {
    emit('next')
}
onMounted(() => {
    if (!!song.value && song.value.url !== "")
        player.value = new Howl({
            src: song.value.url
        })
})

watch(isPlaying, (v) => {
    const playbackState = isMid.value ? (v ? "playing" : "paused") : "none"
    MediaSession.setPlaybackState({
        playbackState
    })
})
</script>
<style lang="css" scoped></style>