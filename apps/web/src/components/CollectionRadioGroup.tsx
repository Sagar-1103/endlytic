"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Collection } from "lib/types";
import { useActiveCollectionStore } from "@/store/useStore";
import axios from "axios";
import { FolderOpen, Layers, ChevronDown } from "lucide-react";

export default function RadioGroup() {
  const { activeCollection, setActiveCollection } = useActiveCollectionStore();
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = async () => {
    try {
      const response = await axios.get("/api/collections");
      const res = await response.data;
      setCollections(res.collections || []);
      if (res.collections && res.collections.length === 1 && res.collections[0]) {
        setActiveCollection(res.collections[0]);
        localStorage.setItem("activeCollection", JSON.stringify(res.collections[0]));
      } else {
        const stored = localStorage.getItem("activeCollection");
        if (stored) {
          const parsed = JSON.parse(stored);
          const exists = res.collections.find((c: Collection) => c.id === parsed.id);
          if (exists) setActiveCollection(parsed);
        }
      }
    } catch (error) {
      console.log("Error fetching collections:", error);
      setCollections([]);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#161f19] cursor-pointer hover:bg-[#1e2e24] border-2 border-emerald-900/40 rounded-lg flex items-center gap-2 transition-all duration-300 px-4 py-2 text-zinc-100 font-medium">
          <Layers className="w-4 h-4 text-emerald-500/80" />
          <span className="truncate max-w-[150px]">
            {activeCollection
              ? activeCollection.title.split(".postman_collection.json")[0]
              : "Select Collection"}
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-[#0E1A14] border border-[#1A2B22]">
        <DropdownMenuLabel className="!text-[#E5E5E5] ">Choose Collection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeCollection?.id?.toString() || ""}
          onValueChange={(val) => {
            const selected = collections.find((c) => c.id.toString() === val);
            if (selected) {
              setActiveCollection(selected);
              localStorage.setItem("activeCollection", JSON.stringify(selected));
            }
          }}
        >
          {collections.filter(c => c.indexed).length > 0 ? (
            collections.map((collection) => {
              if (!collection.indexed) return null;
              return (
                <DropdownMenuRadioItem
                  key={collection.id}
                  value={collection.id.toString()}
                  className="!text-[#E5E5E5] hover:!bg-[#22C55E]/10 hover:!text-emerald-300 cursor-pointer"
                >
                  {collection.title?.split(".postman_collection.json")?.[0]}
                </DropdownMenuRadioItem>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-2 text-center">
              <div className="bg-emerald-500/10 p-2 rounded-full mb-2">
                <FolderOpen className="w-5 h-5 text-emerald-500/50" />
              </div>
              <p className="text-xs text-zinc-400 font-medium">No collections found</p>
              <p className="text-[10px] text-zinc-500 mt-1">Upload a Postman collection to get started</p>
            </div>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
