"use client";
import { Chat, useChatsStore } from "@/store/useChatsStore";
import { useChatTitleStore } from "@/store/useStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
import axios from "axios";
import { toast } from "sonner";

interface SidebarChatItemProps {
  chat: Chat;
  isActive: boolean;
}
export default function SidebarChatItem({
  chat,
  isActive,
}: SidebarChatItemProps) {
  const { setChatTitle } = useChatTitleStore();
  const { deleteChat, updateChatTitle } = useChatsStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(chat.title ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      setChatTitle(chat?.title ?? "Untitled");
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDeleteChat = () => {
    toast.promise(
      axios.delete(`/api/chat/${chat.id}`).then((res) => {
        deleteChat(chat.id);
        if (pathname === `/chat/${chat.id}`) {
          router.push("/chat");
        }
        return res.data;
      }),
      {
        loading: "Deleting chat...",
        success: () => `${chat.title || "Untitled Chat"} deleted`,
        error: "Failed to delete chat.",
      }
    );
  };

  const handleSaveTitle = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === chat.title) {
      setEditValue(chat.title ?? "");
      setIsEditing(false);
      return;
    }
    try {
      await axios.patch(`/api/chat/${chat.id}`, { title: trimmed });
      updateChatTitle(chat.id, trimmed);
      if (isActive) {
        setChatTitle(trimmed);
      }
      toast.success("Chat renamed");
    } catch {
      toast.error("Failed to rename chat");
      setEditValue(chat.title ?? "");
    }
    setIsEditing(false);
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(chat.title ?? "");
    setIsEditing(true);
  };

  return (
    <div
      onClick={() => {
        if (isEditing) return;
        router.push(`/chat/${chat.id}`);
        setChatTitle(chat?.title ?? "Untitled");
      }}
      className="group flex overflow-hidden items-center gap-1 px-3 py-2 rounded-lg pl-[2px] cursor-pointer relative hover:bg-emerald-500/10 transition-all duration-200"
    >
      {isActive && (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_-3%_50%,_#5ee9b5_0%,_#5ee9b5_10%,_transparent_15%)] blur-lg" />
      )}
      <div className={`flex flex-col flex-1 border-l-2 ${isActive ? "border-l-white" : "border-l-transparent"} min-w-0`}>
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") {
                setEditValue(chat.title ?? "");
                setIsEditing(false);
              }
            }}
            onBlur={handleSaveTitle}
            onClick={(e) => e.stopPropagation()}
            className="text-sm pl-2 font-medium bg-transparent border border-emerald-500/40 rounded px-1 py-0.5 text-emerald-200 outline-none focus:border-emerald-400 w-full"
          />
        ) : (
          <p
            className={`text-sm pl-2 font-medium ${isActive ? "text-emerald-300" : "text-slate-400/90"} truncate`}
          >
            {chat.title}
          </p>
        )}
      </div>

      {!isEditing && (
        <div className="z-10 flex sm:hidden sm:group-hover:flex items-center gap-0.5 flex-shrink-0">
          <div
            onClick={startEditing}
            className="p-1 rounded-sm hover:bg-emerald-500/20 transition-colors duration-200"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500 hover:text-emerald-400 transition-colors" />
          </div>

          <DeleteDialog
            onConfirm={handleDeleteChat}
            title="Delete Chat"
            description="Are you sure you want to delete this chat? All the messages in this chat will also be deleted permanently."
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-sm hover:bg-red-500/20 transition-colors duration-200"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-400 transition-colors" />
            </div>
          </DeleteDialog>
        </div>
      )}
    </div>
  );
}

