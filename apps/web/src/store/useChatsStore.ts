import { create } from "zustand";

interface Chat {
    id:string;
    title?:string;
};

interface ChatsState {
    chats:Chat[];
}


export const useChatsStore = create<ChatsState>((set) => ({
    chats:[],
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