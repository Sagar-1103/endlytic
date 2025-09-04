"use client";
import { usePathname } from "next/navigation";
import SidebarChatItem from "./SidebarChatItem";
import { chats } from "@/data/sidebar-data";

export default function SidebarChats() {
  const pathName = usePathname();

  return (
    <div className="mt-6">
      <p className="font-medium tracking-wider text-emerald-300 px-3 mb-2">
        Recent Chats
      </p>
      <div className="flex flex-col gap-1">
        {chats.length!==0 && chats.map((chat) => (
          <SidebarChatItem isActive={pathName===`/chat/${chat.id}`} key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
}
