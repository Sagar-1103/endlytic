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
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-[#0a0f0d] to-[#0d1210] text-[#e2e8f0] border border-emerald-900/30 shadow-2xl shadow-emerald-900/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-400">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-medium mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-3 mt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-emerald-900/30 bg-[#0b110f] text-slate-400 hover:text-slate-200 hover:bg-emerald-900/30 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="bg-red-600/90 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-900/20 active:scale-95 transition-all duration-300 cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
