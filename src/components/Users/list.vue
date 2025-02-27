<template>
    <Modal :title="t('tab4.manage.users')">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-list>
            <ion-item v-for="user in users" :key="user.id">
                <ion-label>{{ user.fullName }}</ion-label>
                <ion-buttons slot="end">
                    <ion-button fill="clear" shape="round" color="primary" @click="() => showEditUser(user)">
                        <ion-icon slot="icon-only" :icon="pencilOutline" />
                    </ion-button>
                    <ion-button fill="clear" shape="round" color="danger" @click="() => deleteUser(user.id)">
                        <ion-icon slot="icon-only" :icon="trashOutline" />
                    </ion-button>
                </ion-buttons>
            </ion-item>
        </ion-list>
    </Modal>
</template>
<script lang="ts" setup>
import Auth from '@/APIService/auth';
import Modal from '@/layout/modal.vue';
import { User } from '@/types/User';
import { IonList, IonItem, IonButton, IonLabel, IonIcon, IonButtons, toastController, IonRefresher, IonRefresherContent, RefresherCustomEvent, modalController, alertController } from '@ionic/vue';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Create from './create.vue';

const { t } = useI18n()
const users = ref<User[]>()

const showUsers = async () => {
    try {
        users.value = await Auth.listUsers()
    } catch (error) {
        const toast = await toastController.create({
            message: t('server.error.get.users'),
            color: 'danger',
            duration: 2000
        })
        await toast.present()
    }
}
const handleRefresh = async (event: RefresherCustomEvent) => {
    await showUsers()
    event.target.complete()
}

const showEditUser = async (userData: User) => {
    const modal = await modalController.create({
        component: Create,
        componentProps: {
            userData
        }
    })
    await modal.present()
}

const deleteUser = async (id: number) => {
    const alert = await alertController.create({
        header: t('user.delete.header'),
        subHeader: t('user.delete.subheader'),
        message: t('user.delete.message'),
        buttons: [{ text: t('yes'), role: 'si' }, { text: t('no'), role: 'no' }]
    })

    alert.onDidDismiss().then(async ({ role }) => {
        if (role === 'si') {
            try {
                await Auth.deleteUser(id)
            } catch (error) {
                const toast = await toastController.create({
                    message: t('server.error.delete.user'),
                    color: 'danger',
                    duration: 2000
                })
                await toast.present()
            }
        }
    })
    await alert.present()
}

onMounted(showUsers)
</script>