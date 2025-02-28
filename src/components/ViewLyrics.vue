<template>
    <Modal :title="t('lyrics.modal')">
        <div class="lyrics" v-if="lyrics">
            <p v-for="(line, i) in lyrics" :key="i">
                <ion-text>
                    {{ line }}
                </ion-text>
            </p>
        </div>
        <div v-else>
            <div class="loader" v-if="loading">
                <ion-spinner color="primary"></ion-spinner>
                <ion-label color="primary">{{ t('lyrics.loading') }} {{ title }}</ion-label>
            </div>
            <div class="loader" v-else>
                <ion-text color="warning">
                    {{ t('lyrics.not.found') }}
                </ion-text>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { External } from '@/APIService/external';
import Modal from '@/layout/modal.vue';
import { IonSpinner, IonLabel, toastController, IonText } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const props = defineProps<{
    artists: string,
    title: string
}>()
const lyrics = ref<string[]>()
const loading = ref<boolean>(true)
onMounted(async () => {
    try {
        let principalArtist=props.artists.split(', ')[0]
        let lyricsWithoutTags = await External.getLyrics(principalArtist, props.title)
        lyrics.value = lyricsWithoutTags.split('\n')
    } catch (error) {
        const toast = await toastController.create({
            message: t('lyrics.not.found'),
            color: 'warning',
            duration: 2000
        })
        await toast.present()
    } finally {
        loading.value = false
    }
})
</script>
<style scoped>
.lyrics {
    margin-left: 10px;
}

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 6em;
    gap: 20px
}
</style>