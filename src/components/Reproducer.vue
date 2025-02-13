<template>
      <Player v-model="currentSong" @next="next" @prev="prev" />
      {{ currentSong }}
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Player from './Player.vue';
import { storeToRefs } from 'pinia';
import { usePlaylist } from '@/store/usePlaylist';
import { IonButton, IonInput } from '@ionic/vue';
const { currentSong } = storeToRefs(usePlaylist())
const { prev, next, addToPlaylist } = usePlaylist()

addToPlaylist({
      url: "http://192.168.1.23:3333/Karma.mp3",
      title: "Karma",
      artist: "Naaman"
})
addToPlaylist({
      url: "http://192.168.1.23:3333/What%20a%20Curfew.mp3",
      title: "What a Curfew",
      artist: "Iration"
})

</script>
<style scoped></style>