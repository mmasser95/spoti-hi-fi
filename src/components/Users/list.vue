<template>
    <Modal :title="t('tab4.manage.users')">
        <ion-list>
            <ion-item v-for="user in users" :key="user.id">
                <ion-label>{{ user.fullName }}</ion-label>
                <ion-buttons slot="end">
                    <ion-button fill="clear" shape="round" color="primary">
                        <ion-icon slot="icon-only" :icon="pencilOutline" />
                    </ion-button>
                    <ion-button fill="clear" shape="round" color="danger">
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
import { IonList, IonItem, IonButton, IonLabel, IonIcon, IonButtons } from '@ionic/vue';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const users = ref<User[]>()
onMounted(async () => {
    users.value = await Auth.listUsers()
})
</script>