import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuth = defineStore('auth', () => {
    const url = ref<string>("http://192.168.1.23:3333")
    const token = ref<string>("")
    const username = ref<string>("")

    return { url, token, username }
})