"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AdviserHeaderProps {
  onAddAdviser: () => void
}

export default function AdviserHeader({ onAddAdviser }: AdviserHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#12372A]">Adviser Management</h1>
        <p className="text-sm text-[#12372A]">
          Manage and monitor all dormitory advisers
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          onClick={onAddAdviser}
          className="bg-[#12372A] hover:bg-[#12372A]/90 text-white"
          variant={undefined}
          size={undefined}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Adviser
        </Button>
      </div>
    </header>
  )
}
