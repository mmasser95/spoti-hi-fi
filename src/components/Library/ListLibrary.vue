<template>
    <Modal :title="t('tab4.manage.libraries')">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-fab slot="fixed" horizontal="end" vertical="bottom">
            <ion-fab-button @click="showCreateLibrary">
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </Modal>
</template>
<script setup lang="ts">
import Library from '@/APIService/library';
import Modal from '@/layout/modal.vue';
import { IonItem, IonList, IonButton, IonIcon, IonFab, IonFabButton, modalController, IonRefresher, IonRefresherContent, RefresherCustomEvent, toastController } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CreateLibrary from '@/components/Library/CreateLibrary.vue';

const { t } = useI18n()

const libraries = ref([])

const showLibraries = async () => {
    try {
        libraries.value = await Library.getAllLibraries()
    } catch (error) {
        const toast = await toastController.create({
            message: t('server.error.get.libraries'),
            color: 'danger',
            duration: 2000
        })
        await toast.present()
    }
}
const handleRefresh = async (event: RefresherCustomEvent) => {
    await showLibraries()
    event.target.complete()
}
const showCreateLibrary = async () => {
    const modal = await modalController.create({
        component: CreateLibrary
    })
    modal.onDidDismiss().then(async ({ role }) => {
        if (role === 'confirm')
            await showLibraries()
    })
    await modal.present()
}

onMounted(showLibraries)
</script>