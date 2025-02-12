import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePlaylist = defineStore("Playlist", () => {
    const playlist = ref<string[]>([])
    const currentIndex = ref<number>(0)
    const currentUrl = computed(() => playlist.value ? playlist.value[currentIndex.value] : "")
    const next = () => {
        if (playlist.value) {
            let index = currentIndex.value
            index += 1
            currentIndex.value = index % playlist.value.length
        }
    }
    const prev = () => {
        if (playlist.value) {
            let index = currentIndex.value
            index -= 1
            if (index < 0)
                index = playlist.value?.length - 1
            currentIndex.value = index
        }
    }

    const addToPlaylist = (url: string) => {
        playlist.value?.push(url)
    }

    return {
        currentUrl,
        next,
        prev,
        addToPlaylist
    }
})