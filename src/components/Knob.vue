<template>
    <div class="knob-container" :style="{ width: `${size}px`, height: `${size}px` }" @dblclick="resetValue">
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
                <div v-if="model">{{ (formatValue ?? defaultFormat)(model) }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from "vue";

const props = defineProps<{
    // modelValue: number; // Valor en dB
    minDb?: number; // Mínimo en dB (por defecto -60)
    maxDb?: number; // Máximo en dB (por defecto 5)
    size?: number; // Tamaño en píxeles (por defecto 100)
    label: string;
    formatValue?: (value: number) => string; // Formateador opcional
}>();

const model = defineModel({
    type: Number
})

const emit = defineEmits(["update:modelValue"]);

// 🛠️ Valores por defecto
const minDb = props.minDb ?? -60;
const maxDb = props.maxDb ?? 5;
const size = props.size ?? 100;

// 🔄 **Conversión Logarítmica**
const linearToLog = (value: number) =>
    minDb + (Math.log10(1 + (value * 9) / 100) * (maxDb - minDb));

const logToLinear = (value: number) =>
    ((Math.pow(10, (value - minDb) / (maxDb - minDb)) - 1) / 9) * 100;

// 📈 **Valor logarítmico computado**
const logValue = ref(1)

// 🎯 **Arco SVG de progreso**
const progressArc = computed(() => {
    if (!model.value) model.value = 0
    // 🔹 Normalizamos el valor en un rango [0,1]
    let percentage = (model.value - minDb) / (maxDb - minDb);
    percentage = Math.max(0, Math.min(1, percentage)); // Limitamos entre 0 y 1

    // 🔹 Convertimos el porcentaje en un ángulo de -135° a +135°
    const startAngle = -220;
    const endAngle = startAngle + percentage * 270; // Máximo es +135°

    // 🔹 Definimos parámetros del arco
    const radius = 40;
    const cx = 50;
    const cy = 50;

    // 🔹 Calculamos el punto inicial del arco (-135°)
    const xStart = cx + radius * Math.cos(startAngle * Math.PI / 180);
    const yStart = cy + radius * Math.sin(startAngle * Math.PI / 180);

    // 🔹 Calculamos el punto final del arco (según porcentaje)
    const xEnd = cx + radius * Math.cos(endAngle * Math.PI / 180);
    const yEnd = cy + radius * Math.sin(endAngle * Math.PI / 180);

    // 🔹 Determinar si es un arco grande (> 180°)
    const largeArcFlag = percentage > 0.66 ? 1 : 0;

    // 🔹 Devuelve el arco SVG
    return `M ${xStart},${yStart} A ${radius},${radius} 0 ${largeArcFlag} 1 ${xEnd},${yEnd}`;
});



// 📦 **Manejo del arrastre**
const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    const getPosition = (e: MouseEvent | TouchEvent) => {
        const touch = "touches" in e ? e.touches[0] : e;
        return { x: touch.clientX, y: touch.clientY };
    };

    const { y: startY } = getPosition(event);
    const startValue = model.value ?? 0;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const { y: moveY } = getPosition(moveEvent);
        const delta = (startY - moveY) * 0.5;

        let newLinearValue = Math.min(
            Math.max(logToLinear(startValue) + delta, 0),
            100
        );

        emit("update:modelValue", linearToLog(newLinearValue));
        logValue.value = linearToLog(newLinearValue)

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

// 📏 **Formateador por defecto**
const defaultFormat = (value: number) => `${(value*100).toFixed(0)}%`;
const resetValue = () => {
    emit("update:modelValue", 1)
}
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
