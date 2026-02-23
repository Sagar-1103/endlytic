"use client";
import { Collection } from "lib/types";
import { create } from "zustand";

interface ChatTitleState {
  chatTitle: string;
  setChatTitle: (val: string) => void;
}

interface ChatMessage {
  authorId: string;
  chatId: string;
  content: string;
  id: number;
  role: "Ai" | "User";
}

interface ActiveCollectionState {
  activeCollection: Collection | null;
  setActiveCollection: (val: Collection) => void;
}

interface ChatMessagesState {
  chatMessages: { content: string, role: "Ai" | "User" }[];
  getMessages: (chatId: string) => void;
  addMessage: (role: "Ai" | "User", content: string) => void;
  clearChatMessages: () => void;
}

interface settingModalState {
  settingModal: boolean;
  setSettingModal: (val: boolean) => void;
}

export const useChatTitleStore = create<ChatTitleState>((set) => ({
  chatTitle: "Endlytic API Explorer",
  setChatTitle: (val: string) => set(() => ({ chatTitle: val })),
}));

export const useActiveCollectionStore = create<ActiveCollectionState>((set) => ({
  activeCollection: null,
  setActiveCollection: (val: Collection) => set(() => ({ activeCollection: val })),
}))

export const useChatMessagesStore = create<ChatMessagesState>((set) => ({
  chatMessages: [],
  clearChatMessages: () => set({ chatMessages: [] }),
  addMessage: (role: "Ai" | "User", content: string) => {
    set((state) => {
      const lastMessage = state.chatMessages[state.chatMessages.length - 1];

      if (lastMessage && lastMessage.role === role) {
        if (role === "Ai") {
          const updated = [...state.chatMessages];
          updated[updated.length - 1] = { ...lastMessage, content };
          return { chatMessages: updated };
        }
        return { chatMessages: state.chatMessages };
      }

      return {
        chatMessages: [...state.chatMessages, { role, content }],
      };
    });
  },
  getMessages: async (chatId: string) => {
    try {
      const response = await fetch(`/api/messages/${chatId}`);
      const res = await response.json();
      const messages: ChatMessage[] = await res.messages;
      const parsedMessages = messages.map((message) => {
        const { content, role } = message;
        return { content, role };
      })
      set({ chatMessages: parsedMessages });
    } catch (error) {
      console.log(error);
    }
  }
}))

export const settingModalStore = create<settingModalState>((set) => ({
  settingModal: false,
  setSettingModal: (val: boolean) => set(() => ({ settingModal: val })),
}))
