import type React from "react"
import { VsuAdminSidebar } from "@/components/VsuAdminSidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"

export default function VsuAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <SidebarProvider open={undefined} onOpenChange={undefined} className={undefined} style={undefined}>
        <VsuAdminSidebar />
        <SidebarInset className={undefined}>
          {/* mobile header with sidebar trigger */}
          <header className="md:hidden flex items-center justify-between h-[74px] bg-[var(--super-admin)] shadow-lg px-4 sticky top-0 z-10">
            <SidebarTrigger className="text-white/80 hover:bg-white/10 hover:text-white" onClick={undefined} />
            <div className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <img
                src="/profile-old.webp"
                alt="Logo"
                width={50}
                height={50}
                className="rounded-lg"
              />
              </div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                DormPay
              </h1>
            </div>
            <div className="w-10"></div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="top-right" />
    </div>
  )
}
