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
    url: "/vsu-admin/sa-advisers", 
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
      <div className="flex flex-col h-full bg-primary text-primary-foreground">
        <SidebarHeader className="p-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary shadow-lg shadow-secondary/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight leading-none">
                DormPay
              </span>
              <span className="text-[10px] font-bold uppercase text-primary-foreground/60 tracking-[0.2em]">
                University
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
                      className="group relative h-11 px-3 text-primary-foreground/70 hover:text-primary hover:bg-white data-[active=true]:bg-secondary data-[active=true]:text-black data-[active=true]:font-medium transition-all duration-200 rounded-lg"
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

        <SidebarFooter className="p-4 flex-shrink-0 border-t border-white/10">
          <SidebarHeader className="flex items-start gap-2 pb-2">
            <Avatar className="h-9 w-9 border border-white/20">
              <AvatarFallback className="bg-secondary text-white text-sm font-medium">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-foreground truncate">
                Dr. Elena Smith
              </p>
              <p className="text-[10px] text-primary-foreground/50 uppercase tracking-tighter truncate">
                Super Admin
              </p>
            </div>
          </SidebarHeader>
          <SidebarMenuButton
            onClick={handleSignOut}
            className="group relative flex items-center gap-3 h-11 px-3 w-full text-primary-foreground/70 hover:text-white hover:bg-red-500 transition-all duration-200 rounded-lg"
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
