"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel } from "@/components/ui/carousel"
import { Building, Users, Wrench, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, DollarSign } from "lucide-react"
import { useDashboardData } from "./hooks/useDashboardData"
import { DashboardSkeleton } from "./components/DashboardSkeleton"

// Mock data for dormitory distribution chart
const dormitoryData = [
  { name: "Mariposa", occupancy: 156, capacity: 180, percentage: 87 },
  { name: "Sampaguita Ladies Hall", occupancy: 250, capacity: 272, percentage: 92 },
  { name: "Mabolo Res", occupancy: 98, capacity: 120, percentage: 82 },
  { name: "Ilang-Ilang", occupancy: 187, capacity: 200, percentage: 94 },
  { name: "Mahogany Men's Hall", occupancy: 134, capacity: 160, percentage: 84 },
  { name: "Kanlaon", occupancy: 178, capacity: 190, percentage: 94 },
  { name: "Zea Mey's", occupancy: 89, capacity: 140, percentage: 64 },
]

// Mock data for repair requests
const repairRequests = [
  { id: 1, title: "Broken Washing Machine", dorm: "Mabolo", room: "205", status: "pending", priority: "high", date: "2 hours ago" },
  { id: 2, title: "Leaking Faucet", dorm: "Sampaguita Ladies Hall", room: "112", status: "completed", priority: "medium", date: "5 hours ago" },
  { id: 3, title: "Door Lock Issue", dorm: "Molave Res", room: "308", status: "completed", priority: "low", date: "1 day ago" },
  { id: 4, title: "Electrical Outlet", dorm: "Ilang-Ilang", room: "401", status: "pending", priority: "high", date: "3 hours ago" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
    case "in-progress": return "bg-blue-50 text-blue-700 border-blue-200"
    case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default: return "bg-neutral-50 text-neutral-700 border-neutral-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending": return <Clock className="h-3 w-3" />
    case "completed": return <CheckCircle2 className="h-3 w-3" />
    default: return null
  }
}

