"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowUpCircle, Mic, Paperclip } from "lucide-react";
import RadioGroup from "./CollectionRadioGroup";

export default function ChatBox() {
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="absolute w-full bottom-0 flex flex-col gap-y-3">
      <div className="w-[80%] mx-auto flex flex-row justify-end gap-x-4">
        <Button className="bg-[#0f1411] cursor-pointer hover:bg-[#0f1411] border-2 border-emerald-900/40">
          Model
        </Button>
        <RadioGroup />
      </div>
      <div className="w-[80%] border-2 border-emerald-900/20 bg-gray-700/20 mx-auto rounded-2xl p-3">
        <Textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="border-none focus-visible:ring-0 resize-none outline-none text-white bg-transparent placeholder-gray-400 w-full md:text-md max-h-[250px] overflow-y-auto custom-scrollbar"
          placeholder="Ask me anything about your API..."
        />

        <div className="flex justify-between items-center mt-2">
          <button className="p-2 cursor-pointer hover:bg-gray-600/30 rounded-md transition">
            <Paperclip className="text-white w-5 h-5" />
          </button>

          <div className="flex gap-2">
            <button className="p-2 cursor-pointer hover:bg-gray-600/30 rounded-md transition">
              <Mic className="text-white w-5 h-5" />
            </button>
            <button
              disabled={chatInput ? true : false}
              className={`p-2 bg-gradient-to-b ${chatInput.length ? "from-emerald-300 to-emerald-400 hover:from-emerald-500 cursor-pointer" : "from-emerald-300/30 to-emerald-300/30"} rounded-md transition`}
            >
              <ArrowUpCircle className="text-black  w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-[80%] mx-auto flex flex-row gap-x-4 justify-center">
        <Button className="bg-[#0f1411] hover:bg-[#0f1411] border-2 cursor-pointer border-emerald-900/40">
          Write
        </Button>
        <Button className="bg-[#0f1411] hover:bg-[#0f1411] border-2 cursor-pointer border-emerald-900/40">
          Learn
        </Button>
        <Button className="bg-[#0f1411] hover:bg-[#0f1411] border-2 cursor-pointer border-emerald-900/40">
          Code
        </Button>
      </div>
    </div>
  );
}
