<template>
    <Modal title="Crear usuario">
        <form @submit.prevent="createUser">
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col>
                        <ion-item>
                            <ion-input label="Email" label-placement="floating" />
                        </ion-item>
                        <ion-item>
                            <ion-input label="Password" type="password" label-placement="floating" />
                        </ion-item>
                        <ion-item>
                            <ion-input label="Repeat password" type="password" label-placement="floating" />
                        </ion-item>
                        <ion-item>
                            <ion-input label="Full Name" label-placement="floating" />
                        </ion-item>
                        <div class="w-100 flex-align-center">
                            <ion-button>Crear</ion-button>
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
import { IonButton, IonIcon, IonGrid, IonRow, IonCol, IonInput, modalController, IonItem } from '@ionic/vue';
import { reactive } from 'vue';

const data = reactive({
    fullName: '',
    email: '',
    password: '',
    repeatedPassword: ''
})

const dismiss = () => {
    modalController.dismiss()
}

const createUser = async () => {
    const user = await Auth.register(data.email, data.password, data.fullName)
    console.log(user);
    dismiss()
}
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