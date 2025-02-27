<template>
  <ion-card class="player-container">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="8" size-sm="4" size-md="3" size-lg="2">
          <ion-img :src="currentSong?.artwork || defaultCover" class="album-cover"></ion-img>
        </ion-col>
      </ion-row>
      <ion-row class="player-header">
        <ion-col>
          <ion-text color="primary">
            <h3 class="track-title">{{ currentSong?.title || t('no.title') }}</h3>
          </ion-text>
          <ion-text color="medium">
            <p class="track-artist">{{ currentSong?.artist || t('unknown') }}</p>
          </ion-text>
        </ion-col>
      </ion-row>
      <ion-row class="progress-container">
        <input type="range" min="0" max="100" v-model="progress" @input="seekTo" class="styled-range" />
        <div class="time-info">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </ion-row>

      <ion-row class="controls">
        <ion-button shape="round" :fill="isShuffling ? 'outline' : 'clear'" size="small"
          :color="isShuffling ? 'primary' : 'medium'" @click="toggleShuffle">
          <ion-icon slot="icon-only" :icon="shuffle"></ion-icon>
        </ion-button>
        <ion-button shape="round" fill="clear" size="small" @click="prev">
          <ion-icon slot="icon-only" :icon="playSkipBack"></ion-icon>
        </ion-button>
        <ion-button shape="round" @click="togglePlay" fill="clear">
          <ion-icon slot="icon-only" v-if="!isPlaying" :icon="play"></ion-icon>
          <ion-icon slot="icon-only" v-else :icon="pause"></ion-icon>
        </ion-button>
        <ion-button shape="round" size="small" fill="clear" @click="next">
          <ion-icon slot="icon-only" :icon="playSkipForward"></ion-icon>
        </ion-button>
        <ion-button shape="round" :fill="isRepeating ? 'outline' : 'clear'" size="small"
          :color="isRepeating ? 'primary' : 'medium'" @click="toggleRepeat">
          <ion-icon slot="icon-only" :icon="repeat"></ion-icon>
        </ion-button>
      </ion-row>
      <ion-row class="modal-button-container">
        <ion-col class="ion-text-center">
          <ion-button fill="outline" shape="round" @click="showPlaylist">
            <ion-icon slot="icon-only" :icon="options"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { IonButton, IonCard, IonGrid, IonText, IonRange, IonRow, IonCol, IonIcon, IonImg, modalController } from "@ionic/vue";
import { play, pause, playSkipBack, playSkipForward, shuffle, repeat, options } from "ionicons/icons";
import { usePlaylist } from "@/store/usePlaylist";
import { storeToRefs } from "pinia";
import MyPlaylist from "@/components/MyPlaylist.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const store = usePlaylist();
const { isPlaying, currentSong, duration, currentTime, isShuffling, isRepeating } = storeToRefs(store);
const { prev, playAudio, pauseAudio, next, toggleShuffle, toggleRepeat, seek } = store;

const defaultCover = "generic-cover.webp"; // Imagen por defecto

const togglePlay = () => (isPlaying.value ? pauseAudio() : playAudio());
const progress = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0));

const seekTo = (event: Event) => {
  const target = event.target as HTMLInputElement;
  seek((parseFloat(target.value) / 100) * duration.value);
};

const formatTime = (time: number) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

const showPlaylist = async () => {
  const modal = await modalController.create({
    component: MyPlaylist,
    breakpoints: [0, 0.33, 0.66, 1],
    initialBreakpoint: 0.66,
  })
  await modal.present()
}

</script>

<style scoped>
.player-container {
  padding: 15px;
  border-radius: 15px;
  /* background: #1e1e1e; */
  color: white;
  text-align: center;
  margin: 30px;
}

.album-cover {
  width: 100%;
  /* height: 60px; */
  border-radius: 8px;
}

.track-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.track-artist {
  font-size: 14px;
}

.progress-container {
  width: 100%;
  padding: 10px 0;
}



.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #aaa;
  padding: 5px 10px;
  width: 100%;
}

.controls {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
}

.play-pause-btn {
  font-size: 28px;
}

.active {
  color: #1d54b9;
  /* Color verde de Spotify */
}

.styled-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #777;
  outline: none;
  transition: background 0.2s;
}

/* WebKit (Chrome, Safari) */
.styled-range::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #777;
}

.styled-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -4px;
  position: relative;
  /* box-shadow: -100vw 0 0 100vw #1db954; */
  /* Esto colorea la izquierda */
}

/* Firefox */
.styled-range::-moz-range-track {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #777;
}

.styled-range::-moz-range-progress {
  background: #1db954;
  height: 6px;
  border-radius: 5px;
}
</style>