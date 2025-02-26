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
        minFreq:number,
        maxFreq:number
    }[]>([
        { id: 0, label: "Bass",maxFreq:400, minFreq:20, frequency: 200, type: "lowshelf", gain: 0 },
        { id: 1, label: "BassMid",maxFreq:800, minFreq:400, frequency: 500, type: "peaking", gain: 0 },
        { id: 2, label: "Mid",maxFreq:2500, minFreq:800, frequency: 1000, type: "peaking", gain: 0 },
        { id: 3, label: "MidHigh",maxFreq:7500, minFreq:2500, frequency: 5000, type: "peaking", gain: 0 },
        { id: 4, label: "High",maxFreq:20000, minFreq:7500, frequency: 10000, type: "highshelf", gain: 0 },
    ]);

    watch(bands, (newBands) => {
        newBands.forEach((band, index) => {
            if (filters.value[index]) {
                filters.value[index].gain.setValueAtTime(band.gain, audioCtx.value!.currentTime)
                filters.value[index].frequency.setValueAtTime(band.frequency, audioCtx.value!.currentTime)
            }
        })
    }, { deep: true })

    const filters = ref<BiquadFilterNode[]>([])

    const initFilters = (audioNode: MediaElementAudioSourceNode) => {
        if (!audioCtx.value) return;
        console.log("Init filters");
        // Crear los filtros
        filters.value = bands.value.map(band => {
            const filter = audioCtx.value!.createBiquadFilter();
            filter.type = band.type;
            filter.frequency.value = band.frequency;
            filter.gain.value = band.gain;
            return filter;
        });

        // Si no hay filtros, conectar directamente el audioNode al destino
        if (filters.value.length === 0) {
            console.warn("No hay filtros, conectando directamente al destino");
            audioNode.connect(audioCtx.value.destination);
            return;
        }

        // Conectar audioNode al primer filtro
        audioNode.connect(filters.value[0]);

        // Conectar filtros en cadena
        for (let i = 0; i < filters.value.length - 1; i++) {
            filters.value[i].connect(filters.value[i + 1]);
        }

        // Conectar el último filtro a la salida de audio
        filters.value[filters.value.length - 1].connect(audioCtx.value.destination);
    }


    return {
        audioCtx,
        bands,
        filters,
        initFilters,
    }
})