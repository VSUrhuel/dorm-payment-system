import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, CreditCard, Activity, TrendingUp } from "lucide-react"

export default function VsuAdminDashboard() {
  return (
    <div className="min-h-screen bg-background pl-64">
      <header className="flex h-16 items-center border-b bg-white px-8">
        <h1 className="text-lg font-semibold text-primary">University Overview</h1>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground italic">Academic Year 2025-2026</span>
        </div>
      </header>

      <main className="p-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Dormitories
              </CardTitle>
              <Building className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent className={undefined}>
              <div className="text-2xl font-bold">12 Dormitories</div>
              <p className="text-xs text-muted-foreground mt-1">Total dormitories in the university</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Dormers
              </CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent className={undefined}>
              <div className="text-2xl font-bold">2,450</div>
              <p className="text-xs text-muted-foreground mt-1">Total dormers in the university</p>
            </CardContent>
          </Card>
        </div>

        {/* Bento Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Dormers Distribution</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center p-0">
              <div className="w-full h-full p-8 flex items-end justify-between gap-4">
                {[45, 78, 52, 90, 65, 85, 40].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/10 rounded-t-lg relative group transition-all hover:bg-secondary"
                  >
                    <div
                      style={{ height: `${h}%` }}
                      className="w-full bg-primary group-hover:bg-secondary rounded-t-lg transition-all"
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium uppercase">
                      Dorm {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-sm font-semibold">Repair Request</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p>Feature to be implemented</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
