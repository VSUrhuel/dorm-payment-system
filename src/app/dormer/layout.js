import { Inter } from "next/font/google";
import "../globals.css";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/UserSideBar";
import { Building2 } from "lucide-react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Mobile Header with Sidebar Trigger */}
          <header className="md:hidden flex items-center justify-between h-[74px] bg-[#12372A] shadow-md px-4 sticky top-0 z-10">
            <SidebarTrigger className="text-white hover:bg-[#1c4f3d] hover:text-white" />
            <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
              <img
                src="/profile.ico"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <h1 className="text-xl font-bold text-white tracking-tight">
                DormPay
              </h1>
            </div>
            <div className="w-10"></div> {/* for centering */}
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="top-right" />
    </div>
  );
}
