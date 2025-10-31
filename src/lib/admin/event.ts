import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";

export const addEvent = async (eventData: any, createdBy: string) => {
  const docRef = await addDoc(collection(db, "events"), {
    ...eventData,
    createdBy,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateEvent = async (eventData: any, updatedBy: string) => {
  const eventRef = doc(db, "events", eventData.id);
  await setDoc(eventRef, {
    ...eventData,
    updatedBy,
    updatedAt: serverTimestamp(),
  });
};
