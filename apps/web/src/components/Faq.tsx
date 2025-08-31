"use client";
import { Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

export default function Faq() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
    const faqs = [
    {
        id: 1,
        question: "What is Endlytic and how does it work?",
        answer:
        "Endlytic is an AI powered API explorer that helps developers understand, test and integrate APIs faster. Upload your API spec or Postman collection and get instant insights, code snippets and explanations in natural language.",
    },
    {
        id: 2,
        question: "Can I use Endlytic for free?",
        answer:
        "Yes! Endlytic offers a free plan with core features like API exploration, natural language search and code snippet generation. You can upgrade anytime for advanced features like team workspaces.",
    },
    {
        id: 3,
        question: "What integrations does Endlytic support?",
        answer:
        "Endlytic supports Postman collections, OpenAPI/Swagger specs and tools like Notion, Slack and VS Code extensions for seamless developer workflows.",
    },
    {
        id: 4,
        question: "How secure is Endlytic?",
        answer:
        "We take security seriously. Endlytic uses encryption for all API specs, supports OAuth-based authentication and never shares your data with third parties.",
    },
    ];


  const handleFaq = (id: number) => {
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
  };

  return (
    <div className="w-[60%] mx-auto flex flex-row gap-x-10 mb-20 text-white">
      <div className="w-1/2">
        <Badge className="bg-[#071113] py-2 px-3 mx-auto rounded-2xl my-auto border-[#7bb7a2]/30">
          <p className="bg-gradient-to-r text-sm from-[#00e593] to-white text-transparent bg-clip-text">
            FAQ
          </p>
        </Badge>
        <p className="text-5xl font-semibold my-4">
          Got questions?
          <br /> We&apos;ve got answers.
        </p>
        <p className="text-gray-400 text-lg">
          Find answers to common questions about Endlytic and its capabilities.
        </p>
      </div>

      <div className="w-1/2 flex flex-col py-14 gap-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            onClick={() => handleFaq(faq.id)}
            className="bg-[#0c0e13] border-t-1 border-1 border-gray-800/60 border-t-gray-500/60 rounded-2xl cursor-pointer hover:scale-101 transition-all duration-200 ease-in-out overflow-hidden"
          >
            <div className="flex justify-between items-center p-5">
              <p className="font-medium text-md">{faq.question}</p>
              <Plus
                className={`transform transition-transform duration-500 ease-in-out ${
                  selectedId === faq.id ? "rotate-45" : "rotate-0"
                }`}
              />
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                selectedId === faq.id
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-5 pb-5 text-gray-400 text-md font-normal">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
