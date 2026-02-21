"use client";
import axios from "axios";
import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface UploadDialogProps {
  children: React.ReactNode;
}

export function UploadDialog({ children }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;
    const uuid = uuidv4();

    toast.promise(
      (async () => {
        setUploading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/presigned-url?fileName=${file.name}-${uuid}&fileType=${file.type}`,
          {
            headers: {
              Authorization: `Bearer ${data?.jwtToken}`,
            },
          }
        );
        const url = response.data.url;

        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        });

        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/complete`,
          { fileName: `${file.name}-${uuid}` },
          {
            headers: {
              Authorization: `Bearer ${data?.jwtToken}`,
            },
          }
        );
        setProgress(100);

        setTimeout(() => {
          setUploading(false);
          setFile(null);
          setOpen(false);
          router.refresh();
        }, 800);
        return `${file.name?.split(".postman_collection.json")?.[0]} uploaded successfully`;
      })(), {
      success: (msg) => msg,
      error: "Upload failed",
    }
    )
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/json") {
      setFile(droppedFile);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#0a0f0d] to-[#0d1210] text-[#e2e8f0] border border-emerald-900/30 shadow-2xl shadow-emerald-900/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
            Upload JSON File
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-medium">
            Select or drag your Postman collection JSON file here.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {!file ? (
            <label
              htmlFor="file"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center min-h-[160px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group
              ${isDragging
                  ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                  : "bg-[#0b110f] border-emerald-900/30 hover:border-emerald-500/50 hover:bg-emerald-500/5"}`}
            >
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300 mb-3">
                <Upload className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-center px-4">
                <p className="text-slate-200 font-semibold mb-1">
                  Click or drag file to upload
                </p>
                <p className="text-emerald-500/60 text-xs">
                  Supported format: .json
                </p>
              </div>
              <input
                id="file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between bg-[#0b110f] border border-emerald-500/20 p-4 rounded-xl shadow-inner shadow-emerald-900/20">
              <div className="flex items-center gap-3 truncate">
                <div className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  JSON
                </div>
                <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                onClick={() => setFile(null)}
              >
                <X size={18} />
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2 px-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Uploading collection...</span>
                <span className="text-emerald-400">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="w-full h-1.5 bg-[#0b110f] border border-emerald-900/30 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-300 transition-all duration-300"
              />
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end gap-3 mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFile(null);
              }}
              className="border-emerald-900/30 bg-[#0b110f] text-slate-400 hover:text-slate-200 hover:bg-emerald-900/30 hover:border-emerald-500/30 transition-all duration-300"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/10 border-t border-white/10 active:scale-95 transition-all duration-300 px-6"
          >
            {uploading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {uploading ? "Uploading..." : "Upload Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
