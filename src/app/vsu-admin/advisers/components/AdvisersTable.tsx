"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit2, Trash2, Mail, Phone } from "lucide-react"
import { Dormer } from "@/app/admin/dormers/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdvisersTableProps {
  advisers: Dormer[]
  onEdit: (adviser: Dormer) => void
  onDelete: (adviser: Dormer) => void
}

export default function AdvisersTable({ advisers, onEdit, onDelete }: AdvisersTableProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <Table className={undefined}>
        <TableHeader className="bg-gray-50">
          <TableRow className={undefined}>
            <TableHead className="w-[250px] font-bold text-primary uppercase text-[10px] tracking-widest">
              Name
            </TableHead>
            <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">Contact Info</TableHead>
            <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest">
              Dormitory
            </TableHead>
            <TableHead className="font-bold text-primary uppercase text-[10px] tracking-widest text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={undefined}>
          {advisers.length === 0 ? (
            <TableRow className={undefined}>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No advisers found.
              </TableCell>
            </TableRow>
          ) : (
            advisers.map((adviser) => (
              <TableRow key={adviser.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className={undefined}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-[#12372A] text-white text-xs">
                        {adviser.firstName[0]}{adviser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#12372A]">
                        {adviser.firstName} {adviser.lastName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className={undefined}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {adviser.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {adviser.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {adviser.dormitoryName ? adviser.dormitoryName : "N/A"}
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
                                    onClick={() => onEdit(adviser)} inset={undefined}                      >
                        <Edit2 className="mr-2 h-3.5 w-3.5" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                                    className="text-xs font-medium py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                    onClick={() => onDelete(adviser)} inset={undefined}                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Remove Adviser
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
