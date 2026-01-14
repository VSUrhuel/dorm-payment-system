import { assignDormAdvisory, updateDormAdvisory } from "@/lib/vsu-admin/adviser"
import { Dormitory } from "../types"
import { createDormitory, getDormitoryById, softDeleteDormitory, updateDormitory } from "@/lib/vsu-admin/dormitory"
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
                const dormitoryData = await getDormitoryById(dormitory.id)
                if(dormitoryData.adviser != dormitory.adviser){
                    await updateDormAdvisory(dormitory.id, dormitory.adviser, dormitory.name)
                } else if((dormitoryData.adviser == "" || dormitoryData.adviser == null) && dormitory.adviser != '' || dormitory.adviser != null) {
                    await assignDormAdvisory(dormitory.id, dormitory.adviser, dormitory.name)
                }
                await updateDormitory(dormitory)
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