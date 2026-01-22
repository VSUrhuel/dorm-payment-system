import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { firestore as db } from "../firebase"
import { Fine } from "@/app/admin/fines/types";

export const getFines = (dormitoryId: string, onNext: (fines: Fine[]) => void) => {
    const q = query(
        collection(db, "fines"), 
        where("dormitoryId", "==", dormitoryId),
        where("isDeleted", "==", false)
    );
    
    return onSnapshot(q, (snapshot) => {
        const fines = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Fine[];
        onNext(fines);
    });
}

export const addFine = async (fine: Fine, dormitoryId: string) => {
    try {
        await addDoc(collection(db, "fines"), {
            ...fine, 
            dormitoryId, 
            isDeleted: false,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        throw error
    }
}

export const updateFine = async (fine: Fine) => {
    try {
        await updateDoc(doc(db, "fines", fine.id!), {
            ...fine, 
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        throw error
    }
}

export const deleteFine = async (fine: Fine) => {
    try {
        await updateDoc(doc(db, "fines", fine.id!), { 
            isDeleted: true,
            deletedAt: serverTimestamp()
        });
    } catch (error) {
        throw error
    }
}
