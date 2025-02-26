<template>
    <div class="knob-container" :style="{ width: `${size}px`, height: `${size}px` }">
        <svg :width="size" :height="size" viewBox="0 0 100 100">
            <!-- Fondo del arco -->
            <path d="M 20,80 A 40,40 0 1,1 80,80" stroke="#444" stroke-width="10" fill="transparent" />
            <!-- Arco de progreso -->
            <path :d="progressArc" stroke="#1ed760" stroke-width="10" fill="transparent" stroke-linecap="round" />
        </svg>

        <!-- Zona interactiva -->
        <div class="knob" @mousedown="startDrag" @touchstart="startDrag">
            <div class="knob-value">
                <p>{{ label }}</p>
                <div v-if="model">{{ formatFreq(model) }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps<{
    min?: number; // Frecuencia mínima (por defecto 20 Hz)
    max?: number; // Frecuencia máxima (por defecto 20 kHz)
    size?: number; // Tamaño en píxeles (por defecto 100)
    label: string;
}>();

const model = defineModel({
    type: Number
});

const emit = defineEmits(["update:modelValue"]);

// 📌 **Valores por defecto**
const minFreq = props.min ?? 20;
const maxFreq = props.max ?? 20000;
const size = props.size ?? 100;

// 🎯 **Arco SVG de progreso**
const progressArc = computed(() => {
    if (!model.value) model.value = 1000; // Frecuencia por defecto: 1 kHz

    // 🔹 Normalizar en un rango logarítmico [0,1]
    let percentage = (Math.log10(model.value) - Math.log10(minFreq)) / (Math.log10(maxFreq) - Math.log10(minFreq));
    percentage = Math.max(0, Math.min(1, percentage)); // Clampeamos a [0,1]

    // 🔹 Convertimos el porcentaje en ángulo (-135° a +135°)
    const startAngle = -220;
    const endAngle = startAngle + percentage * 270;

    // 🔹 Parámetros del arco
    const radius = 40;
    const cx = 50;
    const cy = 50;

    // 🔹 Calculamos los puntos del arco
    const xStart = cx + radius * Math.cos(startAngle * Math.PI / 180);
    const yStart = cy + radius * Math.sin(startAngle * Math.PI / 180);
    const xEnd = cx + radius * Math.cos(endAngle * Math.PI / 180);
    const yEnd = cy + radius * Math.sin(endAngle * Math.PI / 180);

    // 🔹 Determinar si el arco es grande (> 180°)
    const largeArcFlag = percentage > 0.66 ? 1 : 0;

    return `M ${xStart},${yStart} A ${radius},${radius} 0 ${largeArcFlag} 1 ${xEnd},${yEnd}`;
});

// 🎛 **Conversión entre Lineal ↔ Logarítmico**
const linearToLogFreq = (value: number) => {
    return Math.pow(10, Math.log10(minFreq) + (value / 100) * (Math.log10(maxFreq) - Math.log10(minFreq)));
};

const logToLinearFreq = (value: number) => {
    return ((Math.log10(value) - Math.log10(minFreq)) / (Math.log10(maxFreq) - Math.log10(minFreq))) * 100;
};

// 📦 **Manejo del arrastre**
const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    const getPosition = (e: MouseEvent | TouchEvent) => {
        const touch = "touches" in e ? e.touches[0] : e;
        return { x: touch.clientX, y: touch.clientY };
    };

    const { y: startY } = getPosition(event);
    const startValue = model.value ?? 1000;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const { y: moveY } = getPosition(moveEvent);
        const delta = (startY - moveY) * 0.5; // Sensibilidad

        let newLinearValue = Math.min(
            Math.max(logToLinearFreq(startValue) + delta, 0),
            100
        );

        emit("update:modelValue", linearToLogFreq(newLinearValue));
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

// 📏 **Formateador de Frecuencia**
const formatFreq = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${Math.round(value)} Hz`;
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: radial-gradient(circle, #666, #222);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;
}

.knob-value {
    font-size: 14px;
    color: white;
    text-align: center;
    z-index: 1;
}
</style>
