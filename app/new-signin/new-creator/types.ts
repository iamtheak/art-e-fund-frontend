export type TTabProps = {
    setCurrentTab: (tab: number) => void;

}

export type TNewCreatorStore = {
    currentTab: number;
    setCurrentTab: (tab: number) => void;
    choosenContent: number | null;
    setChoosenContent: (contentId: number) => void;
}