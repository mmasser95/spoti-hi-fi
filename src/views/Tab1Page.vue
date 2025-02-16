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
import Player from '@/components/Player.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

</script>