export default function VsuAdminDashboard() {
  const { loading } = useDashboardData()

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex flex-col gap-4 border-b border-neutral-100 bg-white px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-neutral-900"></div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">Super Admin</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">University Overview</h1>
          <p className="text-[15px] text-neutral-500 mt-1 font-normal">Monitor all dormitory operations</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full font-medium">AY 2025-2026</span>
        </div>
      </header>

      <main className="p-4 sm:p-8">
        {/* stats cards*/}
        <div className="sm:hidden">
          <Carousel
            activeIndicatorClassName="w-6 bg-neutral-900"
            inactiveIndicatorClassName="w-1.5 bg-neutral-300 hover:bg-neutral-400"
          >

            <Card className="relative overflow-hidden border-0 bg-neutral-900 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Dormitories</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-semibold text-white">12</span>
                      <span className="text-xs text-emerald-400 font-medium">All registered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-neutral-200/60 bg-white shadow-xl shadow-neutral-950/[0.03]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-neutral-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Dormers</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-semibold text-neutral-900">2,450</span>
                      <span className="text-xs text-neutral-400 font-medium">residents</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-amber-200/60 bg-white shadow-xl shadow-amber-950/[0.03]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending Repairs</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl text-gray-400">coming soon</span>
                    </div>
                    {/* <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-semibold text-neutral-900 tabular-nums">23</span>
                    <span className="text-xs text-amber-600 font-medium">need attention</span>
                  </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Carousel>
        </div>

        {/* stats grid*/}
        <div className="hidden sm:grid gap-5 grid-cols-2 lg:grid-cols-3">
          <Card className="group relative overflow-hidden border-0 bg-neutral-900 shadow-2xl hover:shadow-neutral-900/25 transition-shadow duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/[0.15] transition-colors duration-300">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Dormitories</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-semibold text-white tabular-nums">12</span>
                    <span className="text-xs text-emerald-400 font-medium">All registered</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-neutral-200/60 bg-white shadow-xl shadow-neutral-950/[0.03] hover:shadow-neutral-950/[0.08] hover:border-neutral-300/60 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-neutral-50/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200/70 transition-colors duration-300">
                  <Users className="h-6 w-6 text-neutral-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Dormers</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-semibold text-neutral-900 tabular-nums">2,450</span>
                    <span className="text-xs text-neutral-400 font-medium">residents</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-amber-200/60 bg-white shadow-xl shadow-amber-950/[0.03] hover:shadow-amber-950/[0.08] hover:border-amber-300/60 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-50/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200/70 transition-colors duration-300">
                  <Wrench className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending Repairs</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl text-gray-400">coming soon</span>
                  </div>
                  {/* <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-semibold text-neutral-900 tabular-nums">23</span>
                    <span className="text-xs text-amber-600 font-medium">need attention</span>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* dormitory distribution chart */}
          <Card className="lg:col-span-2 border-neutral-200 bg-white overflow-hidden">
            <CardHeader className="border-b border-neutral-100 py-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[15px] font-medium text-neutral-900">Occupancy by Dormitory</CardTitle>
                  <p className="text-[13px] text-neutral-500 mt-0.5">Current semester capacity utilization</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 overflow-x-auto">
              <div className="h-[280px] flex items-end gap-3 min-w-[500px] sm:min-w-0 sm:justify-between">
                {dormitoryData.map((dorm, i) => (
                  <div key={i} className="flex-1 min-w-[60px] sm:min-w-0 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-900">{dorm.percentage}%</span>
                    <div className="w-full h-[200px] bg-neutral-100 rounded-md relative group overflow-hidden">
                      <div
                        style={{ height: `${dorm.percentage}%` }}
                        className="absolute bottom-0 w-full bg-neutral-900 group-hover:bg-neutral-700 rounded-md transition-all duration-300"
                      />
                      {/* tooltip on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-center border border-neutral-200">
                          <p className="text-[11px] font-semibold text-neutral-900">{dorm.occupancy}/{dorm.capacity}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium text-center leading-tight max-w-[60px] truncate" title={dorm.name}>
                      {dorm.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* repair requests */}
          <Card className="border-neutral-200 bg-white overflow-hidden">
            <CardHeader className="border-b border-neutral-100 py-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[15px] font-medium text-neutral-900">Recent Repair Requests</CardTitle>
                  <p className="text-[13px] text-neutral-500 mt-0.5">Latest maintenance requests</p>
                </div>
                <Badge variant="outline" className="text-[11px] font-medium border-neutral-200 text-neutral-600">
                  4 new
                </Badge>
              </div>
            </CardHeader>
            <div className="text-center text-gray-400">Feature coming soon!</div>
            {/* <CardContent className="p-0">
              <div className="divide-y divide-neutral-100">
                {repairRequests.map((request) => (
                  <div key={request.id} className="px-5 py-3.5 hover:bg-neutral-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-1.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[14px] font-medium text-neutral-900 truncate">{request.title}</p>
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 flex items-center gap-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[12px] text-neutral-500">{request.dorm}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-[12px] text-neutral-500">Room {request.room}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">{request.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50">
                <button className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors w-full text-center">
                  View all requests →
                </button>
              </div>
            </CardContent> */}
          </Card>
        </div>

        {/* addtl stats row */}
        <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* <Card className="border-neutral-200 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-medium text-neutral-700">Payment Status</p>
                <Badge variant="outline" className="text-[10px] font-medium border-emerald-200 text-emerald-700 bg-emerald-50">On track</Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="text-neutral-600">Paid</span>
                    <span className="font-medium text-neutral-900">2,180</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "89%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="text-neutral-600">Pending</span>
                    <span className="font-medium text-neutral-900">270</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "11%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card className="border-neutral-200 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-medium text-neutral-700">Occupancy Rate</p>
                <span className="text-[20px] font-semibold text-neutral-900">86%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-neutral-50 rounded-lg p-2.5">
                  <p className="text-[18px] font-semibold text-neutral-900">2,450</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">Occupied</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2.5">
                  <p className="text-[18px] font-semibold text-neutral-900">400</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">Available</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2.5">
                  <p className="text-[18px] font-semibold text-neutral-900">2,850</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-medium text-neutral-700">Active Advisers</p>
                <Badge variant="outline" className="text-[10px] font-medium border-neutral-200 text-neutral-600">12 total</Badge>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="h-9 w-9 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center text-[11px] font-medium text-white"
                  >
                    A{i}
                  </div>
                ))}
                <div className="h-9 w-9 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[11px] font-medium text-neutral-600">
                  +7
                </div>
              </div>
              <p className="text-[12px] text-neutral-500 mt-3">All advisers currently active</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
