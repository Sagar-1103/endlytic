"use client";
import { timeAgo } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChatsStore } from "@/store/useChatsStore";
import { useRef, useState, useEffect } from "react";
import { useChatTitleStore } from "@/store/useStore";

interface ChatRoomBoxProps {
  title: string | null;
  id: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatRoomBox(chat: ChatRoomBoxProps) {
  const displayTime = chat.updatedAt ? chat.updatedAt : chat.createdAt;
  const router = useRouter();
  const { deleteChat, updateChatTitle } = useChatsStore();
  const { setChatTitle } = useChatTitleStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(chat.title ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDeleteChat = async (id: string) => {
    toast.promise(
      axios.delete(`/api/chat/${id}`).then((res) => {
        deleteChat(id);
        router.refresh();
        return res.data;
      }),
      {
        loading: "Deleting chat...",
        success: () => `${chat.title || "Untitled Chat"} was permanently deleted`,
        error: "Failed to delete chat. Please try again later.",
      },
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
      setChatTitle(trimmed);
      toast.success("Chat renamed");
    } catch {
      toast.error("Failed to rename chat");
      setEditValue(chat.title ?? "");
    }
    setIsEditing(false);
  };

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditValue(chat.title ?? "");
    setIsEditing(true);
  };

  return (
    <div className="border-gray-400/20 border py-2 pl-3 sm:p-4 group relative hover:bg-gray-400/10 cursor-pointer rounded-lg mr-[3px]">
      {isEditing ? (
        <div className="pr-16">
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
            className="font-medium text-sm sm:text-base bg-transparent border border-emerald-500/40 rounded px-2 py-0.5 text-emerald-200 outline-none focus:border-emerald-400 w-full"
          />
          <span className="text-xs sm:text-sm text-gray-300/70 block mt-1">
            Last message {timeAgo(displayTime)}
          </span>
        </div>
      ) : (
        <Link href={`/chat/${chat.id}`}>
          <p className="font-medium text-sm sm:text-base truncate pr-16">{chat.title}</p>
          <span className="text-xs sm:text-sm text-gray-300/70 block">
            Last message {timeAgo(displayTime)}
          </span>
        </Link>
      )}

      <div className="absolute flex sm:hidden sm:group-hover:flex items-center gap-1 top-4 sm:top-6 right-3">
        {!isEditing && (
          <div
            onClick={startEditing}
            className="hover:bg-gray-600 p-1 rounded-sm"
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-emerald-400 transition-colors" />
          </div>
        )}

        <DeleteDialog onConfirm={() => handleDeleteChat(chat.id)} title="Delete Chat" description="Are you sure you want to delete this chat? All the messages in this chat will also be deleted permanently." >
          <div className="hover:bg-gray-600 p-1 rounded-sm">
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-400 group-hover:text-gray-400" />
          </div>
        </DeleteDialog>
      </div>
    </div>
  );
}

