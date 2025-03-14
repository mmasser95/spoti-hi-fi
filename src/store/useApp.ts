import { testServer } from "@/APIService/utils";
import providers from "@/plugins/providers";
import { defineStore } from "pinia";
import { App, onMounted, ref, watch } from "vue";

export default defineStore('App', () => {
    const myApp = ref<App>()
    const serverError = ref<boolean>(false)
    const test = async () => {
        serverError.value = ! await testServer()
    }
    test()
    watch(serverError, (v) => {
        if (myApp.value) {
            providers(myApp.value, v)
        }
    })
    return { myApp, test, serverError }
})