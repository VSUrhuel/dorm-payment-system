import { toast } from "sonner";
import { dormerCount, getDormitories } from "./dormitory";
import { Dormitory } from "@/app/vsu-admin/dormitories/types";


export const totalOccupancyCount = async () => {
    try {
        const dormitories = await getDormitories();
        let totalOccupancy = 0;
        dormitories.forEach(async (dormitory) => {
            const totalDormers = await dormerCount(dormitory.id)
            totalOccupancy += totalDormers;
        })
        return totalOccupancy;
    } catch (error) {
        toast.error("Error getting total occupancy count:", error)
    }
}


export const getKpiData = async () => {
    try {
        const dormitories = await getDormitories();
        const totalDormitories = dormitories.length;
        const totalOccupancy = await totalOccupancyCount();
        return {
            totalDormitories,
            totalOccupancy,
        }
    } catch (error) {
        toast.error("Error getting KPI data:", error)
    }
}

export const getDormitoriesOccupancy = async () => {
    try {
        const dormitories = await getDormitories() as any;
        const dormitoryOccupancy = dormitories.map(async (dormitory: Dormitory) => {
            const totalDormers = await dormerCount(dormitory.id)
            return {
                name: dormitory.name,
                totalDormers,
            }
        })
        const resolvedDormitoryOccupancy = await Promise.all(dormitoryOccupancy)
        return resolvedDormitoryOccupancy;
    } catch (error) {
        toast.error("Error getting dormitory occupancy:", error)
    }
}