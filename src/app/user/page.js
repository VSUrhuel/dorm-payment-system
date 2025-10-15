import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { AppSidebar } from "../user/userSideBar/sideBar";
import { SidebarProvider } from '@/components/ui/sidebar';


export default function UserDashboard() {
  return (
    <SidebarProvider>
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white shadow-sm">
        <AppSidebar />
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <Button variant="outline">Email Report</Button>
        </div>
        <p className="text-gray-500">Real-time financial status of your dormitory</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Dorm Fund Balance</p>
              <h2 className="text-xl font-bold">₱4,065.00</h2>
              <Wallet className="text-green-500 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Collectibles</p>
              <h2 className="text-xl font-bold">₱1,240.00</h2>
              <TrendingUp className="text-green-500 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <h2 className="text-xl font-bold">₱11,645.00</h2>
              <TrendingDown className="text-red-500 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active Dormers</p>
              <h2 className="text-xl font-bold">70</h2>
              <Users className="text-blue-500 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Regular Payables */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Regular Payables</h2>
              <Button size="sm" className="flex items-center"><Plus className="w-4 h-4 mr-1"/> Add Payable</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Maintenance Fee</p>
                  <h2 className="text-lg font-bold">₱250.00</h2>
                  <p className="text-xs text-gray-400">Due every first Monday</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Laptop Fee</p>
                  <h2 className="text-lg font-bold">₱20.00</h2>
                  <p className="text-xs text-gray-400">Additional laptop fee</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Fan Fee</p>
                  <h2 className="text-lg font-bold">₱20.00</h2>
                  <p className="text-xs text-gray-400">Additional WiFi fee</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Printer</p>
                  <h2 className="text-lg font-bold">₱20.00</h2>
                  <p className="text-xs text-gray-400">Additional payable</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">Sep 15, 2025</td>
                    <td className="px-4 py-2">Payment for 2025-08 paid by Reynil Eliseo (Room 3)</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">+₱250.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Sep 5, 2025</td>
                    <td className="px-4 py-2">Payment for 2025-08 paid by Marcus Barrera (Room 4B)</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">+₱270.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Aug 31, 2025</td>
                    <td className="px-4 py-2">Payment for 2025-08 paid by Brylle Ebrera (Room 2)</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">+₱270.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Aug 29, 2025</td>
                    <td className="px-4 py-2">Payment for 2025-09 paid by Alvin Mendez (Room SA)</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">+₱270.00</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Aug 29, 2025</td>
                    <td className="px-4 py-2">Payment for 2025-12 paid by Alvin Mendez (Room SA)</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">+₱270.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </SidebarProvider>
  );
}
