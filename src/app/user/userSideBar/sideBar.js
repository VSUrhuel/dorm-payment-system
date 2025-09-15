"use client";

import {
  CalendarPlus,
  CircleDollarSign,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Building2,
  LogOut,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 2. Import useRouter
import { auth } from "@/lib/firebase"; // 3. Import Firebase auth instance
import { onAuthStateChanged, signOut } from "firebase/auth"; // 4. Import signOut function

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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { firestore as db } from "@/lib/firebase";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Payments",
    url: "/admin/dormers",
    icon: Users,
  },
  {
    title: "Bills",
    url: "/admin/payments",
    icon: CircleDollarSign,
  },
  {
    title: "Expenses",
    url: "/admin/expenses",
    icon: Receipt,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: Receipt,
  },
  {
    title: "Profile",
    url: "/admin/events",
    icon: Receipt,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter(); // 5. Initialize the router
  const [user, setUser] = useState(null);
  const [dormerData, setDormerData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("user", user);
    if (user) {
      // Only run the query if the user is logged in
      // Query to find the dormer document where 'authUid' matches the logged-in user's uid
      const fetchDormerData = async () => {
        const docRef = doc(db, "dormers", user.uid);
        const docSnap = await getDoc(docRef);
        const dormerData = docSnap.data();
        setDormerData(dormerData);
        console.log(dormerData);
      };

      fetchDormerData();
      console.log(dormerData);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to the login page after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
      // You could add an error notification here
    }
  };
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <div className="flex flex-col h-full">
        <SidebarHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
              <img src="/profile.ico" alt="Logo" width={32} height={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">DormPay</h2>
              <p className="text-xs text-gray-500">Payment System</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 px-3 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="group relative h-11 px-3 text-gray-600 hover:text-green-600 hover:bg-green-50 data-[active=true]:bg-green-50 data-[active=true]:text-green-600 data-[active=true]:font-medium transition-all duration-200 rounded-lg"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 group-hover:bg-green-200 transition-colors"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-100">
          {dormerData && (
            <SidebarHeader class="flex items-start gap-2 pb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-green-800 text-sm font-medium">
                  {dormerData.firstName[0]}
                  {dormerData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {dormerData.firstName} {dormerData.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {dormerData.email}
                </p>
              </div>
            </SidebarHeader>
          )}
          <SidebarMenuButton
            onClick={handleSignOut}
            className=" relative flex items-center gap-3 h-11 px-3 w-full text-gray-500 hover:text-white hover:bg-red-500 transition-all duration-200 rounded-lg"
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
