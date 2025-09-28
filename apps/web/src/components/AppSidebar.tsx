"use client";
import { Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import SidebarItem from "./SidebarItem";
import SidebarChats from "./SidebarChats";
import { items } from "@/data/sidebar-data";
import { usePathname, useRouter } from "next/navigation";
import { useChatTitleStore, settingModalStore } from "@/store/useStore";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogoutIcon, ProfileIcon, SettingIcon } from "@/lib/icons";

export default function AppSidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const { setChatTitle } = useChatTitleStore();
  const { setSettingModal ,settingModal } = settingModalStore();
  const [user, setUser] = useState({ email: "", name: "", image: "" });

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    signOut({ callbackUrl: "/" });
  };

  const getUser = async () => {
    const session = await getSession();
    if (!session) return;
    setUser({
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      image: session.user.image ?? "",
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
      <Sidebar
        side="left"
        className="border-emerald-900/20"
        variant="sidebar"
        collapsible="offcanvas"
      >
        <SidebarContent className="bg-gradient-to-b from-[#0a0f0d] to-[#0d1210] text-white min-h-screen flex flex-col justify-between overflow-hidden">
          <div className="px-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-y-1">
                  <SidebarMenuItem>
                    <Link href={"/chat"}>
                      <div className="rounded-xl p-3">
                        <div className="select-none cursor-pointer flex items-center gap-x-3">
                          <div className="relative">
                            <Image
                              src={"/endlytic-dark.svg"}
                              className="rounded-lg scale-200 transition-transform duration-300"
                              alt="logo"
                              width={28}
                              height={28}
                            />
                          </div>
                          <p className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                            Endlytic
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuItem>

                  <Separator className="bg-emerald-900/30 mb-4" />

                  {items.map((item, index) => (
                    <SidebarItem
                      onClick={() => {
                        router.push(item.url);
                        setChatTitle("Endlytic API Explorer");
                      }}
                      isActive={pathName === item.url}
                      key={index}
                      item={item}
                    />
                  ))}

                  <SidebarChats />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          <SidebarFooter className="p-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className="p-3 border-t border-emerald-900/20 bg-gradient-to-r from-[#0d1210] to-[#0a0f0d]"
                    >
                      <div className="p-3 flex items-center gap-3 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 cursor-pointer group/footer border border-transparent hover:border-emerald-500/20">
                        <div className="relative">
                          {user.image ? (
                            <Image
                              src={user.image || "/endlytic.svg"}
                              alt="User Avatar"
                              width={36}
                              height={36}
                              className="rounded-full ring-2 ring-emerald-500/20 group-hover/footer:ring-emerald-500/40 transition-all duration-300"
                            />
                          ) : (
                            <div className="rounded-full ring-2 w-7 h-7 ring-emerald-500/20 group-hover/footer:ring-emerald-500/40 transition-all duration-300">
                              <p className="m-auto capitalize text-center">
                                {user.email?.charAt(0)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="text-sm font-medium text-slate-200 group-hover/footer:text-emerald-100 transition-colors duration-300">
                            {user.name.length !== 0
                              ? user.name.split(" ")[0]
                              : user.email.split("@")[0]}
                          </p>
                          <p className="text-xs truncate w-24 text-slate-400 group-hover/footer:text-emerald-400 transition-colors duration-300">
                            {user.email}
                          </p>
                        </div>
                        <Settings className="w-4 h-4 text-slate-400 group-hover/footer:text-emerald-300 transition-all duration-300 group-hover/footer:rotate-90" />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[260px] bg-[#232733] border-0 text-white"
                  >
                    <DropdownMenuItem className="hover:!bg-[#353c4f] !text-white">
                      <div className=" flex flex-row gap-2">
                        <div className="flex items-center"><ProfileIcon /></div>
                        <span className="text-sm mb-[2px]">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:!bg-[#353c4f] !text-white"
                      onClick={() => { setSettingModal(!settingModal) 
                      }}
                    >
                      <div className=" flex flex-row gap-2">
                        <div className="flex items-center"><SettingIcon /></div>
                        <span className="text-sm  mb-[2px]">Settings</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:!bg-[#353c4f] !text-white">
                      <div className=" flex flex-row gap-2"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center"><LogoutIcon /></div>
                        <span className="text-sm mb-[2px]">Log out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar >
  );
}

