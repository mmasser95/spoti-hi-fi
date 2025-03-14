import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";
import { defineCustomElements } from "jeep-sqlite/loader";


export default async () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {

    // Inicializa los elementos personalizados de jeep-sqlite
    defineCustomElements(window);
    // Espera a que el componente jeep-sqlite esté listo
    const jeepEl = document.querySelector('jeep-sqlite');
    if (jeepEl) {
      await customElements.whenDefined('jeep-sqlite');
      await jeepEl.componentOnReady();
    } else {
      console.error('El componente jeep-sqlite no está presente en el DOM.');
      return;
    }
  }
  // Ahora puedes inicializar la conexión SQLite
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  console.log("Se crea objeto SQLiteConnection.");
  // ... tu código para manejar la base de datos
  if (platform === "web")
    await sqlite.initWebStore();
  // Crear conexión a la base de datos
  const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false);
  await db.open();
  console.log("Base de datos abierta.");

  //   await db.run(`
  // DROP TABLE IF EXISTS playlist_songs;
  // DROP TABLE IF EXISTS playlists;
  // DROP TABLE IF EXISTS libraries;
  // DROP TABLE IF EXISTS song_artists;
  // DROP TABLE IF EXISTS songs;
  // DROP TABLE IF EXISTS albums;
  // DROP TABLE IF EXISTS artists;`)
  // Crear tabla si no existe

  // await db.run(`
  //     CREATE TABLE IF NOT EXISTS songs (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       title TEXT NOT NULL,
  //       artist TEXT NOT NULL,
  //       url TEXT NOT NULL,
  //       artwork TEXT NOT NULL
  //     );
  //   `);

  await db.run(`
CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    spotifyId TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    coverImage TEXT,
    description TEXT,
    spotifyId TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    filePath TEXT NOT NULL,
    spotifyId TEXT,
    youtubeId TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    albumId INTEGER,
    FOREIGN KEY (albumId) REFERENCES albums(id)
);


CREATE TABLE IF NOT EXISTS song_artists (
    songId INTEGER,
    artistId INTEGER,
    PRIMARY KEY (songId, artistId),
    FOREIGN KEY (songId) REFERENCES songs(id),
    FOREIGN KEY (artistId) REFERENCES artists(id)
);

CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    userId INTEGER NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL    
);

CREATE TABLE IF NOT EXISTS playlist_songs (
    playlistId INTEGER,
    songId INTEGER,
    PRIMARY KEY (playlistId, songId),
    FOREIGN KEY (playlistId) REFERENCES playlists(id),
    FOREIGN KEY (songId) REFERENCES songs(id)
);
`)

  console.log("Tablas creadas/verificadas.");

  // Cerrar conexión para evitar fugas de memoria
  await sqlite.closeConnection('songsDb', false);
  console.log("Conexión cerrada correctamente.");
};