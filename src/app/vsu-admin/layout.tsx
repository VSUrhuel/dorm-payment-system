import type React from "react"
import { VsuAdminSidebar } from "@/components/VsuAdminSidebar"

export default function VsuAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <VsuAdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
