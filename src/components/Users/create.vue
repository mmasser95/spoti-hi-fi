<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Crear usuario</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="dismiss">
                        <ion-icon slot="icon-only" :icon="close" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
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
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import Auth from '@/APIService/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonContent, IonGrid, IonRow, IonCol, IonInput, modalController, IonItem } from '@ionic/vue';
import { close } from 'ionicons/icons';
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