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
                <ion-button fill="outline" shape="round" @click="ver">
                    <ion-icon slot="icon-only" :icon="eyeOutline" />
                </ion-button>
                <ion-button fill="outline" shape="round" @click="getSongs">
                    <ion-icon slot="icon-only" :icon="add" />
                </ion-button>
            </ion-card-content>
        </ion-card-header>
    </ion-card>
</template>
<script lang="ts" setup>
import { External } from '@/APIService/external';
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { AlbumResult, ArtistResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton } from '@ionic/vue';
import { add, eye, eyeOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';

interface ExtendedArtist extends ArtistResult {
    albums?: {
        coverImage: string;
    }[];
}
const props = defineProps<{ artist: ExtendedArtist }>()
const { addToPlaylist } = usePlaylist()
const { url } = storeToRefs(useAuth())
const ver = () => { }
const getSongs = async () => {
    let songs = await External.getSongsOfArtist(props.artist.id)
    for (const song of songs) {
        const artist = song.artists.map(artist => artist.name).join(', ')
        addToPlaylist({
            artwork: song.album.coverImage,
            title: song.title,
            url: `${url.value}/${song.filePath.split("/")[1]}`,
            artist
        })
    }

}
</script>