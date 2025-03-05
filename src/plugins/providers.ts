import InternalWithAPI from "@/APIService/internalWithAPI";
import Playlist from "@/APIService/playlist";
import { provide } from "vue";

export default () => {
    provide(`Internal`, new InternalWithAPI())
    provide(`Playlist`, new Playlist())
}