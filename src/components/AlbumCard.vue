<template>
    <ion-card>
        <ion-img :src="album.coverImage" :alt="album.name" />
        <ion-card-header>
            <ion-card-title>{{ album.name }}</ion-card-title>
            <ion-card-subtitle>{{ artistsNames }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
            <ion-badge></ion-badge>
            <ion-button expand="block" fill="outline">Ver Album</ion-button>
            <ion-button expand="block">Añadir Album</ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import { AlbumResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonBadge, IonButton } from '@ionic/vue';
import { computed } from 'vue';

const props = defineProps<{ album: AlbumResult }>()

const artistsNames = computed(() => props.album.artists
    .map(artist => artist.name)
    .join(', '))
</script>