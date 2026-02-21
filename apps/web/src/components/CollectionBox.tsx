"use client";

import { timeAgo } from "@/lib/utils";
import axios from "axios";
import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteDialog } from "./DeleteDialog";
import { getSession } from "next-auth/react";
import { Badge } from "./ui/badge";

interface CollectionBoxProps {
  title: string;
  id: string;
  description: string | null;
  url: string | null;
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
      axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.jwtToken}`
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

  const handleDownload = async () => {
    if (!collection.url) {
      toast.error("Download URL not available for this collection.");
      return;
    }
    const cleanName = collection.title?.split(".postman_collection.json")?.[0] || "collection";
    const fileName = `${cleanName}.postman_collection.json`;

    try {
      toast.info(`Preparing download for ${cleanName}...`);
      const response = await fetch(collection.url);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
      toast.success(`Downloading ${cleanName}...`);
    } catch {
      toast.error("Failed to download the collection. Please try again.");
    }
  };

  return (
    <div className="border-gray-400/20 border h-fit py-2 pl-3 sm:p-4 group relative hover:bg-gray-400/10 cursor-pointer rounded-lg mr-[3px]">
      <p className="font-medium text-sm sm:text-base truncate flex items-center gap-2">
        {collection.title?.split(".postman_collection.json")?.[0]}
        <Badge
          className={`text-[10px] ${collection.indexed ? "bg-emerald-500" : "bg-yellow-500"} sm:text-xs px-2 py-[1px]`}
        >
          {collection.indexed ? "Processed" : "Processing..."}
        </Badge>
      </p>
      <span className="text-xs sm:text-sm text-gray-300/70 block">
        Uploaded {timeAgo(displayTime)}
      </span>

      <div className="absolute flex items-center gap-1 top-2 sm:top-4 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
        {collection.url && (
          <div
            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
            className="hover:bg-gray-600 p-1 rounded-sm"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 hover:text-emerald-400 text-gray-400" />
          </div>
        )}

        {collection.indexed && (
          <DeleteDialog
            onConfirm={() => handleDeleteCollection(collection.id)}
            title="Delete Collection"
            description="Are you sure you want to delete this collection? This action cannot be undone."
          >
            <div className="hover:bg-gray-600 p-1 rounded-sm">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-400 text-gray-400" />
            </div>
          </DeleteDialog>
        )}
      </div>
    </div>
  );
}
