import { LocalSong } from "./LocalElements";

export interface LocalPlaylist {
    id: number,
    name: string,
    songs: LocalSong[],
    user: {
        id: number,
        fullName: string,
        email: string
    },
    createdAt: Date,
    updatedAt: Date
}