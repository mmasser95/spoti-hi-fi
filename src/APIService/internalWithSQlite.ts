import { LocalSong } from "@/types/LocalElements";
import { InternalRepository } from "./core/InternalRepository";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { now } from "lodash";
import { AlbumResult, ArtistResult } from "@/types/SearchResults";

export default class InternalWithSQlite implements InternalRepository {

    private selectSongsQuery = `SELECT 
    s.id AS song_id, 
    s.title AS song_title, 
    s.filePath AS song_filePath, 
    s.spotifyId AS song_spotifyId, 
    s.youtubeId AS song_youtubeId, 
    s.createdAt AS song_createdAt, 
    s.updatedAt AS song_updatedAt,

    a.id AS album_id, 
    a.name AS album_name, 
    a.coverImage AS album_coverImage, 
    a.description AS album_description, 
    a.spotifyId AS album_spotifyId, 
    a.createdAt AS album_createdAt,  
    a.updatedAt AS album_updatedAt,  

    ar.id AS artist_id, 
    ar.name AS artist_name, 
    ar.spotifyId AS artist_spotifyId, 
    ar.createdAt AS artist_createdAt,  
    ar.updatedAt AS artist_updatedAt   

FROM songs s
LEFT JOIN albums a ON s.albumId = a.id
LEFT JOIN song_artists sa ON s.id = sa.songId
LEFT JOIN artists ar ON sa.artistId = ar.id
ORDER BY s.id;
`

    private searchSongsQuery = `SELECT 
    s.id AS song_id, 
    s.title AS song_title, 
    s.filePath AS song_filePath, 
    s.spotifyId AS song_spotifyId, 
    s.youtubeId AS song_youtubeId, 
    s.createdAt AS song_createdAt, 
    s.updatedAt AS song_updatedAt,

    a.id AS album_id, 
    a.name AS album_name, 
    a.coverImage AS album_coverImage, 
    a.description AS album_description, 
    a.spotifyId AS album_spotifyId, 
    a.createdAt AS album_createdAt, 
    a.updatedAt AS album_updatedAt,

    ar.id AS artist_id, 
    ar.name AS artist_name, 
    ar.spotifyId AS artist_spotifyId, 
    ar.createdAt AS artist_createdAt, 
    ar.updatedAt AS artist_updatedAt

FROM songs s
LEFT JOIN albums a ON s.albumId = a.id
LEFT JOIN song_artists sa ON s.id = sa.songId
LEFT JOIN artists ar ON sa.artistId = ar.id
WHERE s.title like '%[title]%'
ORDER BY s.id;`

    async getLocalSongs(): Promise<LocalSong[]> {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        try {
            await db.open()
            const results = await db.query(this.selectSongsQuery)
            if (results.values) {
                let data: LocalSong[] = this.mapSongs(results.values)
                return data
            }
        } catch (error) {
            alert(`Error: ${error}`)
        } finally {
            await db.close()
        }
        return []
    }
    async searchSongs(query: string): Promise<LocalSong[]> {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        try {
            await db.open()
            let q = this.searchSongsQuery.replace('[title]', query)
            console.log(q);
            const results = await db.query(q);

            if (results.values) {
                let data: LocalSong[] = this.mapSongs(results.values)
                return data
            }
        } catch (error) {
            alert(`Error ${error}`)
        } finally {
            await db.close()
        }
        return []
    }

