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
import { useState } from "react";
import { collections } from "@/data/sidebar-data";

export default function RadioGroup() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const selectedCollection = collections.find((c) => c.id.toString() === selectedCollectionId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#0f1411] cursor-pointer hover:bg-[#0f1411] border-2 border-emerald-900/40">
          {selectedCollection ? selectedCollection.title : "Select Collection"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose Collection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedCollectionId || undefined}
          onValueChange={setSelectedCollectionId}
        >
          {collections.map((collection) => (
            <DropdownMenuRadioItem
              key={collection.id}
              value={`${collection.id}`}
            >
              {collection.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
