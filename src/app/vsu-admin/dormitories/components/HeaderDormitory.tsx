import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HeaderDormitory({
    onAddDormitory
}: {
    onAddDormitory: () => void;
}) {
    return (
        <div>
            <header className="flex h-16 items-center border-b bg-white px-8">
        <h1 className="text-lg font-semibold text-primary">Dormitory Registry</h1>
        <div className="ml-auto">
          <Button className="bg-secondary hover:bg-secondary/90 text-white gap-2" variant={undefined} size={undefined} onClick={onAddDormitory}>
            <Plus className="h-4 w-4" />
            Register Dormitory
          </Button>
        </div>
      </header>
        </div>
    )
}