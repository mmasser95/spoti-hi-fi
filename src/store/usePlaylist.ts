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
    const currentTime = ref(0)
    const currentSong = computed(() => playlist.value ? playlist.value[currentIndex.value] : {
        url: "",
        title: "",
        artist: ""
    })
    const isShuffling = ref(false)
    const isRepeating = ref(false)
    const duration = ref(0)

    const mySto = ref()

    let animationFrame: number | null = null;
    const playAudio = () => {
        if (!!currentSong.value) {
            isMid.value = true
            // isPlaying.value = true
            player.value?.play()
        }
    }

    const pauseAudio = () => {
        // isPlaying.value = false
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
            if (isShuffling.value) {
                index = Math.floor(Math.random() * playlist.value.length);
            } else {
                index += 1
                index %= playlist.value.length
            }
            currentIndex.value = index
        }
    }

    const prev = () => {
        if (playlist.value) {
            let index = currentIndex.value
            if (isShuffling.value) {
                index = Math.floor(Math.random() * playlist.value.length);
            } else {
                index -= 1;
                if (index < 0) index = playlist.value.length - 1;
            }
            currentIndex.value = index
        }
    }

    const seek = (to: number) => {
        player.value?.seek(to)
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
        if (details.seekTime && player.value) {
            player.value?.seek(details.seekTime)
            currentTime.value = details.seekTime
        }
    })

    const addToPlaylist = (song: Song) => {
        playlist.value?.push(song)
    }

    const updateMediaSession = () => {
        if (currentSong.value)
            MediaSession.setMetadata({
                title: currentSong.value.title || "Desconocido",
                artist: currentSong.value.artist || "Desconocido",
                artwork: [{ src: currentSong.value.artwork || "generic-cover.webp" }],
            })
    }

    watch(isPlaying, (v) => {
        const playbackState = isMid.value ? (v ? "playing" : "paused") : "none"
        MediaSession.setPlaybackState({
            playbackState
        })
    })
    const loadTrack = (value: { url: string, title: string, artist?: string, artwork?: string }) => {
        player.value = new Howl({
            src: value.url,
            html5: true,
            onload: () => {
                duration.value = player.value?.duration() || 0
            },
            onplay: () => {
                isPlaying.value = true
                updateMediaSession()
                updateTime()
                mySto.value = setInterval(updateTimeMediaSession, 1000)
            },
            onpause: () => {
                isPlaying.value = false;
                updateMediaSession()
                if (animationFrame) cancelAnimationFrame(animationFrame)
                if (!!mySto.value) clearInterval(mySto.value)
            },
            onend: () => {
                isPlaying.value = false
                player.value?.seek(0)
                if (animationFrame) cancelAnimationFrame(animationFrame)
                if (!!mySto.value) clearInterval(mySto.value)
                if (!isRepeating.value)
                    next()
                playAudio()
            }
        })
    }
    watch(currentSong, (value) => {
        if (!!value && value.url !== "") {
            if (!!player.value)
                player.value.unload()
            loadTrack(value)
            updateMediaSession()
            if (isPlaying.value && player.value) {
                player.value.play()
            } else {
                if (isMid.value)
                    isMid.value = false
            }
        }
    })

    onMounted(() => {
        if (!!currentSong.value && currentSong.value.url !== "") {
            loadTrack(currentSong.value)
            updateMediaSession()
        }
    })

    const updateTime = () => {
        if (!player.value) return;

        currentTime.value = player.value.seek() as number;
        animationFrame = requestAnimationFrame(updateTime);
    };

    const updateTimeMediaSession = () => {
        if (!player.value) return
        MediaSession.setPositionState({
            duration: player.value.duration(),
            playbackRate: 1.0,
            position: currentTime.value
        })
    }

    const toggleShuffle = () => {
        isShuffling.value = !isShuffling.value
    }
    const toggleRepeat = () => {
        isRepeating.value = !isRepeating.value
    }

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
        updateMediaSession,
        toggleRepeat,
        toggleShuffle,
        seek,
        currentTime,
        isShuffling,
        isRepeating,
        duration,
        playlist,
        currentIndex
    }
})