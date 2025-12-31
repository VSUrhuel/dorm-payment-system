import { Dormitory } from "../types"
import { createDormitory, softDeleteDormitory } from "@/lib/vsu-admin/dormitory"
import { toast } from "sonner"

export function useDormitoryAction() {
    const addDormitory = async (dormitory: Dormitory) => {
        try {
            await createDormitory(dormitory)
        } catch (error) {
            toast.error("Error adding dormitory:", error)
        }
    }

    const updateDormitory = async (dormitory: Dormitory) => {
        try {
            if(dormitory.id){
                await updateDormitory(dormitory)
            }
            else {
                toast.error("Dormitory ID is required for updating.")
            }
        } catch (error) {
            toast.error("Error updating dormitory:", error)
        }
    }

    const deleteDormitory = async (id: string) => {
        try {
            if(id){
                await softDeleteDormitory(id)
            }
            else {
                toast.error("Dormitory ID is required for soft deleting.")
            }
        } catch (error) {
            toast.error("Error soft deleting dormitory:", error)
        }
    }

    return {
        addDormitory,
        updateDormitory,
        deleteDormitory,
    }
}