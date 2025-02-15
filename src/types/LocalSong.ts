export interface LocalSong {
    id: number,
    title: string,
    filePath: string,
    spotifyId: string,
    youtubeId: string,
    createdAt: Date,
    updatedAt: Date,
    artists: {
        id: number,
        name: string,
        spotifyId: string,
        createdAt: Date,
        updatedAt: Date
    }[],
    album:{
        id:number,
        name:string,
        coverImage:string,
        description:string,
        spotifyId:string,
        createdAt:Date,
        updatedAt:Date
    }
}