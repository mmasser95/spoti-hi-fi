<template>
    <Modal title="Ecualizador">
        <div class="w-100 flex-align-center mt-2">
            <ion-button color="danger" fill="outline" shape="round" @click="resetAll">
                <ion-icon :icon="refresh" slot="icon-only" />
            </ion-button>
        </div>
        <!-- <ion-range v-for="(band, index) in bands" label-placement="stacked" :label="band.label" :key="band.frequency"
            :min="0" :max="100" pin :pin-formatter="formatter" :value="logToLinear(band.gain)"
            @ion-change="(e) => updateBand(e.detail, index)" /> -->
        <div class="eq-band" v-for="(band, index) in bands" :key="band.id">
            <ion-label class="eq-info">{{ band.label }} __ {{ band.gain.toFixed(2) }}dB __ <ion-button size="small"
                    fill="outline" shape="round" @click="() => band.gain = 0">
                    <ion-icon slot="icon-only" :icon="refresh" />
                </ion-button>
            </ion-label>

            <Knob v-model="band.gain" :min-db="-35" :max-db="5" :format-value="formatter" />
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/layout/modal.vue';
import { useEq } from '@/store/useEq';
import { IonLabel, RangeChangeEventDetail, IonButton, IonIcon } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import Knob from '@/components/Knob.vue';
import { refresh } from 'ionicons/icons';

const { bands } = storeToRefs(useEq())

const linearToLog = (value: number) => 5 + 20 * Math.log10((value + 1) / 100)
const logToLinear = (value: number) => Math.max(0, (Math.pow(10, (value - 5) / 20) * 100) - 1)

const updateBand = (e: RangeChangeEventDetail, index: number) => {
    console.log(`Index: ${index}, Valor linear: ${e.value} Valor logaritmico: ${linearToLog((e.value as number))}`);
    const logValue = linearToLog(e.value as number)
    bands.value[index].gain = logValue
}

const formatter = (v: number) => {
    console.log(v);

    return v.toFixed(2)
}

const resetAll = () => {
    bands.value.forEach(band => band.gain = 0)
}

</script>
<style scoped>
.eq-band {
    margin: 0px 20px;
}

.eq-info {
    display: flex;
    align-items: center;
    gap: 10px
}

ion-range {
    margin-left: 20px;
    margin-right: 20px;
}

ion-range::part(pin) {
    font-size: 8px;
    /* Reduce el tamaño del número */
    padding: 12px;
    /* Ajusta el padding del pin */
}
</style>