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
        const unsub = onSnapshot(query(collection(db, "dormitories")), (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Dormitory[]
            setRawDormitories(data)
            setDormsLoaded(true)
        }, (err) => {
            console.error("Error fetching dormitories:", err)
            setLoading(false)
        })

        const advisersUnsub = onSnapshot(query(collection(db, "dormers"), where("role", "==", "Adviser")), (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Dormer[]
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
        setLoading(true)
        const unsub = onSnapshot(query(collection(db, "dormers")), (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setAllDormers(data)
            setDormersLoaded(true)
        }, (err) => {
            console.error("Error fetching dormers:", err)
            setLoading(false)
        })
        setLoading(false)
        return () => unsub()
    }, [])

    useEffect(() => {
        if (dormsLoaded && dormersLoaded) {
            const merged = rawDormitories.map((dorm) => {
                const adviser = allDormers.find((d) => d.id === dorm.adviser);
                const adviserName = adviser ? `${adviser.firstName} ${adviser.lastName}` : (dorm.adviser || "No Adviser");
                
                return {
                    ...dorm,
                    adviser: adviserName,
                    occupancy: allDormers.filter((d) => d.dormitoryId === dorm.id && !d.isDeleted).length
                };
            });
            setDormitories(merged);
            setLoading(false);
        }
    }, [rawDormitories, allDormers, dormsLoaded, dormersLoaded]);

    useEffect(() => {
        setLoading(true)
        const totalPages = Math.ceil(dormitories.length / dormsPerPage)
        setTotalPages(totalPages)
        setLoading(false)
    }, [dormitories])


    const filteredDormitories = useMemo(() => {
        setLoading(true)
        const filteredDorm = dormitories.filter((dormitory) =>
            dormitory.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            dormitory.location.toLowerCase().includes(locationFilter.toLowerCase())
        )
        setLoading(false)
        return filteredDorm
    }, [dormitories, searchTerm, locationFilter])
    
    const paginatedDormitories = useMemo(() => {
        setLoading(true)
        const indexOfLastDormitory = currentPage * dormsPerPage
        const indexOfFirstDormitory = indexOfLastDormitory - dormsPerPage
        setLoading(false)
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
