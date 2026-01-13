
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, MapPin, Edit2, Trash2 } from "lucide-react"
import { Dormitory } from "../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface dormitoryTableProps {
  dorms: Dormitory[],
  editDormitory: (dorm: Dormitory) => void,
  deleteDormitory: (dorm: Dormitory) => void
}
export default function DormitoryTable({ dorms, editDormitory, deleteDormitory }: dormitoryTableProps) {

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
                        <AvatarImage src={`/.jpg?height=28&width=28&query=${dorm.adviserName}`} className={undefined} />
                        <AvatarFallback className={undefined}>
                          {dorm.adviserName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{dorm.adviserName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground">{dorm.occupancy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          className="text-xs font-medium py-2 cursor-pointer"
                          onClick={() => editDormitory(dorm)} inset={undefined}                        >
                          <Edit2 className="mr-2 h-3.5 w-3.5" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs font-medium py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => deleteDormitory(dorm)} inset={undefined}                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Remove Dorm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    )
}