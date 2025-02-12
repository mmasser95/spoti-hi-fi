import { Song } from "@/types/Song";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePlaylist = defineStore("Playlist", () => {
    const playlist = ref<Song[]>([])
    const currentIndex = ref<number>(0)
    const currentSong = computed(() => playlist.value ? playlist.value[currentIndex.value] : {
        url: "",
        title: "",
        artist: ""
    })
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

    const addToPlaylist = (song: Song) => {
        playlist.value?.push(song)
    }

    return {
        currentSong,
        next,
        prev,
        addToPlaylist
    }
})