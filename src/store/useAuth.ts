import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuth = defineStore('auth', () => {
    const url = ref<string>("")
    const token = ref<string>("")
    const username = ref<string>("")

    return { url, token, username }
})