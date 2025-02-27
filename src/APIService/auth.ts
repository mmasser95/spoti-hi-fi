import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { getAuthHeaders, getHeaders } from "./utils";
import { User } from "@/types/User";

export default class Auth {

    private static url: Ref<string> = storeToRefs(useAuth()).url
    // private static token: Ref<string> = storeToRefs(useAuth()).token

    public static async login(email: string, password: string) {
        const res = await fetch(`${this.url.value}/login`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                email,
                password
            })
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data: {
            token: {
                token: string
            },
            "$attributes": {
                fullName: string,
                email: string
            }
        } = await res.json()
        return data
    }
    public static async refreshToken() {
        const res = await fetch(`${this.url.value}/refresh`, {
            method: "GET",
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            return false
        }
        let data: {
            token: string
        } = await res.json()
        // this.token.value = data.token
        return true
    }
    public static async register(email: string, password: string, fullName: string) {
        const res = await fetch(`${this.url.value}/signin`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                email,
                password,
                fullName
            })
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data = await res.json()
        return data
    }

    public static async listUsers() {
        const res = await fetch(`${this.url.value}/users`, {
            method: "GET",
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data: User[] = await res.json()
        return data
    }
}