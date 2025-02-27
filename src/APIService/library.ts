import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { getAuthHeaders } from "./utils";

export default class Library {
    private static url: Ref<string> = storeToRefs(useAuth()).url

    public static async getAllLibraries() {
        const res = await fetch(`${this.url.value}/libraries`, {
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data = await res.json()
        return data
    }
    public static async getLibrary(id: number) {
        const res = await fetch(`${this.url.value}/libraries/${id}`, {
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data = await res.json()
        return data
    }
    public static async createLibrary(name: string, folderName: string) {
        const res = await fetch(`${this.url.value}/libraries`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name,
                folderName
            })
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data = await res.json()
        return data
    }
    public static async updateLibrary(id: number, libData: Partial<{
        name: string,
        folderName: string
    }>) {
        const res = await fetch(`${this.url.value}/libraries/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(libData)
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data = await res.json()
        return data
    }

    public static async deleteLibrary(id: number) {
        const res = await fetch(`${this.url.value}/libraries/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        return true
    }
}