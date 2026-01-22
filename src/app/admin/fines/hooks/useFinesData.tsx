import { useEffect, useMemo, useState } from "react";
import { Fine, FineSummary, PaymentFines } from "../types";
import { getFines, getFinesSummary } from "@/lib/admin/fines";
import { useCurrentDormitoryId } from "@/hooks/useCurrentDormitoryId";
import { Dormer } from "../../dormers/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";

export const useFinesData = () =>{
    const [payableFines, setPayableFines] = useState<Fine[]>([])
    const [fines, setFines] = useState<PaymentFines[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { dormitoryId, loading: authLoading } = useCurrentDormitoryId();
    const [summary, setSummary] = useState<FineSummary | null>(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dormers, setDormers] = useState<Dormer[]>([]);

    const itemsPerPage = 10;
    useEffect(() => {
        if (authLoading || !dormitoryId) return;

        const unsubscribeFinesPayment = onSnapshot(
            query(collection(db, "finesPayment"), where("dormitoryId", "==", dormitoryId)),
            (snapshot) => {
                const finesData = snapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as PaymentFines)
                );
                setFines(finesData);
                setLoading(false);
            }
        );

        const unsubscribeFinesPayable = onSnapshot(
            query(collection(db, "fines"), where("dormitoryId", "==", dormitoryId)),
            (snapshot) => {
                const finesData = snapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as Fine)
                );
                setPayableFines(finesData);
                setLoading(false);
            }
        );

        const fetchSummary = async () => {
            const summary = await getFinesSummary(dormitoryId);
            setSummary(summary);
            setLoading(false);
        }

        const unsubscribeDormers = onSnapshot(
              query(collection(db, "dormers"), where("dormitoryId", "==", dormitoryId)),
              (snapshot) => {
                const dormerData = snapshot.docs
                  .map((doc) => ({ id: doc.id, ...doc.data() } as Dormer))
                  .filter(
                    (dormer) => dormer.role === "User" && dormer.isDeleted !== true
                  );
                setDormers(dormerData);
                setLoading(false);
              }
            );

        fetchSummary();

        return () => {
            unsubscribeFinesPayment();
            unsubscribeDormers();
            unsubscribeFinesPayable();
        };
    }, [dormitoryId, authLoading]);

    const dormersWithFines = useMemo(() => {
        if(!dormers.length) return [];
        return dormers.map((dormer) => ({
            ...dormer,
            fines: fines.filter((fine) => fine.dormerId === dormer.id)
        }))
    }, [dormers, fines]);

    const filteredDormers = useMemo(() => {
        return dormersWithFines.filter((dormer) => {
            const matchesSearch = `${dormer.firstName} ${dormer.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || dormer.roomNumber === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [dormersWithFines, searchTerm, statusFilter]);

    const paginatedDormers = useMemo(() => {
        const indexOfLastDormer = currentPage * itemsPerPage;
        const indexOfFirstDormer = indexOfLastDormer - itemsPerPage;
        return filteredDormers.slice(indexOfFirstDormer, indexOfLastDormer);
    }, [filteredDormers, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredDormers.length / itemsPerPage);
    }, [filteredDormers, itemsPerPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);
    return { fines, payableFines, loading, error, summary, paginatedDormers, totalPages, currentPage, searchTerm, setSearchTerm, statusFilter, setStatusFilter, handleNextPage, handlePreviousPage };
}