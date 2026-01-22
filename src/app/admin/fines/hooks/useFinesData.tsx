import { useEffect, useState } from "react";
import { Fine } from "../types";
import { getFines } from "@/lib/admin/fines";
import { useCurrentDormitoryId } from "@/hooks/useCurrentDormitoryId";


export const useFinesData = () =>{
    const [fines, setFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { dormitoryId, loading: authLoading } = useCurrentDormitoryId();
    
    useEffect(() => {
        if (authLoading || !dormitoryId) return;

        const unsubscribe = getFines(dormitoryId, (finesData) => {
            setFines(finesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dormitoryId, authLoading]);

    
    return { fines, loading, error };
}