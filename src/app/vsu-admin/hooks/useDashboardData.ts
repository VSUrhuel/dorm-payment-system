import { getDormitoriesOccupancy, getKpiData } from "@/lib/vsu-admin/dashboard"
import { useEffect, useState } from "react"

export function useDashboardData() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [kpiData, setKpiData] = useState(null)
    const [dormitoriesOccupancy, setDormitoriesOccupancy] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
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
        fetchDashboardData()
    }, [])

    return {
        loading,
        error,
        kpiData,
        dormitoriesOccupancy,
    }
}