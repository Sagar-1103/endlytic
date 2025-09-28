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

export default function RadioGroup() {
  const { activeCollection, setActiveCollection } = useActiveCollectionStore();
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = async () => {
    try {
      const response = await axios.get("/api/collections");
      const res = await response.data;
      setCollections(res.collections || []);
      if (res.collections && res.collections.length===1 && res.collections[0]) {
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
        <Button className="bg-[#161f19] cursor-pointer hover:bg-[#1e2e24] border-2 border-emerald-900/40">
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
              localStorage.setItem("activeCollection", JSON.stringify(selected));
            }
          }}
        >
          {collections.map((collection) => {
            if (!collection.indexed) return;
            return (
            <DropdownMenuRadioItem
              key={collection.id}
              value={collection.id.toString()}
            >
              {collection.title.split(".postman_collection.json")[0]}
            </DropdownMenuRadioItem>
          )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
