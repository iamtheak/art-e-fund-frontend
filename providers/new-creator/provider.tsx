"use client"
import {defaultNewUserState, TNewCreatorStoreApi} from "@/providers/new-creator/types";
import {createContext, useContext, useRef} from "react";
import {createNewCreatorStore} from "@/providers/new-creator/store";
import {useStore} from "zustand";
import {TProviderBaseProps} from "@/providers/types";


export const NewCreatorContext = createContext<TNewCreatorStoreApi | undefined>(undefined);

export const NewCreatorProvider = ({children}: TProviderBaseProps) => {
    const storeRef = useRef<TNewCreatorStoreApi>();
    if (!storeRef.current) {
        storeRef.current = createNewCreatorStore(defaultNewUserState);
    }
    return (
        <NewCreatorContext.Provider value={storeRef.current}>
            {children}
        </NewCreatorContext.Provider>
    )
}

export const useNewCreatorStore = () => {
    const context = useContext(NewCreatorContext);

    if (!context) {
        throw new Error('useNewCreatorStore must be used within a NewCreatorProvider');
    }

    return useStore(context)
}