    async getSongsOfAlbum(id: number): Promise<AlbumResult> {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        try {
            await db.open();

            // 1. Obtener la información del álbum
            const albumResult = await db.query(
                "SELECT * FROM albums WHERE id = ?;",
                [id]
            );
            const album = albumResult.values?.[0];

            if (!album) {
                throw new Error("Álbum no encontrado");
            }

            // 2. Obtener los artistas del álbum
            const artistsResult = await db.query(
                `SELECT a.* FROM artists a
                 JOIN song_artists sa ON a.id = sa.artistId
                 JOIN songs s ON sa.songId = s.id
                 WHERE s.albumId = ?;`,
                [id]
            );
            const artists = artistsResult.values || [];

            // 3. Obtener las canciones del álbum
            const songsResult = await db.query(
                "SELECT * FROM songs WHERE albumId = ?;",
                [id]
            );
            const songs = songsResult.values || [];

            // 4. Obtener los artistas de cada canción
            for (const song of songs) {
                const songArtistsResult = await db.query(
                    `SELECT a.* FROM artists a
                     JOIN song_artists sa ON a.id = sa.artistId
                     WHERE sa.songId = ?;`,
                    [song.id]
                );
                song.artists = songArtistsResult.values?.map(artist => ({
                    id: artist.id,
                    name: artist.name,
                    spotifyId: artist.spotifyId,
                    createdAt: new Date(artist.createdAt),
                    updatedAt: new Date(artist.updatedAt),
                })) || [];
            }

            // 5. Construir el objeto AlbumResult
            const albumResultData: AlbumResult = {
                id: album.id,
                name: album.name,
                coverImage: album.coverImage,
                description: album.description,
                spotifyId: album.spotifyId,
                createdAt: new Date(album.createdAt),
                updatedAt: new Date(album.updatedAt),
                artists: artists.map(artist => ({
                    id: artist.id,
                    name: artist.name,
                    spotifyId: artist.spotifyId,
                    createdAt: new Date(artist.createdAt),
                    updatedAt: new Date(artist.updatedAt),
                })),
                songs: songs.map(song => ({
                    id: song.id,
                    title: song.title,
                    filePath: song.filePath,
                    spotifyId: song.spotifyId,
                    youtubeId: song.youtubeId,
                    createdAt: new Date(song.createdAt),
                    updatedAt: new Date(song.updatedAt),
                    artists: song.artists, // Artistas de la canción
                    album: {
                        id: album.id,
                        name: album.name,
                        coverImage: album.coverImage,
                        description: album.description,
                        spotifyId: album.spotifyId,
                        createdAt: new Date(album.createdAt),
                        updatedAt: new Date(album.updatedAt),
                    },
                })),
            };

            return albumResultData;
        } catch (error) {
            console.error("Error al obtener las canciones del álbum:", error);
            throw error;
        } finally {
            await db.close(); // Cerrar la conexión a la base de datos
        }
    }

