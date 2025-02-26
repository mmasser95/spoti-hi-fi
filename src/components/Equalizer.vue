<template>
    <Modal title="Ecualizador">
        <div class="eq-bands">
            <div class="eq-band" v-for="(band, index) in bands" :key="band.id">
                <KnobFreq v-model="band.frequency" :label="band.label" :min="band.minFreq" :max="band.maxFreq"/>
                <Knob v-model="band.gain" :min-db="-35" :max-db="5" :label="band.label"/>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/layout/modal.vue';
import { useEq } from '@/store/useEq';
import { IonLabel, RangeChangeEventDetail, IonButton, IonIcon } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import Knob from '@/components/Knob.vue';
import KnobFreq from '@/components/KnobFreq.vue';
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

.eq-bands{
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
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