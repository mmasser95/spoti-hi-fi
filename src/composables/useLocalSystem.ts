import { LocalSong } from "@/types/LocalElements";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { Directory, Filesystem } from "@capacitor/filesystem";

export const saveSong = async (fileName: string, data: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = async () => {
        try {
            const base64Data = reader.result?.toString().split(',')[1];
            if (base64Data)
                await Filesystem.writeFile({
                    path: `${sanitizeString(fileName)}`,
                    data: base64Data,
                    directory: Directory.Data
                })
        } catch (error) {
            alert(`Error: ${error}`)
        }
    }
}

export const insertSong = async (id: number, title: string, artist: string, fileName: string, artwork: string) => {
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
    try {
        await db.open()
        await db.run(`INSERT INTO songs (id, title, artist, url, artwork) VALUES ('${id}', '${sanitizeString(title)}', '${sanitizeString(artist)}', '${sanitizeString(fileName)}', '${artwork}');`)
    } catch (error) {
        alert(`Error: ${error}`)
    } finally {
        await sqlite.closeAllConnections()
    }
}

export const insertLocalSong = async (song: LocalSong) => {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false);
    try {
        await db.open();

        // 1. Insertar o enlazar el álbum
        let albumId: number;
        const albumResult = await db.query(
            "SELECT id FROM albums WHERE spotifyId = ?;",
            [song.album.spotifyId]
        );
        const existingAlbum = albumResult.values?.[0];

        if (existingAlbum) {
            // Si el álbum ya existe, usar su ID
            albumId = existingAlbum.id;
        } else {
            // Si el álbum no existe, insertarlo
            const insertAlbumResult = await db.run(
                `INSERT INTO albums (name, coverImage, description, spotifyId, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?);`,
                [
                    song.album.name,
                    song.album.coverImage,
                    song.album.description,
                    song.album.spotifyId,
                    new Date().toISOString(),
                    new Date().toISOString(),
                ]
            );
            albumId = insertAlbumResult.changes?.lastId!;
        }

        // 2. Insertar o enlazar los artistas
        const artistIds: number[] = [];
        for (const artist of song.artists) {
            const artistResult = await db.query(
                "SELECT id FROM artists WHERE spotifyId = ?;",
                [artist.spotifyId]
            );
            const existingArtist = artistResult.values?.[0];

            if (existingArtist) {
                // Si el artista ya existe, usar su ID
                artistIds.push(existingArtist.id);
            } else {
                // Si el artista no existe, insertarlo
                const insertArtistResult = await db.run(
                    `INSERT INTO artists (name, spotifyId, createdAt, updatedAt)
                     VALUES (?, ?, ?, ?);`,
                    [
                        artist.name,
                        artist.spotifyId,
                        new Date().toISOString(),
                        new Date().toISOString(),
                    ]
                );
                artistIds.push(insertArtistResult.changes?.lastId!);
            }
        }

        // 3. Insertar la canción
        const insertSongResult = await db.run(
            `INSERT INTO songs (id, title, filePath, spotifyId, youtubeId, createdAt, updatedAt, albumId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                song.id,
                song.title,
                song.filePath,
                song.spotifyId,
                song.youtubeId,
                new Date().toISOString(),
                new Date().toISOString(),
                albumId,
            ]
        );
        const songId = insertSongResult.changes?.lastId!;

        // 4. Enlazar la canción con los artistas
        for (const artistId of artistIds) {
            await db.run(
                `INSERT INTO song_artists (songId, artistId)
                 VALUES (?, ?);`,
                [songId, artistId]
            );
        }

        console.log("Canción insertada correctamente.");
    } catch (error) {
        alert(`Error: ${error}`);
    } finally {
        await sqlite.closeAllConnections();
    }
};

export const getElements = async () => {
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
    try {
        await db.open()
        const results = await db.query("SELECT * FROM songs")
        if (results.values) {
            let data: {
                id: number,
                url: string,
                artist: string,
                artwork: string,
                title: string
            }[] = results.values.map((row: any) => ({
                id: row.id,
                url: row.url,
                artist: row.artist,
                title: row.title,
                artwork: row.artwork
            }));
            return data
        }
    } catch (error) {
        alert(`Error: ${error}`)
    } finally {
        await sqlite.closeAllConnections()
    }
}

export const getIds = async () => {
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
    try {
        await db.open()
        const results = await db.query("SELECT id FROM songs")
        if (results.values) {
            let data: number[] = results.values.map((row: any) => row.id);
            return data
        }
    } catch (error) {
        alert(`Error: ${error}`)
    } finally {
        await sqlite.closeAllConnections()
    }

}

export const getFile = async (filePath: string): Promise<string | null> => {
    try {
        const file = await Filesystem.readFile({
            path: filePath,
            directory: Directory.Data
        });

        if (file.data) {
            return `data:audio/mpeg;base64,${file.data}`; // Convertimos a URL base64 para Howler
        }
        return null
    } catch (error) {
        alert(`Error al leer el archivo: ${error}`);
        return null;
    }
};
function sanitizeString(str: string) {
    return str
        .replace(/'/g, "")   // Escapar comillas simples para SQLite
        .replace(/[\x00-\x1F\x7F]/g, ""); // Eliminar caracteres de control
}
