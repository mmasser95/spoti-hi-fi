<template>
    <ion-card>
        <ion-img :src="song.artwork" :alt="song.title" />
        <ion-card-header>
            <ion-card-title>{{ song.title }}</ion-card-title>
            <ion-card-subtitle>{{ song.artist }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex-align-center">
            <ion-badge v-if="isInPlaylist" color="warning">Añadida</ion-badge>
            <ion-button shape="round" fill="outline" v-else @click="addIt">
                <ion-icon slot="icon-only" :icon="add" />
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script lang="ts" setup>
import { getFile } from '@/composables/useLocalSystem';
import { usePlaylist } from '@/store/usePlaylist';
import { Song } from '@/types/Song';
import { IonCard, IonImg, IonCardTitle, IonCardContent, IonCardHeader, IonCardSubtitle, IonBadge, IonButton } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
const store = usePlaylist()
const { addToPlaylist } = store
const { playlist } = storeToRefs(store)
const props = defineProps<{
    song: Song
}>()

const isInPlaylist = computed(() => playlist.value
    .some((song) => song.title === props.song.title && song.artist === props.song.artist))

const addIt = async () => {
    const file = await getFile(props.song.url)
    if (file)
        addToPlaylist({
            title: props.song.title,
            url: file,
            artwork: props.song.artwork,
            artist: props.song.artist
        })
}

</script>