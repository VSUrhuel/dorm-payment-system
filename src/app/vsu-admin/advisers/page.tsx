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
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pl-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#12372A] border-t-transparent" />
          <p className="text-sm font-medium text-[#12372A]">Loading advisers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pl-64">
      <AdviserHeader onAddAdviser={() => openModal("add")} />
      
      <main className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search advisers by name or email..."
              className="pl-8 bg-white border-gray-200 focus:ring-[#12372A] focus:border-[#12372A]"
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
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="gap-1 border-gray-200 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="gap-1 border-gray-200 hover:bg-gray-50"
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
