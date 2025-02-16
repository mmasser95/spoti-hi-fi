import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { ref, Ref } from "vue";
import { getHeaders } from "./utils";
import { YoutubeTrack } from "@/types/YoutubeSearch";
import { SpotifySearch, SpotifyTrack } from "@/types/SpotifySearch";
import { LocalSong } from "@/types/LocalElements";
import { AlbumResult, ArtistResult } from "@/types/SearchResults";

export class External {
    private static url: Ref<string> = storeToRefs(useAuth()).url

    public static async searchYoutube(query: string) {
        console.log(this.url.value);

        let req = await fetch(`${this.url.value}/youtube/search`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                query
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(`Error: ${err}`);
        }
        let data: YoutubeTrack[] = await req.json()
        return data
    }

    public static async searchSpotify(query: string) {
        let req = await fetch(`${this.url.value}/spotify/search`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                query
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(`Error: ${err}`);
        }
        let data: { items: SpotifyTrack[] } = await req.json()
        return data
    }

    public static async getLocalSongs() {
        let req = await fetch(`${this.url.value}/songs`)
        if (!req.ok) {
            let err = await req.text()
            throw new Error(`Error: ${err}`);
        }
        let data: LocalSong[] = await req.json()
        return data
    }

    public static async downloadMp3(url: string, youtubeId: string, spotifyId: string, title: string, artists: {
        spotifyId: string,
        name: string
    }[], album: {
        spotifyId: string,
        name: string,
        coverImage: string,
        artists: {
            spotifyId: string,
            name: string
        }[]
    }) {
        let req = await fetch(`${this.url.value}/download`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                url,
                youtubeId,
                spotifyId,
                title,
                artists,
                album
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(`Error: ${err}`);
        }
        let data = await req.json()
        return data
    }

    public static async searchSongs(query: string) {
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

    public static async searchArtists(query: string) {
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

    public static async searchAlbums(query: string) {
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
}