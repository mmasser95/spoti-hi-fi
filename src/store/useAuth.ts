import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useAuth = defineStore('auth', () => {
    const url = ref<string>("http://192.168.1.23:3333")
    const token = ref<string>("")
    const username = ref<string>("")
    const isAuth = computed(() => !!token.value && token.value !== "")

    const login = async (newToken: string, newUsername: string) => {
        token.value = newToken
        username.value = newUsername
        await Preferences.set({
            key: "token",
            value: newToken
        })
        await Preferences.set({
            key: "username",
            value: newUsername
        })
    }

    const logout = async () => {
        token.value = ""
        username.value = ""
        await Preferences.remove({ key: 'token' })
        await Preferences.remove({ key: 'username' })
    }

    const loadUserData = async () => {
        const storedToken = await Preferences.get({ key: "token" })
        const storedUsername = await Preferences.get({ key: "username" })
        if (!!storedToken.value)
            token.value = storedToken.value
        if (!!storedUsername.value)
            username.value = storedUsername.value
    }

    return { url, token, username, isAuth, login, logout, loadUserData }
})