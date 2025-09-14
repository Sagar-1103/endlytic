"use client";
import { CopyIcon, RetryIcon, ShareIcon } from "@/lib/icons";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import CodeResponse from "./CodeResponse";
import JsonResponse from "./JsonResponse";
import ListResponse from "./ListResponse";
import TableResponse from "./TableResponse";
import TextResponse from "./TextResponse";
import { AIResponse } from "@/lib/utils";

const aiResponses: Record<string, AIResponse> = {
   text: {
      type: "text",
      value: "React is a JavaScript library for building user interfaces. It uses a component-based architecture and declarative syntax to make building UIs easier and more maintainable."
   },

   list: {
      type: "list",
      items: [
         "Install dependencies with npm or yarn",
         "Set up a project structure",
         "Create reusable components",
         "Run the development server",
         "Deploy the application"
      ]
   },

   table: {
      type: "table",
      headers: ["Algorithm", "Time Complexity", "Best Case", "Worst Case"],
      rows: [
         ["Bubble Sort", "O(n²)", "O(n)", "O(n²)"],
         ["Quick Sort", "O(n log n)", "O(n log n)", "O(n²)"],
         ["Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)"],
         ["Binary Search", "O(log n)", "O(1)", "O(log n)"]
      ]
   },

   code: {
      type: "code",
      lang: "python",
      code: `
def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]

    seq = [0, 1]
    for i in range(2, n):
        seq.append(seq[i-1] + seq[i-2])
    return seq

def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

print("First 10 Fibonacci numbers:", fibonacci(10))
print("Factorial of 5:", factorial(5))
`
   },

   json: {
      type: "json",
      data: {
         id: 101,
         name: "Alice",
         email: "alice@example.com",
         roles: ["admin", "editor"],
         active: true,
         profile: {
            age: 29,
            location: "San Francisco",
            preferences: {
               theme: "dark",
               notifications: true
            }
         }
      }
   },
};



export default function AiChat({ query }: { query: string }) {
   return (
      <div className="flex flex-col rounded-2xl mr-auto text-[#FAFAFA] w-fit max-w-[60%]">
         {/* <div className="  px-4 py-1.5">
            {query}
         </div> */}
         <div className="px-4 py-1.5">
            {Object.values(aiResponses).map((res, i) => (
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
            ))}
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