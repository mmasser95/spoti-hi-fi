import InternalWithAPI from "@/APIService/internalWithAPI";
import Library from "@/APIService/library";
import Playlist from "@/APIService/playlist";
import { App, provide } from "vue";

export default (app: App) => {
    app.provide(`Internal`, new InternalWithAPI())
    app.provide(`Library`, new Library())
    app.provide(`Playlist`, new Playlist())
}