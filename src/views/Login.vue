<template>
    <ion-page>
        <ion-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col size="12" size-sm="8" size-md="6">
                        <form @submit.prevent="doLogin">
                            <ion-row>
                                <ion-col>
                                    <ion-input label="URL" v-model="url" label-placement="floating"></ion-input>
                                </ion-col>
                            </ion-row>
                            <ion-row>
                                <ion-col>
                                    <ion-input :label="t('login.email')" v-model="username"
                                        label-placement="floating"></ion-input>
                                </ion-col>
                            </ion-row>
                            <ion-row>
                                <ion-col>
                                    <ion-input :label="t('login.password')" v-model="password"
                                        :type="showPassword ? 'text' : 'password'" label-placement="floating">
                                        <ion-button fill="clear" slot="end" aria-label="Show/hide"
                                            @click="() => showPassword = !showPassword">
                                            <ion-icon slot="icon-only" :icon="showPassword ? eye : eyeOff"
                                                aria-hidden="true"></ion-icon>
                                        </ion-button>
                                    </ion-input>
                                </ion-col>
                            </ion-row>
                            <ion-row class="ion-justify-content-center">
                                <ion-col size="12" size-md="6">
                                    <ion-button type="submit" expand="block">{{ t('login.submit') }}</ion-button>
                                </ion-col>
                            </ion-row>
                        </form>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import Auth from '@/APIService/auth';
import router from '@/router';
import { useAuth } from '@/store/useAuth';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { eye, eyeOff } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const store = useAuth()
const { url } = storeToRefs(store)
const { login } = store
const { t } = useI18n()
const showPassword = ref<boolean>(false)
const username = ref<string>("")
const password = ref<string>("")

const doLogin = async () => {
    let data = await Auth.login(username.value, password.value)
    await login(data.token.token, data.$attributes.fullName)
    router.push('/tabs')
}

</script>
<style scoped></style>