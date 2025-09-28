"use client";
import { use, useEffect, useState } from "react";
import AiChat from "@/components/chat/AiChat";
import UserChat from "@/components/chat/UserChat";
import { Message } from "@/types";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [messages,setMessages] = useState<Message[]>([]);

    const getMessages = async()=>{
        try {
            const response = await fetch(`/api/messages/${id}`);
            const res = await response.json();
            setMessages(res.messages); 
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getMessages();
    },[])

    return (
        <div className="w-[80%] max-w-4xl mx-auto mb-40">
            {messages && messages.length!==0 && messages.map((message) => (
                <div
                    key={message.id}
                    className="my-5"
                >
                    {message.role=="Ai"?
                      <AiChat message={message}/>
                    :
                       <UserChat message={message}/>
                    }
                </div>
            ))}
        </div>
    );
}