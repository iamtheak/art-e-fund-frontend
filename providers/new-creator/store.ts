import {createStore} from "zustand/vanilla";
import {TNewCreatorState, TNewCreatorStore} from "@/providers/new-creator/types";

export const createNewCreatorStore = (initalState: TNewCreatorState) => {
    return createStore<TNewCreatorStore>((set) => ({
        ...initalState,
        setBio: (bio: string) => set({bio}),
        setDescription: (description: string) => set({description}),
        setContentType: (contentTypeId: number) => set({contentTypeId})
    }))
}