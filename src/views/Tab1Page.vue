<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Player />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import Player from '@/components/Player.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

</script>
