"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import {  CopyIcon } from "@/lib/icons";
import { CheckIcon } from "lucide-react";

export default function CodeResponse({
  lang,
  code,
}: {
  lang: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative my-14">
      <SyntaxHighlighter
        language={lang}
        style={dracula}
        wrapLines={true}
        customStyle={{ backgroundColor: "#000", borderRadius: "0.5rem" }}
      >
        {code}
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
