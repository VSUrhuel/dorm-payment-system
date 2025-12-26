"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore as db } from "../../../../lib/firebase";
import { Dormer } from "../../dormers/types";
import { Event, EventPayment } from "../types";
import { toast } from "sonner";
import { useCurrentDormitoryId } from "@/hooks/useCurrentDormitoryId";


export function useEventsData() {
  const [events, setEvents] = useState<Event[]>([]);
  const [dormers, setDormers] = useState<Dormer[]>([]);
  const [eventPayments, setEventPayments] = useState<EventPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const {dormitoryId, loading: eventDormitoryLoading } = useCurrentDormitoryId();

  useEffect(() => {
    if(!eventDormitoryLoading && !dormitoryId) {
      setLoading(false);
      return;
    }
    const unsubscribeEvents = onSnapshot(
      query(collection(db, "events"), where("dormitoryId", "==", dormitoryId)),
      (snapshot) => {
        setEvents(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event))
        );
        setLoading(false);
      },
      (error) => {
        toast.error("Failed to load events.");
        console.error(error);
        setLoading(false);
      }
    );

    const unsubscribeDormers = onSnapshot(
      query(collection(db, "dormers"), where("role", "==", "User"), where("dormitoryId", "==", dormitoryId)),
      (snapshot) => {
        setDormers(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Dormer))
        );
      }
    );

    const unsubscribePayments = onSnapshot(
      query(collection(db, "eventPayments"), where("dormitoryId", "==", dormitoryId)),
      (snapshot) => {
        setEventPayments(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as EventPayment)
          )
        );
      }
    );

    return () => {
      unsubscribeEvents();
      unsubscribeDormers();
      unsubscribePayments();
    };
  }, [dormitoryId, eventDormitoryLoading]);

  const eventsWithStats = useMemo(() => {
    return events.map((event) => {
      const paymentsForEvent = eventPayments.filter(
        (p: any) => p.eventId === event.id && p.dormitoryId === dormitoryId
      );

      const paidDormerIds = new Set(
        paymentsForEvent
          .filter((p: any) => p.status === "Paid" && p.dormitoryId === dormitoryId)
          .map((p: any) => p.dormerId)
      );
      
      const partialDormerIds = new Set(
        paymentsForEvent
          .filter((p: any) => p.status === "Partial" && p.dormitoryId === dormitoryId)
          .map((p: any) => p.dormerId)
      );

      const dormerTotal = dormers.filter(
        (d: any) => (!d.isDeleted || paidDormerIds.has(d.id)) && d.dormitoryId === dormitoryId
      ).length;

      const paidCount = paidDormerIds.size;
      const partialCount = partialDormerIds.size;

      const displayPaidCount = paidCount > dormerTotal ? dormerTotal : paidCount;
      const displayPartialCount = partialCount > dormerTotal ? dormerTotal : partialCount;
      const unpaidCount = Math.max(0, dormerTotal - displayPaidCount - displayPartialCount);
      
      const progressPercentage =
        dormerTotal > 0 ? (displayPaidCount / dormerTotal) * 100 : 0;

      return {
        ...event,
        paidCount: displayPaidCount,
        partialCount: displayPartialCount,
        unpaidCount,
        dormerTotal,
        progressPercentage,
      };
    });
  }, [events, dormers, eventPayments, dormitoryId]);

  return { loading, eventsWithStats, dormers };
}
