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
import { storeToRefs } from 'pinia';
import Knob from '@/components/Knob.vue';
import KnobFreq from '@/components/KnobFreq.vue';
const { bands } = storeToRefs(useEq())


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