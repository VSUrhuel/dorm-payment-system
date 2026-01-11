import type React from "react"
import { VsuAdminSidebar } from "@/components/VsuAdminSidebar"
import { Toaster } from "sonner"

export default function VsuAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <VsuAdminSidebar />
      <div className="flex-1">{children}</div>
      <Toaster position="top-right" richColors />
    </div>
  )
}