    async getSongsOfArtist(id: number): Promise<LocalSong[]> {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        try {
            await db.open();

            // 1. Obtener las canciones del artista
            const songsResult = await db.query(
                `SELECT s.* FROM songs s
                 JOIN song_artists sa ON s.id = sa.songId
                 WHERE sa.artistId = ?;`,
                [id]
            );
            const songs = songsResult.values || [];

            // 2. Obtener los artistas de cada canción
            for (const song of songs) {
                const songArtistsResult = await db.query(
                    `SELECT a.* FROM artists a
                     JOIN song_artists sa ON a.id = sa.artistId
                     WHERE sa.songId = ?;`,
                    [song.id]
                );
                song.artists = songArtistsResult.values?.map(artist => ({
                    id: artist.id,
                    name: artist.name,
                    spotifyId: artist.spotifyId,
                    createdAt: new Date(artist.createdAt),
                    updatedAt: new Date(artist.updatedAt),
                })) || [];
            }

            // 3. Obtener la información del álbum de cada canción
            for (const song of songs) {
                const albumResult = await db.query(
                    "SELECT * FROM albums WHERE id = ?;",
                    [song.albumId]
                );
                const album = albumResult.values?.[0];

                if (album) {
                    song.album = {
                        id: album.id,
                        name: album.name,
                        coverImage: album.coverImage,
                        description: album.description,
                        spotifyId: album.spotifyId,
                        createdAt: new Date(album.createdAt),
                        updatedAt: new Date(album.updatedAt),
                    };
                } else {
                    // Si no se encuentra el álbum, se asigna un objeto vacío
                    song.album = {
                        id: song.albumId,
                        name: "",
                        coverImage: "",
                        description: "",
                        spotifyId: "",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                }
            }

            // 4. Construir el array de LocalSong
            const localSongs: LocalSong[] = songs.map(song => ({
                id: song.id,
                title: song.title,
                filePath: song.filePath,
                spotifyId: song.spotifyId,
                youtubeId: song.youtubeId,
                createdAt: new Date(song.createdAt),
                updatedAt: new Date(song.updatedAt),
                artists: song.artists, // Artistas de la canción
                album: song.album, // Información del álbum
            }));

            return localSongs;
        } catch (error) {
            console.error("Error al obtener las canciones del artista:", error);
            throw error;
        } finally {
            await db.close(); // Cerrar la conexión a la base de datos
        }
    }

    async searchArtists(query: string): Promise<ArtistResult[]> {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        try {
            await db.open();

            // 1. Buscar artistas que coincidan con la consulta
            const artistsResult = await db.query(
                "SELECT * FROM artists WHERE name LIKE ?;",
                [`%${query}%`]
            );
            const artists = artistsResult.values || [];

            // 2. Para cada artista, obtener sus canciones
            const artistResults: ArtistResult[] = [];
            for (const artist of artists) {
                // Obtener las canciones del artista
                const songsResult = await db.query(
                    `SELECT s.* FROM songs s
                     JOIN song_artists sa ON s.id = sa.songId
                     WHERE sa.artistId = ?;`,
                    [artist.id]
                );
                const songs = songsResult.values || [];

                // Obtener los artistas de cada canción
                for (const song of songs) {
                    const songArtistsResult = await db.query(
                        `SELECT a.* FROM artists a
                         JOIN song_artists sa ON a.id = sa.artistId
                         WHERE sa.songId = ?;`,
                        [song.id]
                    );
                    song.artists = songArtistsResult.values?.map(a => ({
                        id: a.id,
                        name: a.name,
                        spotifyId: a.spotifyId,
                        createdAt: new Date(a.createdAt),
                        updatedAt: new Date(a.updatedAt),
                    })) || [];
                }

                // Obtener el álbum de cada canción
                for (const song of songs) {
                    const albumResult = await db.query(
                        "SELECT * FROM albums WHERE id = ?;",
                        [song.albumId]
                    );
                    const album = albumResult.values?.[0];

                    if (album) {
                        song.album = {
                            id: album.id,
                            name: album.name,
                            coverImage: album.coverImage,
                            description: album.description,
                            spotifyId: album.spotifyId,
                            createdAt: new Date(album.createdAt),
                            updatedAt: new Date(album.updatedAt),
                        };
                    } else {
                        song.album = {
                            id: song.albumId,
                            name: "",
                            coverImage: "",
                            description: "",
                            spotifyId: "",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                    }
                }

                // Construir el objeto ArtistResult
                artistResults.push({
                    id: artist.id,
                    name: artist.name,
                    spotifyId: artist.spotifyId,
                    createdAt: new Date(artist.createdAt),
                    updatedAt: new Date(artist.updatedAt),
                    songs: songs.map(song => ({
                        id: song.id,
                        title: song.title,
                        filePath: song.filePath,
                        spotifyId: song.spotifyId,
                        youtubeId: song.youtubeId,
                        createdAt: new Date(song.createdAt),
                        updatedAt: new Date(song.updatedAt),
                        artists: song.artists,
                        album: song.album,
                    })),
                });
            }

            return artistResults;
        } catch (error) {
            console.error("Error al buscar artistas:", error);
            throw error;
        } finally {
            await db.close(); // Cerrar la conexión a la base de datos
        }
    }

    async searchAlbums(query: string): Promise<AlbumResult[]> {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        try {
            await db.open();

            // 1. Buscar álbumes que coincidan con la consulta
            const albumsResult = await db.query(
                "SELECT * FROM albums WHERE name LIKE ?;",
                [`%${query}%`]
            );
            const albums = albumsResult.values || [];

            // 2. Para cada álbum, obtener sus canciones y artistas
            const albumResults: AlbumResult[] = [];
            for (const album of albums) {
                // Obtener las canciones del álbum
                const songsResult = await db.query(
                    "SELECT * FROM songs WHERE albumId = ?;",
                    [album.id]
                );
                const songs = songsResult.values || [];

                // Obtener los artistas de cada canción
                for (const song of songs) {
                    const songArtistsResult = await db.query(
                        `SELECT a.* FROM artists a
                         JOIN song_artists sa ON a.id = sa.artistId
                         WHERE sa.songId = ?;`,
                        [song.id]
                    );
                    song.artists = songArtistsResult.values?.map(a => ({
                        id: a.id,
                        name: a.name,
                        spotifyId: a.spotifyId,
                        createdAt: new Date(a.createdAt),
                        updatedAt: new Date(a.updatedAt),
                    })) || [];
                }

                // Obtener los artistas del álbum (artistas de todas las canciones)
                const albumArtists = songs
                    .flatMap(song => song.artists)
                    .filter((artist, index, self) =>
                        self.findIndex(a => a.id === artist.id) === index
                    ); // Eliminar duplicados

                // Construir el objeto AlbumResult
                albumResults.push({
                    id: album.id,
                    name: album.name,
                    coverImage: album.coverImage,
                    description: album.description,
                    spotifyId: album.spotifyId,
                    createdAt: new Date(album.createdAt),
                    updatedAt: new Date(album.updatedAt),
                    artists: albumArtists,
                    songs: songs.map(song => ({
                        id: song.id,
                        title: song.title,
                        filePath: song.filePath,
                        spotifyId: song.spotifyId,
                        youtubeId: song.youtubeId,
                        createdAt: new Date(song.createdAt),
                        updatedAt: new Date(song.updatedAt),
                        artists: song.artists,
                        album: {
                            id: album.id,
                            name: album.name,
                            coverImage: album.coverImage,
                            description: album.description,
                            spotifyId: album.spotifyId,
                            createdAt: new Date(album.createdAt),
                            updatedAt: new Date(album.updatedAt),
                        },
                    })),
                });
            }

            return albumResults;
        } catch (error) {
            console.error("Error al buscar álbumes:", error);
            throw error;
        } finally {
            await db.close(); // Cerrar la conexión a la base de datos
        }
    }

    private mapSongs(rows: any[]): LocalSong[] {
        const songMap = new Map<number, LocalSong>();

        rows.forEach(row => {
            if (!songMap.has(row.song_id)) {
                songMap.set(row.song_id, {
                    id: row.song_id,
                    title: row.song_title,
                    filePath: row.song_filePath,
                    spotifyId: row.song_spotifyId,
                    youtubeId: row.song_youtubeId,
                    createdAt: new Date(row.song_createdAt),
                    updatedAt: new Date(row.song_updatedAt),
                    album: row.album_id ? {
                        id: row.album_id,
                        name: row.album_name,
                        coverImage: row.album_coverImage,
                        description: row.album_description,
                        spotifyId: row.album_spotifyId,
                        createdAt: new Date(row.album_createdAt),
                        updatedAt: new Date(row.album_updatedAt)
                    } : {
                        id: -1,
                        name: "Undefined",
                        coverImage: row.album_coverImage,
                        description: "",
                        spotifyId: "",
                        createdAt: new Date(now()),
                        updatedAt: new Date(now())
                    },
                    artists: []
                });
            }

            if (row.artist_id) {
                songMap.get(row.song_id)!.artists.push({
                    id: row.artist_id,
                    name: row.artist_name,
                    spotifyId: row.artist_spotifyId,
                    createdAt: new Date(row.artist_createdAt),
                    updatedAt: new Date(row.artist_updatedAt)
                });
            }
        });

        return Array.from(songMap.values());
    }
}