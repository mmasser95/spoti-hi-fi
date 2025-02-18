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
            <ion-card-content>
                <ion-button fill="outline" @click="ver">Ver artista</ion-button>
                <ion-button @click="getSongs">Añadir artista</ion-button>
            </ion-card-content>
        </ion-card-header>
    </ion-card>
</template>
<script lang="ts" setup>
import { External } from '@/APIService/external';
import { useAuth } from '@/store/useAuth';
import { usePlaylist } from '@/store/usePlaylist';
import { AlbumResult, ArtistResult } from '@/types/SearchResults';
import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton } from '@ionic/vue';
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