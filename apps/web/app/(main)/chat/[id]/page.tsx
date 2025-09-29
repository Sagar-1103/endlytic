"use client";
import { use, useEffect, useRef } from "react";
import AiChat from "@/components/chat/AiChat";
import UserChat from "@/components/chat/UserChat";
import { useChatMessagesStore } from "@/store/useStore";
import LoaderAnimation from "../../../../public/Loading.json";
import Lottie from "lottie-react";
import { useIsStreamingStore } from "@/store/useChatsStore";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { chatMessages, getMessages, clearChatMessages } = useChatMessagesStore();
    const bottomRef = useRef<HTMLDivElement>(null);
    const { isStreaming } = useIsStreamingStore();

    useEffect(() => {
        const newId = localStorage.getItem("newId");
        
        if (newId===id) {
            localStorage.removeItem("newId");               
        } else {
            clearChatMessages();
            getMessages(id);
        }
    }, [id]);

    useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [chatMessages]);

    return (
        <div className="w-screen pr-5 sm:pr-0 sm:w-[80%] max-w-[70rem] mx-auto mb-40">
            {
                chatMessages.length==0 && (
                    <div className="flex items-center justify-center h-[65vh]">
                        <Lottie
                        animationData={LoaderAnimation}
                        loop
                        autoPlay
                        className="w-40 h-40 opacity-80"
                        />
                    </div>
                )
            }
            {chatMessages && chatMessages.length!==0 && chatMessages.map((message,index) => {
                try {
                const parsedMessage = JSON.parse(message.content);
                    return (
                        <div key={index} className="mt-5" >
                        { message.role=="Ai"?
                        <AiChat content={parsedMessage}/>
                        :
                        <UserChat text={parsedMessage.text}/>
                        }
                        </div>
                );
                } catch (error) {
                    console.log(error);
                    return;
                }
            })}
            {
                isStreaming && (
                        <Lottie
                            animationData={LoaderAnimation}
                            loop
                            autoPlay
                            className="w-24 h-24 ml-3 -mt-8"
                        />
                )
            }
            <div ref={bottomRef} />
        </div>
    );
}