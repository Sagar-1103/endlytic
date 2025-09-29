"use client";
import { timeAgo } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChatsStore } from "@/store/useChatsStore";

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
  const { deleteChat } = useChatsStore();

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

  return (
    <div className="border-gray-400/20 border py-2 pl-3 sm:p-4 group relative hover:bg-gray-400/10 cursor-pointer rounded-lg mr-[3px]">
      <Link href={`/chat/${chat.id}`}>
        <p className="font-medium text-sm sm:text-base truncate">{chat.title}</p>
        <span className="text-xs sm:text-sm text-gray-300/70 block">
          Last message {timeAgo(displayTime)}
        </span>
      </Link>

      <DeleteDialog onConfirm={()=>handleDeleteChat(chat.id)} title="Delete Chat" description="Are you sure you want to delete this chat? All the messages in this chat will also be deleted permanently." >
        <div className="absolute hidden group-hover:block top-4 sm:top-6 hover:bg-gray-600 p-1 rounded-sm right-3">
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-400 group-hover:text-gray-400" />
        </div>
      </DeleteDialog>
    </div>
  );
}
