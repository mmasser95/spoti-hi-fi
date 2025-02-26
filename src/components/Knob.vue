<template>
    <div class="knob-container">
        <div class="knob" :style="knobStyle" @mousedown="startDrag" @touchstart="startDrag">
            <!-- <div class="knob-value">
                {{(formatValue ?? ((v) => v.toFixed(1) + " dB"))(logValue)}}
            </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps<{
    modelValue: number; // Valor en dB
    minDb?: number; // Mínimo en dB (-∞ simulado como -60dB)
    maxDb?: number; // Máximo en dB (5dB por defecto)
    size?: number; // Tamaño del knob
    formatValue?: (value: number) => string; // Formateador del valor
}>();

const emit = defineEmits(["update:modelValue"]);

// 🔢 **Definimos los rangos**
const minLinear = 0;
const maxLinear = 100;
const minDb = props.minDb ?? -60;
const maxDb = props.maxDb ?? 0;

// 🔄 **Conversión Lineal ↔ Logarítmico**
const linearToLog = (value: number) =>
    minDb + (value / maxLinear) * (maxDb - minDb);
const logToLinear = (value: number) =>
    ((value - minDb) / (maxDb - minDb)) * maxLinear;

const logValue = computed(() => linearToLog(props.modelValue));

const knobStyle = computed(() => ({
    transform: `rotate(${(props.modelValue / maxLinear) * 270 - 135}deg)`,
    width: `${props.size ?? 80}px`,
    height: `${props.size ?? 80}px`,
}));

// 🎛 **Manejo del arrastre**
const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    const getPosition = (e: MouseEvent | TouchEvent) => {
        const touch = "touches" in e ? e.touches[0] : e;
        return { x: touch.clientX, y: touch.clientY };
    };

    const { y: startY } = getPosition(event);
    const startValue = props.modelValue;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const { y: moveY } = getPosition(moveEvent);
        const delta = (startY - moveY) * 0.5; // **Ajustamos la sensibilidad**

        let newLinearValue = Math.min(
            Math.max(logToLinear(startValue) + delta, minLinear),
            maxLinear
        );

        emit("update:modelValue", linearToLog(newLinearValue));
    };

    const onEnd = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
};
</script>

<style scoped>
.knob-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.knob {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: radial-gradient(circle, #666, #222);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: grab;
    position: relative;
    transition: transform 0.1s linear;
}

.knob-value {
    font-size: 14px;
    color: white;
    position: absolute;
    text-align: center;
    transform: rotate(0deg);
    /* ✅ **Evita que el texto rote con el knob** */
    z-index: 1;
}
</style>