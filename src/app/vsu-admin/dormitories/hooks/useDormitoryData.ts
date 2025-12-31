import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { firestore as db } from "@/lib/firebase"
import { Dormitory } from "../types"

export function useDormitoryData() {
    const [dormitories, setDormitories] = useState<Dormitory[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [locationFilter, setLocationFilter] = useState("")
    const [loading, setLoading] = useState(true)

    const dormsPerPage = 10

    useEffect(() => {
        setLoading(true)
        const unsubscribeDormitories = onSnapshot(
            query(collection(db, "dormitories")),
            (snapshot) => {
                const dormData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setDormitories(dormData as Dormitory[])
                setLoading(false)
            },
            (error) => {
                console.error("Error fetching dormitories:", error)
                setLoading(false)
            }
        )

        return () => {
            unsubscribeDormitories()
        }
    }, [])

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