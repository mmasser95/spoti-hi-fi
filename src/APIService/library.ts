import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { getAuthHeaders } from "./utils";
import { Library as LibraryType } from "@/types/Library";
import { LibraryRepository } from "./core/LibraryRepository";

export default class Library implements LibraryRepository {
    private url: Ref<string> = storeToRefs(useAuth()).url

    public async getAllLibraries() {
        const res = await fetch(`${this.url.value}/libraries`, {
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data: LibraryType[] = await res.json()
        return data
    }
    public async getLibrary(id: number) {
        const res = await fetch(`${this.url.value}/libraries/${id}`, {
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data: LibraryType = await res.json()
        return data
    }
    public async createLibrary(name: string, paths: string) {
        const res = await fetch(`${this.url.value}/libraries`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name,
                paths
            })
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err);
        }
        let data = await res.json()
        return data
    }
    public async updateLibrary(id: number, libData: Partial<{
        name: string,
        paths: string
    }>) {
        const res = await fetch(`${this.url.value}/libraries/${id}`, {
            method: "PUT",
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

    public async deleteLibrary(id: number) {
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