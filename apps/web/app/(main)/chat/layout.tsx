import ChatBox from "@/components/ChatBox";

interface ChatLayoutProps {
    children:React.ReactNode;
};

export default function ChatLayout({children}:ChatLayoutProps) {
    return (
      <>
        {children}
        <ChatBox/>
      </>  
    );
}