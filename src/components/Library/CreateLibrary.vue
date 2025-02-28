<template>
    <Modal :title="editing ? t('edit.library') : t('create.library')">
        <form @submit.prevent="()=>editing ? editLibrary() : submitLibrary()">
            <ion-item>
                <ion-input label-placement="floating" :label="t('name')" v-model="name" />
            </ion-item>
            <ion-item>
                <ion-input label-placement="floating" :label="t('folder.name')" v-model="paths" />
            </ion-item>
            <ion-button type="submit" expand="block">
                <ion-icon slot="start" :icon="editing ? pencilOutline : add" />
                {{ editing ? t('edit.library') : t('create.library') }}
            </ion-button>
        </form>
    </Modal>
</template>
<script lang="ts" setup>
import Library from '@/APIService/library';
import Modal from '@/layout/modal.vue';
import { IonItem, IonInput, IonButton, IonIcon, modalController, toastController } from '@ionic/vue';
import { add, pencilOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const name = ref<string>("")
const paths = ref<string>("")
const props = defineProps<{
    libraryId?: number
}>()
const { t } = useI18n()
const editing = computed(() => !!props.libraryId)
const submitLibrary = async () => {
    try {
        await Library.createLibrary(name.value, paths.value)
        modalController.dismiss("", "confirm")
    } catch (error) {
        const toast = await toastController.create({
            message: t("server.error.create.library"),
            color: 'danger',
            duration: 2000
        })
        await toast.present()
    }
}
const editLibrary = async () => {
    if (props.libraryId)
        try {
            await Library.updateLibrary(props.libraryId, {
                paths: paths.value,
                name: name.value
            })
            modalController.dismiss('', 'confirm')
        } catch (error) {
            const toast = await toastController.create({
                message: t("server.error.edit.library"),
                color: 'danger',
                duration: 2000
            })
            await toast.present()
        }

}
onMounted(async () => {
    if (editing.value)
        if (props.libraryId) {
            let library = await Library.getLibrary(props.libraryId)
            name.value = library.name
            paths.value = library.paths
        }
})
</script>
<style scoped>
ion-button {
    margin: 1em;
}
</style>