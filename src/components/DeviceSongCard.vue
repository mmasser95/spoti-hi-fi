<template>
    <ion-card>
        <ion-img :src="song.artwork" :alt="song.title" />
        <ion-card-header>
            <ion-card-title>{{ song.title }}</ion-card-title>
            <ion-card-subtitle>{{ song.artist }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex-align-center">
            <ion-badge v-if="isInPlaylist" color="warning">{{ t('badge.added') }}</ion-badge>
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
import { IonCard, IonImg, IonCardTitle, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonBadge, IonButton } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const store = usePlaylist()
const { addToPlaylist } = store
const { playlist } = storeToRefs(store)
const props = defineProps<{
    song: Song
}>()

const isInPlaylist = computed(() => playlist.value
    .some((song) => song.id === props.song.id))

const addIt = async () => {
    const file = await getFile(props.song.url)
    if (file)
        addToPlaylist({
            id: props.song.id,
            title: props.song.title,
            url: file,
            artwork: props.song.artwork,
            artist: props.song.artist
        })
}

</script>