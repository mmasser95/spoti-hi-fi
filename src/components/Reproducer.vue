<template>
      <Player v-model="currentSong" @next="next" @prev="prev" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Player from './Player.vue';
import { storeToRefs } from 'pinia';
import { usePlaylist } from '@/store/usePlaylist';
const { currentSong } = storeToRefs(usePlaylist())
const { prev, next, addToPlaylist } = usePlaylist()

addToPlaylist({
      url: "http://localhost:3333/Karma.mp3",
      title: "Karma",
      artist: "Naaman"
})
addToPlaylist({
      url: "http://localhost:3333/What%20a%20Curfew.mp3",
      title: "What a Curfew",
      artist: "Iration"
})

</script>
<style scoped></style>