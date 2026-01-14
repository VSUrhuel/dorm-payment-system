"use client";

import {
  Building,
  GraduationCap,
  Users,
  LogOut,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Dashboard", 
    url: "/vsu-admin", 
    icon: LayoutDashboard 
  },
  { 
    title: "Dormitories", 
    url: "/vsu-admin/dormitories", 
    icon: Building 
  },
  { 
    title: "SA/Advisers", 
    url: "/vsu-admin/advisers", 
    icon: Users 
  },
];

export function VsuAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      await fetch("/api/auth/signout", {
        method: "POST",
      });
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Sidebar className={undefined}>
      <div className="flex flex-col h-full bg-[var(--super-admin)] text-white">
        <SidebarHeader className="p-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
              <img src="/profile-old.webp" alt="Logo" width={65} height={65} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight leading-none">
                DormPay
              </span>
              <span className="text-[10px] font-medium uppercase text-white/50 tracking-[0.15em] mt-0.5">
                Super Admin
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto px-3 py-6">
          <SidebarGroup className={undefined}>
            <SidebarGroupContent className={undefined}>
              <SidebarMenu className="space-y-1">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title} className={undefined}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="group relative h-11 px-3 text-white/60 hover:text-white hover:bg-white/10 data-[active=true]:bg-white data-[active=true]:text-[var(--super-admin)] data-[active=true]:font-medium transition-all duration-200 rounded-lg"
                      tooltip={undefined}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 flex-shrink-0 border-t border-white/5">
          <SidebarHeader className="flex items-start gap-2 pb-2">
            <Avatar className="h-9 w-9 border border-white/20">
              <AvatarFallback className="bg-white/10 text-white text-xs font-medium">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">
                Dr. Elena Smith
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider truncate">
                Super Admin
              </p>
            </div>
          </SidebarHeader>
          <SidebarMenuButton
            onClick={handleSignOut}
            className="group relative flex items-center gap-3 h-11 px-3 w-full text-white/60 hover:text-white hover:bg-red-500/90 transition-all duration-200 rounded-lg"
            tooltip={undefined}
          >
            <div className="relative">
              <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="text-sm font-medium">Sign Out</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowRight className="h-4 w-4" />
            </div>
          </SidebarMenuButton>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
