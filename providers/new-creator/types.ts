import {createNewCreatorStore} from "@/providers/new-creator/store";

export type TNewCreatorState = {
    bio: string;
    description: string;
    contentTypeId: number;
}

export type TNewCreatorActions = {
    setBio: (bio: string) => void;
    setDescription: (description: string) => void;
    setContentType: (contentType: number) => void;
}

export type TNewCreatorStoreApi = ReturnType<typeof createNewCreatorStore>

export const defaultNewUserState: TNewCreatorState = {
    bio: '',
    description: '',
    contentTypeId: 0,
}

export type TNewCreatorStore = TNewCreatorState & TNewCreatorActions;
