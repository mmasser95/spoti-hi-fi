<template>
    <ion-content>
        <ion-grid>
            <ion-row>
                <ion-col></ion-col>
                <ion-col>
                    <ion-input v-model="query" placeholder="Hola"></ion-input>
                </ion-col>
                <ion-col></ion-col>
            </ion-row>
            <ion-row>
                <ion-col></ion-col>
                <ion-col>

                </ion-col>
                <ion-col></ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
</template>
<script lang="ts" setup>
import { External } from '@/APIService/external';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonInput } from '@ionic/vue';
import debounce from 'lodash/debounce';
import { ref, watch } from 'vue';

const query = ref("")
const search = debounce(async (v: string) => {
    if (!!v && v !== "") {
        let res = await External.searchSpotify(v)
        console.log(res);

    }
}, 1000)
watch(query, (v) => {
    search(v)
})
</script>
<style scoped></style>