import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { getAuthHeaders } from "./utils";
import { LocalSong } from "@/types/LocalElements";
import { LocalPlaylist } from "@/types/Playlist";

export default class Playlist {
    private static url: Ref<string> = storeToRefs(useAuth()).url

    public static async getAllPlaylists() {
        const res = await fetch(`${this.url.value}/playlists`, {
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data: LocalPlaylist[]= await res.json()
        return data
    }

    public static async getPlaylist(id: number) {
        const res = await fetch(`${this.url.value}/playlists/${id}`, {
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data: LocalPlaylist = await res.json()
        return data
    }

    public static async createPlaylist(name: string) {
        const res = await fetch(`${this.url.value}/playlists`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name
            })
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data = await res.json()
        return data
    }

    public static async addSongToPlaylist(id: number, idSong: number) {
        const res = await fetch(`${this.url.value}/playlists/${id}/songs/${idSong}`, {
            method: "POST",
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
        let data = await res.json()
        return data
    }

    public static async deletePlaylist(id: number) {
        const res = await fetch(`${this.url.value}/playlists/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        })
        if (!res.ok) {
            let err = await res.text()
            throw new Error(err)
        }
    }
}