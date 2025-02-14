import { useAuth } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { ref, Ref } from "vue";
import { getHeaders } from "./utils";
import { YoutubeTrack } from "@/types/YoutubeSearch";
import { SpotifySearch } from "@/types/SpotifySearch";

export class External {
    // private static url: Ref<string> = storeToRefs(useAuth()).url 
    private static url: Ref<string> = ref("http://localhost:3333")

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
        let data: { tracks: SpotifySearch } = await req.json()
        return data
    }

    public static async getLocalSongs() {
        let req = await fetch(`${this.url.value}/songs`)
        if (!req.ok) {
            let err = await req.text()
            throw new Error(`Error: ${err}`);
        }
        let data = await req.json()
        return data
    }

    public static async downloadMp3(url: string, youtubeId: string, spotifyId: string, title: string, artists: {
        spotifyId: string,
        name: string
    }[]) {
        let req = await fetch(`${this.url.value}/download`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                url,
                youtubeId,
                spotifyId,
                title,
                artists
            })
        })
        if (!req.ok) {
            let err = await req.text()
            throw new Error(`Error: ${err}`);
        }
        let data = await req.json()
        return data
    }
}