import { Dormitory } from "../types"
import { createDormitory, softDeleteDormitory, updateDormitory } from "@/lib/vsu-admin/dormitory"
import { toast } from "sonner"

export function useDormitoryAction() {
    const addDormitory = async (dormitory: Dormitory) => {
        try {
            await createDormitory(dormitory)
            toast.success("Dormitory added successfully!")
        } catch (error) {
            toast.error("Error adding dormitory:", error)
        }
    }

    const updateDormDetails = async (dormitory: Dormitory) => {
        try {
            if(dormitory.id){
                await updateDormitory(dormitory)
                toast.success("Dormitory updated successfully!")
            }
            else {
                toast.error("Dormitory ID is required for updating.")
            }
        } catch (error) {
            toast.error("Error updating dormitory:", error)
        }
    }

    const deleteDormitory = async (dormitory: Dormitory) => {
        try {
            if(dormitory.id){
                await softDeleteDormitory(dormitory.id)
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
        updateDormDetails,
        deleteDormitory,
    }
}