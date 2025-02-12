<template>
      <Player v-model="currentUrl" @next="next" @prev="prev" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Player from './Player.vue';
import { storeToRefs } from 'pinia';
import { usePlaylist } from '@/store/usePlaylist';
const { currentUrl } = storeToRefs(usePlaylist())
const { prev, next, addToPlaylist } = usePlaylist()

addToPlaylist("http://localhost:3333/Karma.mp3")
addToPlaylist("http://localhost:3333/What%20a%20Curfew.mp3")

</script>
<style scoped></style>