"use client";
import { usePathname } from "next/navigation";
import SidebarChatItem from "./SidebarChatItem";
import { useEffect } from "react";
import { useChatsStore } from "@/store/useChatsStore";

export default function SidebarChats() {
  const pathName = usePathname();
  const { chats, getChats } = useChatsStore();

  useEffect(()=>{
    getChats();
  },[])

  return (
    <div className="mt-6">
      <p className="font-medium tracking-wider text-emerald-300 px-3 mb-2">
        Recent Chats
      </p>
      <div className="h-[33vh] overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-1">
        {chats && chats.length!==0 && chats.map((chat) => (
          <SidebarChatItem isActive={pathName===`/chat/${chat.id}`} key={chat.id} chat={chat} />
        ))}
      </div>
      </div>
    </div>
  );
}
