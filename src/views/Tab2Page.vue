<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('tab2.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('tab2.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <Search />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import Search from '@/components/Search.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>
