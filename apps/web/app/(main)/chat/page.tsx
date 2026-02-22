"use client";
import { useChatMessagesStore } from "@/store/useStore";
import Image from "next/image";
import { useEffect } from "react";

export default function Page() {
  const { clearChatMessages } = useChatMessagesStore();
  useEffect(() => {
    clearChatMessages();
  }, []);

  const features = [
    {
      title: "API Understanding",
      description: "Upload collections, ask questions in natural language and explore endpoints with ease.",
    },
    {
      title: "Code Generation",
      description: "Auto-generate code snippets in multiple languages and dummy request bodies",
    },
    {
      title: "Developer Productivity",
      description: "Save and revisit past conversations, reuse queries and speed up your API development workflow.",
    },
  ];

  return (
    <div className="relative flex flex-col h-full items-center px-3 select-none">
      <div className="text-center pt-0">
        <Image
          className="rounded-full mx-auto mb-8 scale-220"
          src={"/endlytic-dark.svg"}
          alt="logo"
          height={130}
          width={130}
        />
        <p className="text-emerald-300 font-semibold text-3xl sm:text-4xl mb-2">
          How can I help you today?
        </p>
        <p className="text-gray-400 font-medium text-sm sm:text-base max-w-md mt-4 mx-auto mb-10">
          Ask me anything or start a conversation to explore the power of your
          Endlytic AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mb-16 pb-52 sm:pb-40">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-[#0f1411] border border-gray-700 rounded-xl p-3 text-center hover:scale-103 hover:shadow-xl transition-transform duration-300 cursor-default"
          >
            <p className="text-emerald-400 font-semibold text-lg mb-2">
              {feature.title}
            </p>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
