import { Song } from "@/types/Song";
import { MediaSession } from "@jofr/capacitor-media-session";
import { Howl } from "howler";
import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";

export const usePlaylist = defineStore("Playlist", () => {
    const player = ref<Howl>()
    const isPlaying = ref(false)
    const isMid = ref(false)
    const playlist = ref<Song[]>([])
    const currentIndex = ref<number>(0)
    const currentSong = computed(() => playlist.value ? playlist.value[currentIndex.value] : {
        url: "",
        title: "",
        artist: ""
    })

    const playAudio = () => {
        if (!!currentSong.value) {
            isMid.value = true
            isPlaying.value = true
            player.value?.play()
        }
    }

    const pauseAudio = () => {
        isPlaying.value = false
        player.value?.pause()
    }

    const stopAudio = () => {
        isMid.value = false
        isPlaying.value = false
        player.value?.stop()
    }

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

    MediaSession.setActionHandler({ action: "play" }, () => {
        playAudio()
    })
    
    MediaSession.setActionHandler({ action: "pause" }, () => {
        pauseAudio()
    })
    
    MediaSession.setActionHandler({ action: "nexttrack" }, () => {
        next()
    })
    
    MediaSession.setActionHandler({ action: "previoustrack" }, () => {
        prev()
    })
    MediaSession.setActionHandler({ action: "seekto" }, (details) => {
        if (details.seekTime)
            player.value?.seek(details.seekTime)
    })

    const addToPlaylist = (song: Song) => {
        playlist.value?.push(song)
    }

    const updateMediaSession = () => {
        MediaSession.setMetadata({
            title: currentSong.value.title,
            artist: currentSong.value.artist || "Desconocido",
        })
    }

    watch(isPlaying, (v) => {
        const playbackState = isMid.value ? (v ? "playing" : "paused") : "none"
        MediaSession.setPlaybackState({
            playbackState
        })
    })

    watch(currentSong,(value)=>{
        if (!!value && value.url !== "") {
            if (!!player.value)
                player.value.unload()
            player.value = new Howl({
                src: value.url,
                html5: true
            })
            if (isPlaying.value) {
                player.value.play()
            } else {
                if (isMid.value)
                    isMid.value = false
            }
        }
    })

    onMounted(() => {
        if (!!currentSong.value && currentSong.value.url !== "")
            player.value = new Howl({
                src: currentSong.value.url,
                html5: true
            })
    })

    return {
        currentSong,
        isPlaying,
        isMid,
        playAudio,
        pauseAudio,
        stopAudio,
        next,
        prev,
        addToPlaylist,
        updateMediaSession
    }
})