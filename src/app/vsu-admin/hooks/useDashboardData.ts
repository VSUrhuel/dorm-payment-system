import { getDormitoriesOccupancy, getDormitoryData, getKpiData } from "@/lib/vsu-admin/dashboard"
import { useEffect, useState } from "react"


export function useDashboardData() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [kpiData, setKpiData] = useState(null)
    const [dormitoriesOccupancy, setDormitoriesOccupancy] = useState(null)
    const [dormitoryData, setDormitorydata] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const kpiData = await getKpiData()
                const dormitoriesOccupancy = await getDormitoriesOccupancy()
                setKpiData(kpiData)
                setDormitoriesOccupancy(dormitoriesOccupancy)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        const fetchDormitoryData = async () => {
            try {
                const dormitoryData = await getDormitoryData()
                setDormitorydata(dormitoryData)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
        fetchDormitoryData()
    }, [])

    return {
        loading,
        error,
        kpiData,
        dormitoriesOccupancy,
        dormitoryData
    }
}