import { createI18n } from "vue-i18n";
import { Preferences } from "@capacitor/preferences";
import enStrings from '@/translations/en.json'
import esStrings from '@/translations/es.json'
import catStrings from '@/translations/cat.json'
import deStrings from '@/translations/de.json'
import ptStrings from '@/translations/pt.json'
import itStrings from '@/translations/it.json'
import frStrings from '@/translations/fr.json'
import jaStrings from '@/translations/ja.json'
import zhStrings from '@/translations/zh.json'
import euStrings from '@/translations/eu.json'
import glStrings from '@/translations/gl.json'

const availableLocales = ["es", "en", "ca", "de", "pt", "it", "fr", "ja", "zh", "eu", "gl"];
const defaultLocale = "es"; // Idioma por defecto si no se encuentra otro válido

async function getPreferredLocale() {
    try {
        // Intentar obtener el idioma guardado en Preferences
        const { value: savedLocale } = await Preferences.get({ key: "language" });

        if (savedLocale && availableLocales.includes(savedLocale)) {
            return savedLocale; // Usar el idioma guardado si es válido
        }

        // Si no hay guardado, obtener el idioma del dispositivo
        const deviceLocale = navigator.language.split("-")[0]; // "es-ES" -> "es"

        if (availableLocales.includes(deviceLocale)) {
            return deviceLocale; // Usar el idioma del dispositivo si es válido
        }

        return defaultLocale; // Si no hay ninguno válido, usar español
    } catch (error) {
        console.error("Error al obtener el idioma:", error);
        return defaultLocale;
    }
}

export const i18n = createI18n({
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: {
        es: { ...esStrings },
        en: { ...enStrings },
        ca: { ...catStrings },
        de: { ...deStrings },
        pt: { ...ptStrings },
        it: { ...itStrings },
        fr: { ...frStrings },
        ja: { ...jaStrings },
        zh: { ...zhStrings },
        eu: { ...euStrings },
        gl: { ...glStrings }
    },
})

export async function initI18n() {
    const locale = await getPreferredLocale()
    i18n.global.locale = locale as 'es' | 'en' | 'ca' | 'de' | 'pt' | 'it' | 'fr' | 'ja' | 'zh' | 'eu' | 'gl';
}