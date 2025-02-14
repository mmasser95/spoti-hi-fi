<template>
      <Player v-model="currentSong" @next="next" @prev="prev" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Player from './Player.vue';
import { storeToRefs } from 'pinia';
import { usePlaylist } from '@/store/usePlaylist';
import { IonButton, IonInput } from '@ionic/vue';
const { currentSong } = storeToRefs(usePlaylist())
const { prev, next, addToPlaylist } = usePlaylist()



</script>
<style scoped></style>