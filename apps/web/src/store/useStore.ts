"use client";
import { create } from "zustand";

interface ChatTitleState {
    chatTitle:string,
    setChatTitle:(val:string)=>void;
}

export const useChatTitleStore = create<ChatTitleState>((set)=>({
    chatTitle:"Endlytic API Explorer",
    setChatTitle:(val:string)=>set(()=>({chatTitle:val})),
}))