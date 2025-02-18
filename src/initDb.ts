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
    // ... tu código para manejar la base de datos
    await sqlite.initWebStore();
    // Crear conexión a la base de datos
    const db = await sqlite.createConnection('songsDb', false, 'no-encryption', 1, false);
    await db.open();
    console.log("Base de datos abierta.");
  
    // Crear tabla si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        file_path TEXT NOT NULL
      );
    `);
    console.log("Tabla songs verificada/creada.");
  
    // Cerrar conexión para evitar fugas de memoria
    await sqlite.closeConnection('songsDb', false);
    console.log("Conexión cerrada correctamente.");
  };