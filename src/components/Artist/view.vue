<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ artist.name }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="dismiss">
                        <ion-icon :icon="close" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col v-for="item in artist.songs" :key="item.id" size="6" size-sm="5" size-md="4">
                        <LocalCard :song="item" />
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import { ArtistResult } from '@/types/SearchResults';
import { IonPage, IonHeader, IonToolbar, IonButton, IonButtons, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, modalController } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { onMounted } from 'vue';
import LocalCard from '../LocalCard.vue';



const props = defineProps<{ artist: ArtistResult }>()
onMounted(() => {
    console.log(props.artist);

})
const dismiss = () => {
    modalController.dismiss()
}
</script>