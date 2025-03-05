import { LocalPlaylist } from "@/types/Playlist";

export interface PlaylistRepository {
    getAllPlaylists(): Promise<LocalPlaylist[]>
    getPlaylist(id: number): Promise<LocalPlaylist>
    createPlaylist(name: string): Promise<any>
    addSongToPlaylist(id: number, idSong: number): Promise<void>
    deletePlaylist(id: number): Promise<void>
    deleteSongFromPlaylist(id: number, idSong: number): Promise<void>
}