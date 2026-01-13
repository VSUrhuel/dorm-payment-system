"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useAdvisersData } from "./hooks/useAdvisersData"
import { useAdviserActions } from "./hooks/useAdviserAction"
import { useModal } from "./hooks/useModal"
import AdviserHeader from "./components/AdviserHeader"
import AdvisersTable from "./components/AdvisersTable"
import AddEditAdviser from "./components/AddEditAdviser"
import DeleteAdviser from "./components/DeleteAdviser"
import { AdvisersPageSkeleton } from "./components/AdvisersPageSkeleton"

export default function AdviserManagement() {
  const {
    loading,
    paginatedAdvisers,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  } = useAdvisersData()
  
  const { modal, selectedAdviser, openModal, closeModal } = useModal()

  const {
    createAdviser,
    updateAdviser,
    deleteAdviser,
  } = useAdviserActions()

  if(loading) {
    return <AdvisersPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <AdviserHeader onAddAdviser={() => openModal("add")} />
      
      <main className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search advisers by name or email..."
              className="pl-10 bg-white border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10 rounded-lg text-[15px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <AdvisersTable 
          advisers={paginatedAdvisers} 
          onEdit={(adviser) => openModal("edit", adviser)} 
          onDelete={(adviser) => openModal("delete", adviser)} 
        />

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="gap-1 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-700 font-medium disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-neutral-500 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="gap-1 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-neutral-700 font-medium disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <AddEditAdviser 
        isOpen={modal === "add" || modal === "edit"} 
        onClose={closeModal} 
        adviser={selectedAdviser} 
        type={modal} 
        onAdd={createAdviser}
        onUpdate={updateAdviser}
      />

      <DeleteAdviser 
        isOpen={modal === "delete"} 
        onClose={closeModal} 
        onDelete={deleteAdviser} 
        adviser={selectedAdviser} 
      />
    </div>
  )
}
