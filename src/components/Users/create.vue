<template>
    <Modal :title="editing ? t('edit.user') : t('tab4.create.user')">
        <form @submit.prevent="editing ? editUser : createUser">
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col>
                        <ion-item>
                            <ion-input :label="t('login.email')" label-placement="floating" v-model="data.email" />
                        </ion-item>
                        <ion-item>
                            <ion-input :label="t('login.password')" type="password" label-placement="floating"
                                v-model="data.password" />
                        </ion-item>
                        <ion-item>
                            <ion-input :label="t('signin.repeat.pass')" type="password" label-placement="floating"
                                v-model="data.repeatedPassword" />
                        </ion-item>
                        <ion-item>
                            <ion-input :label="t('signin.username')" label-placement="floating"
                                v-model="data.fullName" />
                        </ion-item>
                        <div class="w-100 flex-align-center">
                            <ion-button expand="block" type="submit">{{ editing ? t('edit.user') : t('tab4.create.user') }}</ion-button>
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </form>
    </Modal>
</template>
<script lang="ts" setup>
import Auth from '@/APIService/auth';
import Modal from '@/layout/modal.vue';
import { User } from '@/types/User';
import { IonButton, IonList, IonLabel, IonGrid, IonRow, IonCol, IonInput, modalController, IonItem, toastController } from '@ionic/vue';
import { computed, ComputedRef, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const props = defineProps<{
    userData?: Partial<User>
}>()

const data = reactive({
    fullName: '',
    email: '',
    password: '',
    repeatedPassword: ''
})

const dismiss = () => {
    modalController.dismiss()
}
const editing: ComputedRef<boolean> = computed(() => !!props.userData)
const createUser = async () => {
    try {
        const user = await Auth.register(data.email, data.password, data.fullName)
        dismiss()
    } catch (error: any) {
        const toast = await toastController.create({
            message: t('server.error.create.user'),
            duration: 2000,
            color: 'danger'
        })
        await toast.present()
    }
}
const editUser = async () => {
    try {
        if (props.userData?.id) {
            const user = await Auth.updateUser(props.userData?.id, { email: data.email, password: data.password, fullName: data.fullName })
            modalController.dismiss("", "confirm")
        }
    } catch (error: any) {
        const toast = await toastController.create({
            message: t('server.error.edit.user'),
            duration: 2000,
            color: 'danger'
        })
        await toast.present()
    }
}
onMounted(async () => {
    if (editing.value)
        if (props.userData)
            if (props.userData.id) {
                try {
                    const user = await Auth.getUser(props.userData?.id)
                    data.email = user.email
                    data.fullName = user.fullName
                } catch (error) {
                    const toast = await toastController.create({
                        message: t('server.error.get.user'),
                        color: "warning",
                        duration: 2000
                    })
                    await toast.present()
                }
            }
})
</script>
<style>
.w-100 {
    width: 100%;
}
</style>
<style scoped>
.flex-align-center {
    display: flex;
    justify-content: center;
    margin: 10px;
}
</style>