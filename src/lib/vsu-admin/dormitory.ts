import { Dormitory } from "@/app/vsu-admin/dormitories/types";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import { toast } from "sonner";
import { Dormer } from "@/app/admin/dormers/types";

export const createDormitory = async (dormitory: Dormitory) => {
    try {
        const docRef = await addDoc(collection(db, "dormitories"), {
        ...dormitory,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
        })
        return docRef.id;
    } catch (error) {
        toast.error("Error creating dormitory:", error)
    }
}

export const updateDormitory = async (dormitory: Dormitory) => {
    try {
        await setDoc(doc(db, "dormitories", dormitory.id), {
        ...dormitory,
        updatedAt: serverTimestamp(),
        })
    } catch (error) {
        toast.error("Error updating dormitory:", error)
    }
}

export const softDeleteDormitory = async (dormitoryId: string) => {
    try {
        await updateDoc(doc(db, "dormitories", dormitoryId), {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        })
    } catch (error) {
        toast.error("Error soft deleting dormitory:", error)
    }
}

export const hardDeleteDormitory = async (dormitoryId: string) => {
    try {
        await deleteDoc(doc(db, "dormitories", dormitoryId))
    } catch (error) {
        toast.error("Error hard deleting dormitory:", error)
    }
}

export const getDormitories = async () => {
    try {
        const dormitoriesSnapshot = await getDocs(collection(db, "dormitories"))
        const dormitories = dormitoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        return dormitories
    } catch (error) {
        toast.error("Error getting dormitories:", error)
    }
}

export const dormerCount = async (dormitoryId: string) => {
    try {
        const dormerSnapshot = await getDocs(collection(db, "dormers"))
        const dormers = dormerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        return dormers.filter((dormer: Dormer) => dormer.dormitoryId === dormitoryId && !dormer.isDeleted).length
    } catch (error) {
        toast.error("Error getting dormers:", error)
    }
}

export const getDormAdviser = async (userId: string) => {
    try {
        const userSnapshot = await getDocs(collection(db, "dormers"))
        const users = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        const adviserName = users.find((user: Dormer) => user.id === userId) as Dormer
        return adviserName.firstName + " " + adviserName.lastName
    } catch (error) {
        toast.error("Error getting user:", error)
    }
}