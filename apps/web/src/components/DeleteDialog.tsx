import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

interface DeleteDialogProps {
  children: React.ReactNode;
  onConfirm?: () => void;
  title: string;
  description: string;
}

export function DeleteDialog({
  children,
  onConfirm,
  title,
  description,
}: DeleteDialogProps) {
   const [open, setOpen] = useState(false);
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0d1110] text-gray-200 border border-emerald-800">
        <DialogHeader>
          <DialogTitle className="text-emerald-400 font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-gray-700 bg-[#111715] hover:bg-[#1a1f1d] text-gray-300 hover:text-gray-300 cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/3 cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
