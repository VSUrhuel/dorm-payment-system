import { Inter } from "next/font/google";
import "../globals.css";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Building2 } from "lucide-react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* Mobile Header with Sidebar Trigger */}
            <header className="md:hidden flex items-center p-4 border-b sticky top-0 bg-white z-10">
              <SidebarTrigger />
              <div className="flex items-center gap-2 mx-auto">
                <img src="/profile.ico" alt="Logo" width={32} height={32} />
                <h1 className="text-lg font-bold text-gray-900">DormPay</h1>
              </div>
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
