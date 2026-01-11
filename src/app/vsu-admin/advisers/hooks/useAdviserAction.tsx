
import { welcomeAdminTemplate } from "@/app/admin/dormers/email-templates/welcomeAdmin"
import { AdviserData } from "@/app/admin/dormers/types"
import { generateRandomPassword } from "@/app/admin/dormers/utils/generateRandomPass"
import { sendEmail } from "@/app/utils/sendEmail"
import { createAdviserData, updateAdviserData, softDeleteAdviserData } from "@/lib/vsu-admin/adviser"
import { getAuth } from "firebase/auth"
import { useState } from "react"

export const useAdviserActions = () => {
    const [loading, setLoading] = useState(false)
    const auth = getAuth();
    const createAdviser = async (adviser: AdviserData) => {
        setLoading(true)
        try {
            const currentAdmin = auth.currentUser;
            const temporaryPassword = "iloveVSU-DormPay";
            await createAdviserData(adviser, currentAdmin!, temporaryPassword)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const updateAdviser = async (adviser: AdviserData) => {
        setLoading(true)
        try {
            await updateAdviserData(adviser)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const deleteAdviser = async (adviserId: string) => {
        setLoading(true)
        try {
            await softDeleteAdviserData(adviserId)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    return {
        loading,
        createAdviser,
        updateAdviser,
        deleteAdviser,
    }
}