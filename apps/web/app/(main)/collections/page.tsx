"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collections } from "@/data/sidebar-data";
import { Ellipsis, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Collections() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full max-w-[45rem] h-full mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-6 mb-6 sm:mb-8 justify-between items-start sm:items-center">
        <p className="text-emerald-300 text-2xl sm:text-3xl font-semibold">
          Your collections
        </p>
        <Button
          onClick={() => router.push("/chat")}
          className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-500"
        >
          <div className="flex gap-x-2 justify-center items-center font-medium text-gray-100">
            <Plus className="w-8 h-8" />
            <p>New Collection</p>
          </div>
        </Button>
      </div>

      <div>
        <Input
          className="border-gray-400/50 h-10 selection:bg-emerald-300 selection:text-black text-white font-medium w-full"
          placeholder="Search your collections..."
        />
      </div>

      <div className="text-slate-300 text-xs sm:text-sm pl-1 sm:pl-2 my-3">
        <p>{collections.length ? collections.length : "No"} collections with Endlyptic</p>
      </div>

      <div className="text-white grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto custom-scrollbar">
        {collections.length !== 0 &&
          collections.map((collection) => (
            <div
              key={collection.id}
              className="border-gray-400/20 border h-fit py-2 pl-3 sm:p-4 group relative hover:bg-gray-400/10 cursor-pointer rounded-lg mr-[3px]"
            >
              <p className="font-medium text-sm sm:text-base truncate">{collection.title}</p>
              <span className="text-xs sm:text-sm text-gray-300/70 block">
                Uploaded 6 minutes ago
              </span>
              <div className="absolute hidden group-hover:block top-4 sm:top-6 hover:bg-gray-600 p-1 rounded-sm right-3">
                <Ellipsis className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white group-hover:text-gray-400" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
