import { Library } from "@/types/Library";

export interface LibraryRepository {
    getAllLibraries(): Promise<Library[]>
    getLibrary(id: number): Promise<Library>
    createLibrary(name: string, paths: string): Promise<void>
    updateLibrary(id: number, libData: Partial<{
        name: string,
        paths: string
    }>): Promise<Library>
    deleteLibrary(id: number): Promise<boolean>
}