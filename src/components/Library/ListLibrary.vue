<template>
    <Modal :title="t('tab4.manage.libraries')">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <ion-list v-if="libraries.length > 0">
            <ion-item v-for="library in libraries">
                <ion-label>
                    <h2>{{ library.name }}</h2>
                    <p>{{ library.paths }}</p>
                </ion-label>
                <ion-buttons slot="end">
                    <ion-button fill="clear" shape="round" color="primary" @click="() => editLibrary(library.id)">
                        <ion-icon slot="icon-only" :icon="pencilOutline" />
                    </ion-button>
                    <ion-button fill="clear" shape="round" color="danger" @click="() => deleteLibrary(library.id)">
                        <ion-icon slot="icon-only" :icon="trashOutline" />
                    </ion-button>
                </ion-buttons>
            </ion-item>
        </ion-list>
        <div class="message" v-else>
            <ion-text color="warning"> No hi ha resultats</ion-text>
        </div>

        <ion-fab slot="fixed" horizontal="end" vertical="bottom">
            <ion-fab-button @click="showCreateLibrary">
                <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </Modal>
</template>
<script setup lang="ts">
import Modal from '@/layout/modal.vue';
import { IonItem, IonList, IonButton, IonButtons, IonLabel, IonIcon, IonText, IonFab, IonFabButton, modalController, IonRefresher, IonRefresherContent, RefresherCustomEvent, toastController, alertController } from '@ionic/vue';
import { add, pencilOutline, trashOutline } from 'ionicons/icons';
import { inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CreateLibrary from '@/components/Library/CreateLibrary.vue';
import { Library as LibraryType } from '@/types/Library';
import { LibraryRepository } from '@/APIService/core/LibraryRepository';

const Library: LibraryRepository = inject('Library')!

const { t } = useI18n()

const libraries = ref<LibraryType[]>([])

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

const editLibrary = async (id: number) => {
    const modal = await modalController.create({
        component: CreateLibrary,
        componentProps: {
            libraryId: id
        }
    })
    modal.onDidDismiss().then(async ({ role }) => {
        if (role === 'confirm')
            await showLibraries()
    })
    await modal.present()
}
const deleteLibrary = async (id: number) => {
    const alert = await alertController.create({
        header: t('library.delete.header'),
        subHeader: t('library.delete.subheader'),
        message: t('library.delete.message'),
        buttons: [{ text: t('yes'), role: 'si' }, { text: t('no'), role: 'no' }]
    })
    alert.onDidDismiss().then(async ({ role }) => {
        if (role === 'si')
            try {
                await Library.deleteLibrary(id)
                await showLibraries()
            } catch (error) {
                const toast = await toastController.create({
                    message: t('server.error.delete.library'),
                    color: 'danger',
                    duration: 2000
                })
                await toast.present()
            }
    })
    await alert.present()
}
onMounted(showLibraries)
</script>

<style scoped>
.message {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
}
</style>