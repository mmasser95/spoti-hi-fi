export interface ArtistResult {
    id: number,
    name: string,
    spotifyId: string,
    createdAt: Date,
    updatedAt: Date,
    songs: {
        id: number,
        title: string,
        filePath: string,
        spotifyId: string,
        youtubeId: string,
        createdAt: Date,
        updatedAt: Date,
    }[]
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
    songs: {
        id: number,
        title: string,
        filePath: string,
        spotifyId: string,
        youtubeId: string,
        createdAt: Date,
        updatedAt: Date,
    }[]
}