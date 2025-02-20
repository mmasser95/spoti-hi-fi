import { getIds } from "@/composables/useLocalSystem";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export default defineStore('useLocal', () => {
    const localIds = ref<number[]>()

    onMounted(async () => {
        if (!localIds.value) {
            localIds.value = await getIds()
        }
    })

    const isDownloaded = (id: number) => localIds.value?.includes(id)

    const addIdToDownloaded = (id: number) => {
        if (!localIds.value?.includes(id))
            localIds.value?.push(id)
    }

    return { isDownloaded, addIdToDownloaded }
})