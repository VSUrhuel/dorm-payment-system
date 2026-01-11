import { AdviserData, Dormer } from "@/app/admin/dormers/types";
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc, deleteDoc, getDocs, query, where, getDoc } from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import { toast } from "sonner";
import { createAccountWithoutLoggingOut } from "../admin/dormer";
import { User } from "firebase/auth";
import { sendEmail } from "@/app/utils/sendEmail";
import { welcomeAdviserEmail } from "@/app/admin/dormers/email-templates/welcomeAdviserEmail";

export const createAdviserData = async (adviser: AdviserData, currentAdmin: User, temporaryPassword: string) => {
    try {
         const newAdminUid = await createAccountWithoutLoggingOut(adviser.email, temporaryPassword);
        
        await setDoc(doc(db, "dormers", newAdminUid), {
            ...adviser,
            id: newAdminUid,
            createdAt: serverTimestamp(),
            createdBy: currentAdmin.uid,
            isDeleted: false,
        });
        toast.success("Adviser created successfully")
        return newAdminUid;
    } catch (error) {
        console.error(error)
        toast.error("Error creating adviser!")
    }
}


export const updateAdviserData = async (adviser: AdviserData) => {
    try {
        if(!adviser.id) {
            toast.error("Adviser ID is required!")
            return
        }
        await updateDoc(doc(db, "dormers", adviser.id), {
        ...adviser,
        isDeleted: false,
        updatedAt: serverTimestamp(),
        })
        toast.success("Adviser updated successfully")
    } catch (error) {
        console.error(error)
        toast.error("Error updating adviser:", error)
    }
}

export const softDeleteAdviserData = async (adviserId: string) => {
    try {
        await updateDoc(doc(db, "dormers", adviserId), {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        })
        toast.success("Adviser soft deleted successfully")
    } catch (error) {
        toast.error("Error soft deleting adviser:", error)
    }
}

export const hardDeleteAdviserData = async (adviserId: string) => {
    try {
        await deleteDoc(doc(db, "dormers", adviserId))
        toast.success("Adviser hard deleted successfully")
    } catch (error) {
        toast.error("Error hard deleting adviser:", error)
    }
}

export const getAdviserById = async (adviserId: string) => {
    try {
        const adviserSnapshot = await getDoc(doc(db, "dormers", adviserId))
        const adviser = adviserSnapshot.data() as AdviserData
        return adviser
    } catch (error) {
        toast.error("Error getting adviser:", error)
    }
}

export const updateDormAdvisory = async (dormId: string, adviserId: string, dormitoryName: string) => {
    try {
        const adviserData = await getAdviserById(adviserId)
        if(!adviserData) {
            toast.error("Adviser not found!")
            return
        }
        await updateDoc(doc(db, "dormers", adviserId), {
            dormitoryId: dormId,
            dormitoryName: dormitoryName,
            updatedAt: serverTimestamp(),
            isDeleted: false,
        })
        
        await sendEmail({
                  to: adviserData.email,
                  subject: "Welcome to DormPay System",
                  html: welcomeAdviserEmail(
                    adviserData.firstName,
                    adviserData.email,
                    "iloveVSU-DormPay",
                    dormitoryName
                  ),
                });
        toast.success("Dormitory advisor was changed successfully")
        return;
    } catch (error) {
        console.error(error)
        toast.error("Error updating dormitory advisory:", error)
    }
}

export const getAdvisers = async () => {
    try {
        const advisersSnapshot = await getDocs(query(collection(db, "dormers"), where("role", "==", "Adviser"), where("isDeleted", "==", false)))
        const advisers = advisersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Dormer[]
        return advisers
    } catch (error) {
        toast.error("Error getting advisers:", error)
    }
}