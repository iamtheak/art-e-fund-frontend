import { create } from "zustand";
import { TGlobalStore, TUser } from "./types";

export const useGlobalStore = create<TGlobalStore>((set, get) => ({
    user: null,
    token: null,
    setUser: (data: Partial<TUser>) =>
        set((state) => ({
            user: { ...state.user, ...data } as TUser,
        })),
    setToken: (token: string) => set({ token }),
}));