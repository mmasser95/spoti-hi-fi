<template>
    <Modal :title="artist.name">
        <ion-grid>
            <ion-row class="ion-justify-content-center">
                <ion-col v-for="item in artist.songs" :key="item.id" size="6" size-sm="5" size-md="4">
                    <LocalCard :song="item" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </Modal>
</template>
<script lang="ts" setup>
import { ArtistResult } from '@/types/SearchResults';
import { IonGrid, IonRow, IonCol } from '@ionic/vue';
import LocalCard from '../LocalCard.vue';
import Modal from '@/layout/modal.vue';
defineProps<{ artist: ArtistResult }>()
</script>