"use client"
import { Building, GraduationCap, BarChart3, Users, Settings, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { name: "Dashboard", href: "/vsu-admin", icon: LayoutDashboard },
  { name: "Dormitories", href: "/vsu-admin/dormitories", icon: Building },
  { name: "SA/Advisers", href: "/vsu-admin/sa-advisers", icon: Users },
]

export function VsuAdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-primary text-primary-foreground transition-transform">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary shadow-lg shadow-secondary/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight leading-none">DormPay</span>
            <span className="text-[10px] font-bold uppercase text-primary-foreground/60 tracking-[0.2em]">
              University
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-white shadow-sm"
                    : "text-primary-foreground/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-primary-foreground/70")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4 px-2">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 cursor-pointer transition-colors">
            <Avatar className="h-9 w-9 border border-white/20">
              <AvatarFallback className={undefined}>SA</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">Dr. Elena Smith</p>
              <p className="truncate text-[10px] text-primary-foreground/50 uppercase tracking-tighter">Super Admin</p>
            </div>
            <LogOut className="h-4 w-4 text-primary-foreground/50 hover:text-white" />
          </div>
        </div>
      </div>
    </aside>
  )
}
