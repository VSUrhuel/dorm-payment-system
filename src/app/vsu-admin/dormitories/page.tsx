"use client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useDormitoryData } from "./hooks/useDormitoryData"
import DormitoryTable from "./components/DormitoryTable"
import { useModal } from "./hooks/useModal"
import HeaderDormitory from "./components/HeaderDormitory"
import AddEditDormitory from "./components/AddEditDormitory"
import { useDormitoryAction } from "./hooks/useDormitoryAction"
import DeleteDormitory from "./components/DeleteDormitory"

export default function DormitoryManagement() {
  const {
      dormitories,
      advisers,
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
      handlePreviousPage,
  } = useDormitoryData()
  
  const { modal, selectedDormitory, openModal, closeModal } = useModal()

  const {
      addDormitory,
      updateDormDetails,
      deleteDormitory,
  } = useDormitoryAction()

  return (
    <div className="min-h-screen bg-background pl-64">
      <HeaderDormitory onAddDormitory={() => openModal("add")} />
      
      <main className="p-8">
        <div className="mb-6 flex items-center gap-4">
             <div className="relative max-w-sm flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search dormitories..."
                  className="pl-8 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
        </div>

        

        <DormitoryTable 
            dorms={paginatedDormitories} 
            editDormitory={(dormitory) => openModal("edit", dormitory)} 
            deleteDormitory={(dormitory) => openModal("delete", dormitory)} 
        />

        {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
        )}
      </main>

      <AddEditDormitory 
          isOpen={modal === "add" || modal === "edit"} 
          onClose={() => closeModal()} 
          dormitory={selectedDormitory} 
          type={modal} 
          onAdd={addDormitory}
          onUpdate={updateDormDetails}
          advisers={advisers} 
      />

      <DeleteDormitory 
          isOpen={modal === "delete"} 
          onClose={() => closeModal()} 
          onDelete={deleteDormitory} 
          dormitory={selectedDormitory} 
      />

    </div>
  )
}
