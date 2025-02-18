<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-sm="8" size-md="6" size-lg="4">
            <ion-list>
              <ion-item button @click="showEq" lines="full">
                <ion-icon :icon="barcode" slot="start"></ion-icon>
                <ion-label>Ecualizador</ion-label>
              </ion-item>
              <ion-item button @click="showLang" lines="full">
                <ion-icon :icon="language" slot="start"></ion-icon>
                <ion-label>Idioma</ion-label>
              </ion-item>
              <ion-item-divider />
              <ion-item button @click="doLogout" lines="full">
                <ion-icon :icon="logOut" slot="start"></ion-icon>
                <ion-label>Cerrar sesión</ion-label>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuth } from '@/store/useAuth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonList, IonItem, IonItemDivider, IonIcon, IonLabel } from '@ionic/vue';
import { barcode, language, logOut, settings } from 'ionicons/icons';
const { logout } = useAuth()
const doLogout = async () => {
  await logout()
  router.push('/')
}
const showEq = () => { }
const showLang = () => { }
</script>
