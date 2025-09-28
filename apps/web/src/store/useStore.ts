"use client";
import { Collection } from "lib/types";
import { create } from "zustand";

interface ChatTitleState {
  chatTitle: string;
  setChatTitle: (val: string) => void;
}

interface ActiveCollectionState {
  activeCollection: Collection| null;
  setActiveCollection: (val:Collection) => void;
}

interface settingModalState {
  settingModal: boolean;
  setSettingModal: (val:boolean) => void;
}

export const useChatTitleStore = create<ChatTitleState>((set) => ({
    chatTitle: "Endlytic API Explorer",
    setChatTitle: (val: string) => set(() => ({ chatTitle: val })),
}));

export const useActiveCollectionStore = create<ActiveCollectionState>((set)=>({
    activeCollection:null,
    setActiveCollection: (val: Collection) => set(() => ({ activeCollection: val })),
}))

export const settingModalStore = create<settingModalState>((set)=>({
    settingModal:false,
    setSettingModal: (val: boolean) => set(() => ({ settingModal: val })),
}))
