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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 text-gray-100 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-100">
            Upload JSON File
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Only JSON files are supported.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="file" className="text-gray-300">
              Choose JSON File
            </Label>
            <Input
              id="file"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="bg-gray-800 border-gray-700 text-gray-100 file:bg-gray-700 file:text-gray-100"
            />
          </div>

          {file && (
            <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg">
              <span className="truncate max-w-xs">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
                onClick={() => setFile(null)}
              >
                <X size={16} />
              </Button>
            </div>
          )}

          {uploading && (
            <Progress
              value={progress}
              className="w-full h-2 bg-gray-700 [&>div]:bg-green-500"
            />
          )}
        </div>

        <DialogFooter className="sm:justify-between mt-6">
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
