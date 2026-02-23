"use client";
import { CopyIcon } from "@/lib/icons";
import { Tooltip } from 'react-tooltip'
import { CheckIcon } from "lucide-react";
import { useState } from "react";


export default function UserChat({ text }: { text: string }) {
   const [copied, setCopied] = useState(false);

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(text);
         setCopied(true);

         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error("Failed to copy text: ", err);
      }
   };

   return (
      <div className="group flex flex-col  ml-auto w-fit max-w-[85%] md:max-w-[60%]">
         <div className="rounded-2xl bg-[#303030] text-sm sm:text-base  text-[#FAFAFA] px-4 py-1.5">
            {text}
         </div>
         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
            <span className="cursor-pointer" onClick={handleCopy}>
               {copied ? (
                  <CheckIcon className="text-white w-[20px] h-[20px]" />
               ) : (
                  <CopyIcon className="w-[20px] h-[20px] text-white" data-tooltip-id="icon-tooltip" data-tooltip-content="Copy" />
               )}
            </span>
            <Tooltip
               id="icon-tooltip"
               place="bottom"
               className="bg-[#202020]! text-white text-xs! rounded-lg! "
               noArrow
            />
         </div>
      </div>
   )
}
