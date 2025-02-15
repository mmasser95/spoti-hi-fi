<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Player</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Player</ion-title>
        </ion-toolbar>
      </ion-header>
      <Player/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { External } from '@/APIService/external';
import Player from '@/components/Player.vue';
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
const { addToPlaylist } = usePlaylist()
const { url } = storeToRefs(useAuth())
onMounted(async () => {
  let data = await External.getLocalSongs()
  for (const song of data) {
    addToPlaylist({
      artist: song.artists.map((artist) => artist.name).join(", "),
      url: `${url.value}/${song.filePath.split("/")[1]}`,
      title: song.title,
      artwork:song.album.coverImage
    })
  }
})
</script>
