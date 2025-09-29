"use client";
import { useState } from "react";
import {  CopyIcon } from "@/lib/icons"; // or any icons you have
import { CheckIcon } from "lucide-react";

export default function JsonResponse({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="relative my-10">
      <pre className="bg-[#000] text-white p-3 rounded-md overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 bg-gray-900 rounded hover:bg-gray-800 flex items-center gap-1"
      >
        {copied ? <CheckIcon className="w-4 h-4 text-white" /> : <CopyIcon className="w-4 h-4 text-white" />}
        <span className="text-xs text-white">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
