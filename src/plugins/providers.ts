import InternalWithAPI from "@/APIService/internalWithAPI";
import InternalWithSQlite from "@/APIService/internalWithSQlite";
import Library from "@/APIService/library";
import Playlist from "@/APIService/playlist";
import { App } from "vue";

export default (app: App, serverError: boolean) => {
    if (!serverError) {
        app.provide(`Internal`, new InternalWithAPI())
        app.provide(`Library`, new Library())
        app.provide(`Playlist`, new Playlist())
    } else {
        app.provide('Internal', new InternalWithSQlite())
        app.provide(`Library`, new Library())
        app.provide(`Playlist`, new Playlist())
    }
}