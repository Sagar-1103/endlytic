"use client";
import { CopyIcon, RetryIcon, ShareIcon } from "@/lib/icons";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import CodeResponse from "./CodeResponse";
import TextResponse from "./TextResponse";
import { Message } from "@/types";

export default function AiChat({ message }: { message: Message }) {

   const content = JSON.parse(message.content);
   return (
      <div className="flex flex-col rounded-2xl mr-auto text-[#FAFAFA] w-fit max-w-[60%]">
         <div className="px-4 py-1.5">
                     {content.text && <TextResponse value={content.text} />}
                     {content.code && <CodeResponse code={content.code} />}
            {/* {exampleChat.map((res, i) => (
               <div key={i}>
                  {(() => {
                     switch (res.type) {
                        case "text":
                           return <TextResponse value={res.value} />;
                        case "list":
                           return <ListResponse items={res.items} />;
                        case "table":
                           return <TableResponse headers={res.headers} rows={res.rows} />;
                        case "code":
                           return <CodeResponse lang={res.lang} code={res.code} />;
                        case "json":
                           return <JsonResponse data={res.data} />;
                        default:
                           return <p className="text-red-400">Unsupported response type</p>;
                     }
                  })()}
               </div>
            ))} */}
         </div>

         <div className="flex justify-start gap-3 mt-2">
            <span className="cursor-pointer" data-tooltip-id="icon-tooltip" data-tooltip-content="Copy" >
               <CopyIcon className="w-[20px] h-[20px] text-white" />
            </span>
            <span className="cursor-pointer" data-tooltip-id="icon-tooltip" data-tooltip-content="Share"><ShareIcon /></span>
            <span className="cursor-pointer" data-tooltip-id="icon-tooltip" data-tooltip-content="Retry"><RetryIcon /></span>
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