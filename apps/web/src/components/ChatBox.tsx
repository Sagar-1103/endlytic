"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowUpCircle, Mic, Paperclip } from "lucide-react";
import RadioGroup from "./CollectionRadioGroup";
import { UploadDialog } from "./UploadDialog";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useActiveCollectionStore } from "@/store/useStore";

export default function ChatBox() {
  const [chatInput, setChatInput] = useState("");
  const pathname = usePathname();
  const chatId = pathname.split("/chat/")?.[1];
  const { activeCollection } = useActiveCollectionStore();
  const router = useRouter();

  const handleSendMessage = async () => {
    try {
      if (!activeCollection) return;
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/query`;
      const session = await getSession();
      if (!session?.jwtToken) return;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwtToken}`,
        },
        body: JSON.stringify({ query: chatInput,collectionId:activeCollection.id,chatId:chatId }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let result;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          result = JSON.parse(chunk);
        }
      }
      setChatInput("");
      if(!chatId) {
        router.push(`/chat/${result.chatId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="absolute w-full bottom-0 flex flex-col gap-y-3">
      <div className="w-[80%] mx-auto flex flex-row justify-end gap-x-4">
        {/* <Button className="bg-[#0f1411] cursor-pointer hover:bg-[#0f1411] border-2 border-emerald-900/40">
          Model
        </Button> */}
        <RadioGroup />
      </div>
      <div className="sm:w-[80%] max-w-5xl border-2 border-emerald-900/20 bg-[#0f1411] sm:mx-auto rounded-2xl p-1 sm:p-3">
        <Textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="border-none focus-visible:ring-0 resize-none outline-none text-white placeholder-gray-400 w-full md:text-md max-h-[250px] overflow-y-auto custom-scrollbar"
          placeholder="Ask me anything about your API..."
        />

        <div className="flex justify-between items-center mt-2">
          <UploadDialog>
            <button className="p-2 cursor-pointer hover:bg-gray-600/30 rounded-md transition">
              <Paperclip className="text-white w-5 h-5" />
            </button>
          </UploadDialog>

          <div className="flex gap-2">
            <button className="p-2 cursor-pointer hover:bg-gray-600/30 rounded-md transition">
              <Mic className="text-white w-5 h-5" />
            </button>
            <button
              disabled={chatInput ? false : true}
              onClick={handleSendMessage}
              className={`p-2 bg-gradient-to-b ${chatInput.length ? "from-emerald-300 to-emerald-400 hover:from-emerald-500 cursor-pointer" : "from-emerald-300/30 to-emerald-300/30"} rounded-md transition`}
            >
              <ArrowUpCircle className="text-black  w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* <div className="w-[80%] mx-auto flex flex-row gap-x-4 justify-center">
        <Button className="bg-[#0f1411] hover:bg-[#0f1411] border-2 cursor-pointer border-emerald-900/40">
          Write
        </Button>
        <Button className="bg-[#0f1411] hover:bg-[#0f1411] border-2 cursor-pointer border-emerald-900/40">
          Learn
        </Button>
        <Button className="bg-[#0f1411] hover:bg-[#0f1411] border-2 cursor-pointer border-emerald-900/40">
          Code
        </Button>
      </div> */}
    </div>
  );
}
