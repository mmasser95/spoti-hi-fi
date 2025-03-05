import { Ref } from "vue";
import { InternalRepository } from "./core/InternalRepository";
import { storeToRefs } from "pinia";
import { useAuth } from "@/store/useAuth";
import { LocalSong } from "@/types/LocalElements";
import { getHeaders } from "./utils";
import { AlbumResult, ArtistResult } from "@/types/SearchResults";

export default class InternalWithAPI implements InternalRepository {
    private url: Ref<string> = storeToRefs(useAuth()).url

    public async getLocalSongs() {
        let req = await fetch(`${this.url.value}/songs`)
        if (!req.ok) {
            let err = await req.text()
            throw new Error(err);
        }
        let data: LocalSong[] = await req.json()
        return data
    }
    public async searchSongs(query: string) {
        let req = await fetch(`${this.url.value}/songs/search`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                query
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(err);
        }
        let data: LocalSong[] = await req.json()
        return data
    }
    public async searchArtists(query: string) {
        let req = await fetch(`${this.url.value}/artists/search`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                query
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(err);
        }
        let data: ArtistResult[] = await req.json()
        return data
    }
    public async searchAlbums(query: string) {
        let req = await fetch(`${this.url.value}/albums/search`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                query
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(err);
        }
        let data: AlbumResult[] = await req.json()
        return data
    }
    public async getSongsOfAlbum(id: number) {
        let req = await fetch(`${this.url.value}/albums/${id}`)
        if (!req.ok) {
            let err = await req.text()
            throw new Error(err);
        }
        let data: AlbumResult = await req.json()
        return data
    }

    public async getSongsOfArtist(id: number) {
        let req = await fetch(`${this.url.value}/artist/${id}/songs`)
        if (!req.ok) {
            let err = await req.text()
            throw new Error(err);
        }
        let data: LocalSong[] = await req.json()
        return data
    }
}