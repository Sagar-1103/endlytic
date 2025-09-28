"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { ArrowUpCircle, Mic, Paperclip } from "lucide-react";
import RadioGroup from "./CollectionRadioGroup";
import { UploadDialog } from "./UploadDialog";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useActiveCollectionStore, useChatMessagesStore, useChatTitleStore } from "@/store/useStore";
import { v4 as uuidv4 } from 'uuid';
import { useIsStreamingStore } from "@/store/useChatsStore";

export default function ChatBox() {
  const [chatInput, setChatInput] = useState("");
  const pathname = usePathname();
  const { activeCollection } = useActiveCollectionStore();
  const router = useRouter();
  const { addMessage } = useChatMessagesStore();
  const { setChatTitle } = useChatTitleStore();
  const { setIsStreaming } = useIsStreamingStore();

  const handleSendMessage = async () => {
    try {
      if (!activeCollection) return;
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/query`;
      const session = await getSession();
      if (!session?.jwtToken) return;
      const chatId = pathname.split("/chat/")?.[1] || uuidv4();
      if (!pathname.split("/chat/")?.[1]) {
        localStorage.setItem("newId", chatId);
        router.push(`/chat/${chatId}`);
      }
      setChatInput("");
      addMessage("User",JSON.stringify({text:chatInput}));
      setIsStreaming(true);

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
          addMessage("Ai",chunk);
          try {
            result = JSON.parse(chunk);
          } catch (error) {
            console.log("error parsing chunk");
          }
        }
      }

      setChatTitle(result.title)
      setIsStreaming(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute w-full bottom-0 flex flex-col gap-y-3">
      <div className="w-[80%] max-w-[75rem] mx-auto flex flex-row justify-end gap-x-4">
        <RadioGroup />
      </div>
      <div className="pb-4 w-[88%] sm:w-[80%] max-w-[75rem] sm:mx-auto  bg-[#0f1411]">
      <div className="w-full w-min-[0] border-2 border-emerald-900/20 bg-[#161f19] mx-auto rounded-2xl p-3">
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
              disabled={activeCollection && chatInput ? false : true}
              onClick={handleSendMessage}
              className={`p-2 bg-gradient-to-b ${activeCollection && chatInput.length ? "from-emerald-300 to-emerald-400 hover:from-emerald-500 cursor-pointer" : "from-emerald-300/30 to-emerald-300/30"} rounded-md transition`}
            >
              <ArrowUpCircle className="text-black  w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
