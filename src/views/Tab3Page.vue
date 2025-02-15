<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Explore</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Explore</ion-title>
        </ion-toolbar>
      </ion-header>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { External } from '@/APIService/external';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';

const getLocal = async () => {
  let data = await External.getLocalSongs()
  console.log(data);
}
</script>
