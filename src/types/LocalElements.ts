export interface LocalArtist {
    id: number,
    name: string,
    spotifyId: string,
    createdAt: Date,
    updatedAt: Date
}

export interface LocalAlbum {
    id: number,
    name: string,
    coverImage: string,
    description: string,
    spotifyId: string,
    createdAt: Date,
    updatedAt: Date
}

export interface LocalSong {
    id: number,
    title: string,
    filePath: string,
    spotifyId: string,
    youtubeId: string,
    createdAt: Date,
    updatedAt: Date,
    artists: LocalArtist[],
    album: LocalAlbum
}