import { create } from "zustand";

interface Chat {
    id:string;
    title?:string;
};

interface ChatsState {
    chats:Chat[];
    getChats:() => void;
    addChat:(id:string,title:string) => void;
    deleteChat:(id:string) => void;
}


export const useChatsStore = create<ChatsState>((set) => ({
    chats:[],
    addChat:(id:string,title:string) => {
        set((state) => {
            const updatedChats = [...state.chats,{id,title}];
            return {chats:updatedChats}
        });
    },
    deleteChat:(id:string) => {
        set((state) => {
            const filteredChats = state.chats.filter((chat)=> chat.id !== id);
            return {chats:filteredChats}
        });
    },
    getChats:async() => {
        try {
            const response = await fetch("/api/chats");
            const res = await response.json();
            set({chats:res.chats});
        } catch (error) {
            console.log(error);
            set({chats:[]})
        }
    }
}));

interface IsStreamingState {
    isStreaming:boolean;
    setIsStreaming:(val:boolean) => void;
}

export const useIsStreamingStore = create<IsStreamingState>((set) => ({
    isStreaming:false,
    setIsStreaming:(val:boolean)=>{
        set({isStreaming:val});
    }
}))