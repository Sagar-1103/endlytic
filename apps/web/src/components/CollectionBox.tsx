"use client";

import { timeAgo } from "@/lib/utils";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteDialog } from "./DeleteDialog";
import { getSession } from "next-auth/react";
import { Badge } from "./ui/badge";

interface CollectionBoxProps {
  title: string;
  id: string;
  description: string | null;
  indexed: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CollectionBox(collection: CollectionBoxProps) {
  const displayTime = collection.updatedAt ? collection.updatedAt : collection.createdAt;
  const router = useRouter();
  
  const handleDeleteCollection = async (id: string) => {
    const session = await getSession();
    if (!session?.jwtToken) return;
    toast.promise(  
      axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/${id}`,{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${session.jwtToken}`
        }
      }).then((res) => {
        router.refresh();
        console.log(res);
        return res;
      }),
      {
        loading: "Deleting collection...",
        success: () => `${collection.title?.split(".postman_collection.json")?.[0] || "Untitled Collection"} was permanently deleted`,
        error: "Failed to delete collection. Please try again later.",
      },
    );
  };

  return (
    <div className="border-gray-400/20 border h-fit py-2 pl-3 sm:p-4 group relative hover:bg-gray-400/10 cursor-pointer rounded-lg mr-[3px]">
      <p className="font-medium text-sm sm:text-base truncate flex items-center gap-2">
        {collection.title?.split(".postman_collection.json")?.[0]}
        <Badge
          className={`text-[10px] ${collection.indexed?"bg-emerald-500":"bg-yellow-500"} sm:text-xs px-2 py-[1px]`}
        >
          {collection.indexed ? "Processed" : "Processing..."}
        </Badge>
      </p>
      <span className="text-xs sm:text-sm text-gray-300/70 block">
        Uploaded {timeAgo(displayTime)}
      </span>
      <DeleteDialog onConfirm={()=>handleDeleteCollection(collection.id)} title="Delete Collection" description="Are you sure you want to delete this collection? This action cannot be undone." >
        <div className="absolute hidden group-hover:block top-4 sm:top-6 hover:bg-gray-600 p-1 rounded-sm right-3">
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-400 group-hover:text-gray-400" />
        </div>
      </DeleteDialog>
    </div>
  );
}
