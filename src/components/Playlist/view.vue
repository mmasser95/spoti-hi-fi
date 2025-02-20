<template>

</template>
<script lang="ts" setup>
import Playlist from '@/APIService/playlist';
import { LocalPlaylist } from '@/types/Playlist';
import { onMounted, ref } from 'vue';
const playlist = ref<LocalPlaylist>()
const props = defineProps<{ id: number }>()
onMounted(async () => {
    playlist.value = await Playlist.getPlaylist(props.id)
})
</script>