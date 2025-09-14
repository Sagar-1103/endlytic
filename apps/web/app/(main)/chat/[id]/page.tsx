import { use } from "react";
import AiChat from "@/components/chat/AiChat";
import UserChat from "@/components/chat/UserChat";


const exampleChat = [
    {
        id: "1",
        role: "user",
        message: "Hi, can you help me understand React hooks?",
        timestamp: "2025-09-12T10:00:00Z",
    },
    {
        id: "2",
        role: "ai",
        message: "Of course! React hooks are functions that let you use state and lifecycle features in functional components.",
        timestamp: "2025-09-12T10:00:05Z",
    },
    {
        id: "3",
        role: "user",
        message: "Can you give me an example of useState?",
        timestamp: "2025-09-12T10:01:00Z",
    },
    {
        id: "4",
        role: "ai",
        message: "Sure! Here's a simple counter:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```",
        timestamp: "2025-09-12T10:01:10Z",
    },
    {
        id: "5",
        role: "user",
        message: "That makes sense, thanks!",
        timestamp: "2025-09-12T10:02:00Z",
    },
    {
        id: "6",
        role: "ai",
        message: "You’re welcome! Would you like me to also explain useEffect?",
        timestamp: "2025-09-12T10:02:10Z",
    },
    {
        id: "7",
        role: "user",
        message: "That makes sense, thanks!",
        timestamp: "2025-09-12T10:02:00Z",
    },
    {
        id: "8",
        role: "ai",
        message: "You’re welcome! Would you like me to also explain useEffect?",
        timestamp: "2025-09-12T10:02:10Z",
    },
    {
        id: "9",
        role: "user",
        message: "That makes sense, thanks!",
        timestamp: "2025-09-12T10:02:00Z",
    },
    {
        id: "10",
        role: "ai",
        message: "You’re welcome! Would you like me to also explain useEffect?",
        timestamp: "2025-09-12T10:02:10Z",
    },
];


export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <div className="w-[80%] mx-auto mb-40">
            {exampleChat.map((chat) => (
                <div
                    key={chat.id}
                    className="my-5"
                >
                    {chat.role=="ai"?
                      <AiChat query={chat.message}/>
                    :
                       <UserChat query={chat.message}/>
                    }
                </div>
            ))}
        </div>
    );
}