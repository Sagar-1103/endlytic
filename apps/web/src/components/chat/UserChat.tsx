"use client";
import { CopyIcon ,EditIcon } from "@/lib/icons";
import { Tooltip } from 'react-tooltip'
import { CheckIcon } from "lucide-react";
import { useState } from "react";


export default function UserChat({ text }: { text: string }) {
   const [copied, setCopied] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [editedText, setEditedText] = useState(text);
   const [currentQuery, setCurrentQuery] = useState(text);

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(currentQuery);
         setCopied(true);

         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error("Failed to copy text: ", err);
      }
   };

   const handleEdit = () => {
      setEditedText(currentQuery);
      setIsEditing(true);
   };

   const handleCancel = () => {
      setIsEditing(false);
      setEditedText(currentQuery);
   };

   const handleSave = () => {
      setCurrentQuery(editedText);
      setIsEditing(false);
   };

   return (
      <div className="group flex flex-col  ml-auto w-fit max-w-[60%]">
         {!isEditing ? (
            <div className="rounded-2xl bg-[#303030]  text-[#FAFAFA] px-4 py-1.5">
               {currentQuery}
            </div>
         ) : (
            <textarea
               className=" rounded-2xl bg-[#303030] text-[#FAFAFA] px-4 py-1.5 focus:outline-none"
               value={editedText}
               onChange={(e) => setEditedText(e.target.value)}
            />
         )}
         {isEditing ?
            <>
               <div className="flex justify-end mt-1 gap-1">
                  <button
                     onClick={handleCancel}
                     className="px-3 py-1 rounded-lg bg-gray-600 text-white text-sm hover:bg-gray-500"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={handleSave}
                     className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-500"
                  >
                     Save
                  </button>
               </div>
            </>
            :
            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
               <span className="cursor-pointer" onClick={handleCopy}>
                  {copied ? (
                     <CheckIcon className="text-white w-[20px] h-[20px]" />
                  ) : (
                     <CopyIcon className="w-[20px] h-[20px] text-white" data-tooltip-id="icon-tooltip" data-tooltip-content="Copy" />
                  )}
               </span>
               <span className="cursor-pointer" onClick={handleEdit} data-tooltip-id="icon-tooltip" data-tooltip-content="Edit"><EditIcon /></span>
               <Tooltip
               id="icon-tooltip"
               place="bottom"
               className="bg-[#202020]! text-white text-xs! rounded-lg! "
               noArrow
            />
            </div>
         }
      </div>
   )
}