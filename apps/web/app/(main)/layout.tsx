import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#0a0f0d]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="relative h-full rounded-3xl bg-[#0f1411] border border-emerald-900/20 shadow-lg">
            <div className="absolute -top-[2px] -left-[2px] py-2 flex pr-4 flex-row justify-center gap-x-2.5 items-center bg-gradient-to-r from-[#0a0f0d] to-[#0a0f0d]/95 backdrop-blur-sm rounded-br-xl">
              <SidebarTrigger className="bg-transparent hover:bg-emerald-500/10 cursor-pointer text-emerald-100 hover:text-emerald-50 transition-all duration-200" />
              <div className="h-5 w-[1px] border-r border-emerald-400/30" />
              <p className="font-medium bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                Endlytic API Explorer
              </p>
            </div>
            <div className="pt-12 px-6 pb-6 h-full overflow-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
