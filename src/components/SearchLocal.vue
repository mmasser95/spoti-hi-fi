<template>
    <ion-content>
        <ion-grid>
            <!-- Input de búsqueda con selector -->
            <ion-row class="ion-justify-content-center ion-align-items-center">
                <ion-col size="12" size-md="4">
                    <ion-input v-model="query" placeholder="Buscar canción"></ion-input>
                </ion-col>
            </ion-row>

            <!-- Resultados -->
            <ion-row class="ion-justify-content-center">
                <ion-col v-for="item in results" :key="item.id" size="6" size-sm="4" size-md="3" size-lg="2">
                    <LocalCard :song="item" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
</template>

<script lang="ts" setup>
import { External } from '@/APIService/external';
import { IonContent, IonGrid, IonRow, IonCol, IonInput } from '@ionic/vue';
import debounce from 'lodash/debounce';
import { onMounted, ref, watch } from 'vue';
import LocalCard from '@/components/LocalCard.vue';
import { LocalSong } from '@/types/LocalElements';


const query = ref("");
const results = ref<LocalSong[]>()

const searchWithoutDebounce = async (v: string) => {
    if (!v) return;
    results.value = await External.getLocalSongs()
}
const search = debounce(searchWithoutDebounce, 600);

watch(query, () => {
    search(query.value);
});

onMounted(() => searchWithoutDebounce("s"))
</script>

<style scoped>
ion-segment {
    max-width: 200px;
}
</style>
