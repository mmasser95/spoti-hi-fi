import { LocalSong } from "@/types/LocalElements";
import { AlbumResult, ArtistResult } from "@/types/SearchResults";

export interface InternalRepository {
    getLocalSongs(): Promise<LocalSong[]>
    searchSongs(query: string): Promise<LocalSong[]>
    searchArtists(query: string): Promise<ArtistResult[]>
    searchAlbums(query: string): Promise<AlbumResult[]>
    getSongsOfAlbum(id: number): Promise<AlbumResult>
    getSongsOfArtist(id: number): Promise<LocalSong[]>
}