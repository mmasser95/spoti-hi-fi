<template>
    <ion-card>
        <ion-card-header>
            <div class="img" v-if="artist.albums">
                <ion-img v-if="artist.albums[0]" :src="artist.albums[0].coverImage" />
                <ion-img v-else src="generic-cover.webp" />
            </div>
            <ion-card-title>
                {{ artist.name }}
            </ion-card-title>
            <ion-card-subtitle>
                {{ artist.spotifyId }}
            </ion-card-subtitle>
            <ion-card-content class="flex-align-center">
                <ion-button fill="outline" shape="round" @click="addArtistToPlaylist">
                    <ion-icon slot="icon-only" :icon="musicalNoteOutline" />
                </ion-button>
                <ion-button fill="outline" shape="round" @click="ver">
                    <ion-icon slot="icon-only" :icon="eyeOutline" />
                </ion-button>
            </ion-card-content>
        </ion-card-header>
    </ion-card>
</template>
<script lang="ts" setup>
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { ArtistResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton, modalController } from '@ionic/vue';
import { eyeOutline, musicalNoteOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import View from './Artist/view.vue';

interface ExtendedArtist extends ArtistResult {
    albums?: {
        coverImage: string;
    }[];
}
const props = defineProps<{ artist: ExtendedArtist }>()
const { addToPlaylist } = usePlaylist()
const { url } = storeToRefs(useAuth())
const ver = async () => {
    const modal = await modalController.create({
        component: View,
        componentProps: {
            artist: props.artist
        }
    })
    await modal.present()
}
const addArtistToPlaylist = () => {
    for (const song of props.artist.songs) {
        addToPlaylist({
            id:song.id,
            artist: song.artists.map(a => a.name).join(', '),
            url: `${url.value}/${song.filePath.split("/")[1]}`,
            title: song.title,
            artwork: song.album.coverImage
        })

    }
}
</script>