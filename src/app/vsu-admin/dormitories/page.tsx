import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, MapPin } from "lucide-react"
import { useDormitoryData } from "./hooks/useDormitoryData"

export default function DormitoryManagement() {
  const { dormitories,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        locationFilter,
        setLocationFilter,
        totalPages,
        setTotalPages,
        loading,
        paginatedDormitories,
        filteredDormitories,
        handleNextPage,
        handlePreviousPage,} = useDormitoryData()

  return (
    <div className="min-h-screen bg-background pl-64">
      <header className="flex h-16 items-center border-b bg-white px-8">
        <h1 className="text-lg font-semibold text-primary">Dormitory Registry</h1>
        <div className="ml-auto">
          <Button className="bg-secondary hover:bg-secondary/90 text-white gap-2" variant={undefined} size={undefined}>
            <Plus className="h-4 w-4" />
            Register Dormitory
          </Button>
        </div>
      </header>

      <main className="p-8">
        <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <Table className={undefined}>
            <TableHeader className="bg-gray-50">
              <TableRow className={undefined}>
                <TableHead className="w-[250px] font-bold text-primary uppercase text-[10px] tracking-widest">
                  Dormitory Name
                </TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Location</TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">
                  Assigned Adviser/SA
                </TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">
                  Total Occupancy
                </TableHead>
                <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={undefined}>
              {filteredDormitories.map((dorm) => (
                <TableRow key={dorm.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold">{dorm.name}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <MapPin className="h-3 w-3" />
                      {dorm.location}
                    </div>
                  </TableCell>
                  <TableCell className={undefined}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 border">
                        <AvatarImage src={`/.jpg?height=28&width=28&query=${dorm.adviser}`} className={undefined} />
                        <AvatarFallback className={undefined}>
                          {dorm.adviser
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{dorm.adviser}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground">{dorm.occupancy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
