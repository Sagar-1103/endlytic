"use client";
import { usePathname } from "next/navigation";
import SidebarChatItem from "./SidebarChatItem";
import { useEffect } from "react";
import { useChatsStore } from "@/store/useChatsStore";
import { MessageSquare } from "lucide-react";

export default function SidebarChats() {
  const pathName = usePathname();
  const { chats, getChats } = useChatsStore();

  useEffect(() => {
    getChats();
  }, [])

  return (
    <div className="mt-6">
      <p className="font-medium tracking-wider text-emerald-300 px-3 mb-2">
        Recent Chats
      </p>
      <div className="h-[33vh] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-1">
          {chats && chats.length !== 0 ? (
            chats.map((chat) => (
              <SidebarChatItem isActive={pathName === `/chat/${chat.id}`} key={chat.id} chat={chat} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
              {/* Icon with glow */}
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full scale-150" />
                <div className="relative bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-emerald-500/50" />
                </div>
              </div>
              <p className="text-xs font-semibold text-zinc-400 mb-1">No conversations yet</p>
              <p className="text-[10px] text-zinc-600 leading-relaxed">Start a new chat to see your history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
