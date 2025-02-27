<template>
    <Modal :title="t('create.library')">
        <form @submit.prevent="submitLibrary">
            <ion-item>
                <ion-input label-placement="floating" :label="t('name')" />
            </ion-item>
            <ion-item>
                <ion-input label-placement="floating" :label="t('folder.name')" />
            </ion-item>
            <ion-button type="submit" expand="block">
                <ion-icon slot="start" :icon="add" />
                {{ t('create.library') }}
            </ion-button>
        </form>
    </Modal>
</template>
<script lang="ts" setup>
import Library from '@/APIService/library';
import Modal from '@/layout/modal.vue';
import { IonItem, IonInput, IonButton, IonIcon, modalController, toastController } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const name = ref<string>("")
const folderName = ref<string>("")
const { t } = useI18n()
const submitLibrary = async () => {
    try {
        await Library.createLibrary(name.value, folderName.value)
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
</script>
<style scoped>
ion-button {
    margin: 1em;
}
</style>