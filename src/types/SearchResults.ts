import { LocalSong } from "./LocalElements"

export interface ArtistResult {
    id: number,
    name: string,
    spotifyId: string,
    createdAt: Date,
    updatedAt: Date,
    songs: LocalSong[]
}

export interface AlbumResult {
    id: number,
    name: string,
    coverImage: string,
    description: string,
    spotifyId: string,
    createdAt: Date,
    updatedAt: Date,
    artists: {
        id: number,
        name: string,
        spotifyId: string,
        createdAt: Date,
        updatedAt: Date,
    }[],
    songs: LocalSong[]
}
