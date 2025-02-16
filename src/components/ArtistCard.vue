<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>
                {{ artist.name }}
            </ion-card-title>
            <ion-card-subtitle>
                {{ artist.spotifyId }}
            </ion-card-subtitle>
            <ion-card-content>
                <ion-button fill="outline" @click="ver">Ver artista</ion-button>
                <ion-button @click="ver">Añadir artista</ion-button>
            </ion-card-content>
        </ion-card-header>
    </ion-card>
</template>
<script lang="ts" setup>
import { ArtistResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton } from '@ionic/vue';
defineProps<{ artist: ArtistResult }>()

const ver = () => { }
</script>