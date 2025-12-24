import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
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

export const getEventPayment = async (eventData: any, dormerId: string) => {
  const eventPaymentsQuery = query(
    collection(db, "eventPayments"),
    where("eventId", "==", eventData.id),
    where("dormerId", "==", dormerId)
  );
  const eventPaymentsSnapshot = await getDocs(eventPaymentsQuery);
  const payment = eventPaymentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return payment;
};
