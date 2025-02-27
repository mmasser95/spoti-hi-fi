import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useEq = defineStore("Eq", () => {
    const audioCtx = ref<AudioContext>(new AudioContext())
    const bands = ref<{
        id: number,
        label: string,
        frequency: number,
        type: BiquadFilterType,
        gain: number,
        minFreq: number,
        maxFreq: number
    }[]>([
        { id: 0, label: "Bass", maxFreq: 400, minFreq: 20, frequency: 200, type: "lowpass", gain: 1 },
        { id: 1, label: "BassMid", maxFreq: 800, minFreq: 400, frequency: 500, type: "bandpass", gain: 1 },
        { id: 2, label: "Mid", maxFreq: 2500, minFreq: 800, frequency: 1000, type: "bandpass", gain: 1 },
        { id: 3, label: "MidHigh", maxFreq: 7500, minFreq: 2500, frequency: 5000, type: "bandpass", gain: 1 },
        { id: 4, label: "High", maxFreq: 20000, minFreq: 7500, frequency: 10000, type: "highpass", gain: 1 },
    ]);

    watch(bands, (newBands) => {
        newBands.forEach((band, index) => {
            if (filters.value[index]) {
                filters.value[index].gain.gain.setValueAtTime(band.gain, audioCtx.value!.currentTime)
                filters.value[index].filter.frequency.setValueAtTime(band.frequency, audioCtx.value!.currentTime)
            }
        })
    }, { deep: true })

    const filters = ref<{
        filter: BiquadFilterNode,
        gain: GainNode
    }[]>([])

    const initFilters = (audioNode: MediaElementAudioSourceNode) => {
        if (!audioCtx.value) return;
        console.log("Init filters");
        // Crear los filtros
        filters.value = bands.value.map(band => {
            const filter = audioCtx.value!.createBiquadFilter();
            filter.type = band.type;
            filter.frequency.value = band.frequency;
            // filter.gain.value = band.gain;
            const gain = audioCtx.value.createGain();
            gain.gain.value = band.gain;
            return { filter, gain };
        });

        // Conectar vias en paralelo

        filters.value.forEach(filter => {
            audioNode.connect(filter.filter)
            filter.filter.connect(filter.gain)
            filter.gain.connect(audioCtx.value.destination)
        })
    }


    return {
        audioCtx,
        bands,
        filters,
        initFilters,
    }
})