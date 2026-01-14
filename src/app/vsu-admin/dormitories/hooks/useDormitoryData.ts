import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { firestore as db } from "@/lib/firebase"
import { Dormitory } from "../types"
import { getDormAdviser } from "@/lib/vsu-admin/dormitory"
import { Dormer } from "@/app/admin/dormers/types"


export function useDormitoryData() {
    const [dormitories, setDormitories] = useState<Dormitory[]>([])
    const [rawDormitories, setRawDormitories] = useState<Dormitory[]>([])
    const [allDormers, setAllDormers] = useState<any[]>([])
    const [dormsLoaded, setDormsLoaded] = useState(false)
    const [dormersLoaded, setDormersLoaded] = useState(false)
    const [advisers, setAdvisers] = useState<Dormer[]>([])

    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [locationFilter, setLocationFilter] = useState("")
    const [loading, setLoading] = useState(true)

    const dormsPerPage = 10

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "dormitories"), where("isDeleted", "==", false)), (snap) => {
            const data = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Dormitory[]
            setRawDormitories(data)
            setDormsLoaded(true)
        }, (err) => {
            console.error("Error fetching dormitories:", err)
            setLoading(false)
        })

        const advisersUnsub = onSnapshot(query(collection(db, "dormers"), where("role", "==", "Adviser"), where("isDeleted", "==", false)), (snap) => {
            const data = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Dormer[]
            setAdvisers(data)
            
        }, (err) => {
            console.error("Error fetching dormers:", err)
            setLoading(false)
        })

        return () => {
            unsub()
            advisersUnsub()
        }
    }, [])

   

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "dormers")), (snap) => {
            const data = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setAllDormers(data)
            setDormersLoaded(true)
        }, (err) => {
            console.error("Error fetching dormers:", err)
            setLoading(false)
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (dormsLoaded && dormersLoaded) {
            const merged = rawDormitories.map((dorm) => {
                const adviser = allDormers.find((d) => d.id === dorm.adviser);
                const adviserName = adviser ? `${adviser.firstName} ${adviser.lastName}` : (dorm.adviser || "No Adviser");
                
                return {
                    ...dorm,
                    adviser: dorm.adviser, // Keep as ID
                    adviserName: adviserName, // Set the name
                    occupancy: allDormers.filter((d) => d.dormitoryId === dorm.id && !d.isDeleted && d.role === "User").length
                };
            });
            setDormitories(merged);
            setLoading(false);
        }
    }, [rawDormitories, allDormers, dormsLoaded, dormersLoaded]);

    useEffect(() => {
        const totalPages = Math.ceil(dormitories.length / dormsPerPage)
        setTotalPages(totalPages)
    }, [dormitories])


    const filteredDormitories = useMemo(() => {
        const filteredDorm = dormitories.filter((dormitory) =>
            dormitory.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            dormitory.location.toLowerCase().includes(locationFilter.toLowerCase())
        )
        return filteredDorm
    }, [dormitories, searchTerm, locationFilter])
    
    const paginatedDormitories = useMemo(() => {
        const indexOfLastDormitory = currentPage * dormsPerPage
        const indexOfFirstDormitory = indexOfLastDormitory - dormsPerPage
        return filteredDormitories.slice(indexOfFirstDormitory, indexOfLastDormitory)
    }, [filteredDormitories, currentPage])

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
    }
}
