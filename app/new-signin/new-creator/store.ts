import {create} from "zustand"
import {TNewCreatorStore} from "@/app/new-signin/new-creator/types";


const useNewCreatorStore = create<TNewCreatorStore>((set, get) => ({
    currentTab: "content",
    setCurrentTab: (tab: "content" | "info" | "payment") => set({currentTab: tab}),
    choosenContent: null,
    setChoosenContent: (contentId: number) => set({choosenContent: contentId})
});