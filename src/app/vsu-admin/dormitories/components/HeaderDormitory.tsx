import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HeaderDormitory({
    onAddDormitory
}: {
    onAddDormitory: () => void;
}) {
    return (
        <div>
            <header className="flex flex-col gap-4 border-b border-neutral-100 bg-white px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-neutral-900"></div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">Super Admin</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Dormitory Registry</h1>
          <p className="text-[15px] text-neutral-500 mt-1 font-normal">Manage university dormitories</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-neutral-900 hover:bg-neutral-800 text-white gap-2 font-medium shadow-sm transition-all" variant={undefined} size={undefined} onClick={onAddDormitory}>
            <Plus className="h-4 w-4" />
            Register Dormitory
          </Button>
        </div>
      </header>
        </div>
    )
}