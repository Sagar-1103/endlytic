import AppSidebar from "@/components/AppSidebar";
import MainContent from "@/components/MainContent";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#0a0f0d]">
        <AppSidebar />
        <MainContent>
          {children}
        </MainContent>
      </div>
    </SidebarProvider>
  );
}
