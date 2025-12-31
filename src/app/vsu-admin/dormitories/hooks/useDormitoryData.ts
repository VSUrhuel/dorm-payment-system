import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { firestore as db } from "@/lib/firebase"
import { Dormitory } from "../types"


export function useDormitoryData() {
    const [dormitories, setDormitories] = useState<Dormitory[]>([])
    const [rawDormitories, setRawDormitories] = useState<Dormitory[]>([])
    const [allDormers, setAllDormers] = useState<any[]>([])
    const [dormsLoaded, setDormsLoaded] = useState(false)
    const [dormersLoaded, setDormersLoaded] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [locationFilter, setLocationFilter] = useState("")
    const [loading, setLoading] = useState(true)

    const dormsPerPage = 10

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "dormitories")), (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Dormitory[]
            setRawDormitories(data)
            setDormsLoaded(true)
        }, (err) => {
            console.error("Error fetching dormitories:", err)
            setLoading(false)
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "dormers")), (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setAllDormers(data)
            setDormersLoaded(true)
        }, (err) => console.error("Error fetching dormers:", err))
        return () => unsub()
    }, [])

    useEffect(() => {
        if (dormsLoaded && dormersLoaded) {
            const merged = rawDormitories.map((dorm) => ({
                ...dorm,
                occupancy: allDormers.filter((d) => d.dormitoryId === dorm.id && !d.isDeleted).length
            }))
            setDormitories(merged)
            setLoading(false)
        }
    }, [rawDormitories, allDormers, dormsLoaded, dormersLoaded])

    useEffect(() => {
        const totalPages = Math.ceil(dormitories.length / dormsPerPage)
        setTotalPages(totalPages)
    }, [dormitories])

    const filteredDormitories = useMemo(() => {
        return dormitories.filter((dormitory) =>
            dormitory.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            dormitory.location.toLowerCase().includes(locationFilter.toLowerCase())
        )
    }, [dormitories, searchTerm, locationFilter])

    

    const paginatedDormitories = useMemo(() => {
        const indexOfLastDormitory = currentPage * dormsPerPage
        const indexOfFirstDormitory = indexOfLastDormitory - dormsPerPage
        return dormitories.slice(indexOfFirstDormitory, indexOfLastDormitory)
    }, [dormitories, currentPage])

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    return {
        dormitories,
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
    }
}