import { useState } from "react";
import { Fine } from "../types";
import { addFine as addFineLib, updateFine as updateFineLib, deleteFine as deleteFineLib } from "@/lib/admin/fines";
import { useCurrentDormitoryId } from "@/hooks/useCurrentDormitoryId";
import { toast } from "sonner";

import { User } from "firebase/auth";

export const useFinesActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const { dormitoryId } = useCurrentDormitoryId();
    
    const addFine = async (fine: Fine) => {
        if (!dormitoryId) {
            toast.error("Dormitory ID not found");
            return;
        }
        try {
            setLoading(true);
            await addFineLib(fine, dormitoryId);
            setLoading(false);
            toast.success("Fine added successfully");
        } catch (error) {
            setError(error as Error);
            setLoading(false);
            toast.error("Failed to add fine");
        }
    };

    
    const updateFine = async (fine: Fine) => {
        try {
            setLoading(true);
            await updateFineLib(fine);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };
    
    const deleteFine = async (fine: Fine) => {
        try {
            setLoading(true);
            await deleteFineLib(fine);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const saveFinePayable = async (fineData: Fine, user: User | null) => {
        try {
            setLoading(true);
            await saveFinePayable(fineData, user);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }
    
    return { addFine, updateFine, deleteFine, loading, error };
}