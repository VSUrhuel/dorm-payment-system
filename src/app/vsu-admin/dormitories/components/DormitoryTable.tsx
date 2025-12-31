
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, MapPin } from "lucide-react"

const dorms = [
  {
    id: 1,
    name: "Narra Residence",
    location: "North Campus",
    manager: "Liza Soberano",
    occupancy: "145/150",
  },
  {
    id: 2,
    name: "Ipil Hall",
    location: "South Campus",
    manager: "Enrique Gil",
    occupancy: "190/200",
    status: "Active",
  },
  {
    id: 3,
    name: "Bamboo Suites",
    location: "West Side",
    manager: "James Reid",
    occupancy: "85/120",
    status: "Maintenance",
  },
  { id: 4, name: "Yakal Dorm", location: "Main Gate", manager: "Nadine Lustre", occupancy: "0/150", status: "Closed" },
]

export default function DormitoryTable() {
    return (
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
              {dorms.map((dorm) => (
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
                        <AvatarImage src={`/.jpg?height=28&width=28&query=${dorm.manager}`} className={undefined} />
                        <AvatarFallback className={undefined}>
                          {dorm.manager
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{dorm.manager}</span>
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
    )
}