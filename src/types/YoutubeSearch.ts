export interface YoutubeTrack {
    url: string,
    description: string | null,
    duration_formatted: string,
    duration: number,
    title: string,
    uploadedAt: string,
    unlisted: boolean,
    nsfw: boolean,
    thumbnail: {
        width: number,
        height: number,
        url: string
    },
    channel: {
        name: string,
        id: string,
        icon: string
    },
    views: number,
    type: string,
    tags: string[],
    ratings: {
        likes: number,
        dislikes: number
    },
    shorts: boolean,
    live: boolean,
    private: boolean
}