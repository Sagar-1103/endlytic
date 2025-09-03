import Link from "next/link";

interface SidebarChatItemProps {
  chat: { id: number; title: string };
  isActive:boolean
}
export default function SidebarChatItem({
  chat,
  isActive
}: SidebarChatItemProps) {
  return (
    <Link
    href={`/chat/${chat.id}`}
      className="flex overflow-hidden items-center gap-3 px-3 py-2 rounded-lg pl-[2px] cursor-pointer relative hover:bg-emerald-500/10 transition-all duration-200"
    >
      {isActive && (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_-3%_50%,_#5ee9b5_0%,_#5ee9b5_10%,_transparent_15%)] blur-lg" />
      )}
      <div className={`flex flex-col flex-1 border-l-2 ${isActive ? "border-l-white" : "border-l-transparent"} min-w-0`}>
        <p
          className={`text-sm pl-2 font-medium ${isActive ? "text-emerald-300" : "text-slate-400/90"} truncate`}
        >
          {chat.title}
        </p>
      </div>
    </Link>
  );
}
