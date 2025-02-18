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
                    path: `${fileName}`,
                    data: base64Data,
                    directory: Directory.Data
                })
        } catch (error) {
            alert(`Error: ${error}`)
        }
    }
}

export const insertSong = async (id: number, title: string, artist: string, fileName: string, artwork: string) => {
    try {
        const sqlite = new SQLiteConnection(CapacitorSQLite)
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        await db.open()
        await db.execute(`INSERT INTO songs (id, title, artist, url, artwork) VALUES ('${id}', '${title}', '${artist}', '${fileName}', '${artwork}');`)
        await sqlite.closeAllConnections()
    } catch (error) {
        alert(`Error: ${error}`)
    }
}

export const getElements = async () => {
    try {
        const sqlite = new SQLiteConnection(CapacitorSQLite)
        const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
        await db.open()
        const results = await db.query("SELECT * FROM songs")
        if (results.values) {
            let data: {
                url: string,
                artist: string,
                artwork: string,
                title: string
            }[] = results.values.map((row: any) => ({
                url: row.url,
                artist: row.artist,
                title: row.title,
                artwork: row.artwork
            }));
            return data
        }
    } catch (error) {
        alert(`Error: ${error}`)
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