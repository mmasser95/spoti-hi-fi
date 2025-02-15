<template>
  <ion-card class="player-container">
    <ion-grid>
      <ion-row class="player-header">
        <ion-col size="auto">
          <ion-img :src="currentSong?.artwork || defaultCover" class="album-cover"></ion-img>
        </ion-col>
        <ion-col>
          <h3 class="track-title">{{ currentSong?.title || "Sin título" }}</h3>
          <p class="track-artist">{{ currentSong?.artist || "Desconocido" }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="progress-container">
        <input type="range" min="0" max="100" v-model="progress" @input="seekTo" class="progress-bar" />
        <div class="time-info">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </ion-row>

      <ion-row class="controls">
        <ion-button :color="isShuffling ? 'primary' : 'medium'" @click="toggleShuffle">
          <ion-icon :icon="shuffle"></ion-icon>
        </ion-button>
        <ion-button @click="prev">
          <ion-icon :icon="playSkipBack"></ion-icon>
        </ion-button>
        <ion-button class="play-pause-btn" @click="togglePlay">
          <ion-icon v-if="!isPlaying" :icon="play"></ion-icon>
          <ion-icon v-else :icon="pause"></ion-icon>
        </ion-button>
        <ion-button @click="next">
          <ion-icon :icon="playSkipForward"></ion-icon>
        </ion-button>
        <ion-button :color="isRepeating ? 'primary' : 'medium'" @click="toggleRepeat">
          <ion-icon :icon="repeat"></ion-icon>
        </ion-button>
      </ion-row>
      <ion-row class="modal-button-container">
        <ion-col class="ion-text-center">
          <ion-button @click="showPlaylist">
            <ion-icon :icon="options"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { IonButton, IonCard, IonGrid, IonRow, IonCol, IonIcon, IonImg, modalController } from "@ionic/vue";
import { play, pause, playSkipBack, playSkipForward, shuffle, repeat, options } from "ionicons/icons";
import { usePlaylist } from "@/store/usePlaylist";
import { storeToRefs } from "pinia";
import MyPlaylist from "@/components/MyPlaylist.vue";
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
    initialBreakpoint: 0.33,
  })
  await modal.present()
}

</script>

<style scoped>
.player-container {
  padding: 15px;
  border-radius: 15px;
  background: #1e1e1e;
  color: white;
  text-align: center;
}

.album-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
}

.track-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.track-artist {
  font-size: 14px;
  color: #aaa;
}

.progress-container {
  width: 100%;
  padding: 10px 0;
}

.progress-bar {
  width: 100%;
  appearance: none;
  height: 4px;
  background: #777;
  border-radius: 4px;
  outline: none;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
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
</style>