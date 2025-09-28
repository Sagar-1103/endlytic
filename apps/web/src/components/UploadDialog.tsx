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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

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

    setUploading(true);
    const uuid = uuidv4();
    try {
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
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
    }
  };

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
      <DialogContent className="sm:max-w-md bg-[#1a201c] text-gray-100 border border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-emerald-300">
            Upload JSON File
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Only JSON files are supported.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {!file ? (
            <label
              htmlFor="file"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed cursor-pointer transition 
              ${isDragging ? "border-green-500 bg-gray-700" :"bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"}`}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-300 text-sm text-center">
                 Click or drag a JSON file to upload here
              </span>
              <input
                id="file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg sm:max-w-[400px]">
              <div className="flex items-center gap-2 truncate">
                <span className="hidden sm:block px-2 py-1 text-xs rounded bg-green-700 text-white">
                  JSON
                </span>
                <span className="max-w-[58vw] sm:max-w-xs text-gray-200">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-200 hover:!bg-gray-400 "
                onClick={() => setFile(null)}
              >
                <X size={20} />
              </Button>
            </div>
          )}

          {uploading && (
            <div>
              <Progress
                value={progress}
                className="w-full h-2 bg-gray-700 [&>div]:bg-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">Uploading… {progress}%</p>
            </div>
          )}
        </div>


        <DialogFooter className="sm:justify-between mt-6 sm:max-w-[400px]">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500"
          >
            <Upload size={18} />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
