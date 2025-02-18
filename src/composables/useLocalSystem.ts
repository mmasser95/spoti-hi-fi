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
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
    try {
        await db.open()
        await db.run(`INSERT INTO songs (id, title, artist, url, artwork) VALUES ('${id}', '${sanitizeString(title)}', '${sanitizeString(artist)}', '${fileName}', '${artwork}');`)
        await sqlite.closeAllConnections()
    } catch (error) {
        alert(`Error: ${error}`)
    }finally{
        await db.close()
    }
}

export const getElements = async () => {
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false)
    try {
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
    }finally{
        await db.close()
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
function sanitizeString(str:string) {
    return str
      .replace(/'/g, "")   // Escapar comillas simples para SQLite
      .replace(/[\x00-\x1F\x7F]/g, ""); // Eliminar caracteres de control
  }
  