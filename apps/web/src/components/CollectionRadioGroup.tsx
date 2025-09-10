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

export default function RadioGroup() {
  const { activeCollection, setActiveCollection } = useActiveCollectionStore();
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = async () => {
    try {
      const response = await fetch("/api/collections");
      const res = await response.json();
      setCollections(res.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#0f1411] cursor-pointer hover:bg-[#0f1411] border-2 border-emerald-900/40">
          {activeCollection
            ? activeCollection.title.split(".postman_collection.json")[0]
            : "Select Collection"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose Collection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeCollection?.id?.toString() || ""}
          onValueChange={(val) => {
            const selected = collections.find((c) => c.id.toString() === val);
            if (selected) {
              setActiveCollection(selected);
            }
          }}
        >
          {collections.map((collection) => (
            <DropdownMenuRadioItem
              key={collection.id}
              value={collection.id.toString()}
            >
              {collection.title.split(".postman_collection.json")[0]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
