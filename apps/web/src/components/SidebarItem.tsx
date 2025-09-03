import { ReactNode } from "react";

interface SidebarItemProps {
  item: {
    title: string;
    url: string;
    icon: ReactNode;
  };
  isActive: boolean;
  onClick: () => void;
}

export default function SidebarItem({
  item,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer rounded-md pl-[2px] py-1"
    >
      <>
        {isActive && (
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_-3%_50%,_#5ee9b5_0%,_#5ee9b5_10%,_transparent_15%)] blur-lg" />
        )}
        <a
          className={`flex items-center justify-between border-l-2 ${
            isActive ? "border-l-white" : "border-l-transparent"
          } w-full relative`}
        >
          <div
            className={`flex items-center gap-1 relative ${isActive ? "text-emerald-300" : "text-slate-400/90"} hover:text-emerald-300 z-10`}
          >
            <div className="p-2 rounded-lg">
              <div>{item.icon}</div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium transition-colors duration-300">
                {item.title}
              </p>
            </div>
          </div>
        </a>
      </>
    </div>
  );
}
