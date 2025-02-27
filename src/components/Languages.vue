<template>
    <!-- <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{{ $t('tab4.lang') }}</IonTitle>
        </IonToolbar>
      </IonHeader>
  
      <IonContent>
        <IonList>
          <IonItem
            v-for="(language, code) in languages"
            :key="code"
            button
            @click="changeLanguage(code)"
          >
            <span :class="`fi fi-${language.flag}`" style="margin-right: 10px"></span>
            {{ language.label }}
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage> -->
    <Modal :title="t('tab4.lang')">
        <ion-list>
            <ion-item v-for="(language, code) in languages" :key="code" button @click="changeLanguage(code)">
                <span :class="`fi fi-${language.flag}`"></span>
                {{ language.label }}
            </ion-item>
        </ion-list>
    </Modal>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Preferences } from "@capacitor/preferences";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue';
import Modal from "@/layout/modal.vue";
import "/node_modules/flag-icons/css/flag-icons.min.css";
const { locale, t } = useI18n();

const languages = {
    ca: { label: "Català", flag: "es-ct" },
    eu: { label: "Euskara", flag: "es-pv" },
    gl: { label: "Galego", flag: "es-ga" },
    es: { label: "Español", flag: "es" },
    en: { label: "English", flag: "gb" },
    de: { label: "Deutsch", flag: "de" },
    pt: { label: "Português", flag: "pt" },
    it: { label: "Italiano", flag: "it" },
    fr: { label: "Français", flag: "fr" },
    ja: { label: "日本語", flag: "jp" },
    zh: { label: "中文", flag: "cn" },
};

const changeLanguage = async (code: string) => {
    locale.value = code;
    await Preferences.set({ key: "language", value: code });
};
</script>

<style>
/* Ajusta el tamaño de las banderas */
.fi {
    font-size: 24px;
    margin: 15px;
}
</style>