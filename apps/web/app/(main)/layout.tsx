import AppSidebar from "@/components/AppSidebar";
import MainContent from "@/components/MainContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProtectedPage from "@/components/ProtectedPage";
interface MainLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: MainLayoutProps) {
  return (
    <ProtectedPage>
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#0a0f0d]">
        <AppSidebar />
        <MainContent>
          {children}
        </MainContent>
      </div>
    </SidebarProvider>
    </ProtectedPage>
  );
}
