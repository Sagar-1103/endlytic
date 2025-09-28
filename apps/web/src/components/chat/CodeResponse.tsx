"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import {  CopyIcon } from "@/lib/icons";
import { CheckIcon } from "lucide-react";

export default function CodeResponse({
  code,
}: {
  code: any;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative mt-14">
      <SyntaxHighlighter
        language={code.language}
        style={dracula}
        wrapLines={true}
        customStyle={{ backgroundColor: "#000", borderRadius: "0.5rem" ,fontSize: "0.9rem", }}
        
      >
        {code.content}
      </SyntaxHighlighter>

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
