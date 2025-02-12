import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { Ref } from "vue";

export default class Auth {

    private static url: Ref<string> = storeToRefs(useAuth()).url

    public static async login(email: string, password: string) {
        const res = await fetch(`${this.url.value}/login`, {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data = await res.json()
        return data
    }
}