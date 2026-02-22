import { create } from "zustand";

export interface Chat {
    id: string;
    title?: string;
};

interface ChatsState {
    chats: Chat[];
    getChats: () => void;
    addChat: (id: string, title: string) => void;
    deleteChat: (id: string) => void;
    updateChatTitle: (id: string, title: string) => void;
}


export const useChatsStore = create<ChatsState>((set) => ({
    chats: [],
    addChat: (id: string, title: string) => {
        set((state) => {
            const exists = state.chats.some((chat) => chat.id === id);

            if (exists) {
                return state;
            }
            const updatedChats = [...state.chats, { id, title }];
            return { chats: updatedChats };
        });
    },

    deleteChat: (id: string) => {
        set((state) => {
            const filteredChats = state.chats.filter((chat) => chat.id !== id);
            return { chats: filteredChats }
        });
    },

    updateChatTitle: (id: string, title: string) => {
        set((state) => ({
            chats: state.chats.map((chat) =>
                chat.id === id ? { ...chat, title } : chat
            ),
        }));
    },
    getChats: async () => {
        try {
            const response = await fetch("/api/chats");
            const res = await response.json();
            set({ chats: res.chats });
        } catch (error) {
            console.log(error);
            set({ chats: [] })
        }
    }
}));

interface IsStreamingState {
    isStreaming: boolean;
    setIsStreaming: (val: boolean) => void;
}

export const useIsStreamingStore = create<IsStreamingState>((set) => ({
    isStreaming: false,
    setIsStreaming: (val: boolean) => {
        set({ isStreaming: val });
    }
}))