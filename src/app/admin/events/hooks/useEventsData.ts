"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore as db } from "../../../../lib/firebase";
import { Dormer } from "../../dormers/types";
import { Event, EventPayment } from "../types";
import { toast } from "sonner";


export function useEventsData() {
  const [events, setEvents] = useState<Event[]>([]);
  const [dormers, setDormers] = useState<Dormer[]>([]);
  const [eventPayments, setEventPayments] = useState<EventPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeEvents = onSnapshot(
      collection(db, "events"),
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
      query(collection(db, "dormers"), where("role", "==", "User")),
      (snapshot) => {
        setDormers(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Dormer))
        );
      }
    );

    const unsubscribePayments = onSnapshot(
      collection(db, "eventPayments"),
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
  }, []);

  const eventsWithStats = useMemo(() => {
    return events.map((event) => {
      const paymentsForEvent = eventPayments.filter(
        (p) => p.eventId === event.id
      );

      const paidDormerIds = new Set(
        paymentsForEvent
          .filter((p) => p.status === "Paid")
          .map((p) => p.dormerId)
      );
      
      const partialDormerIds = new Set(
        paymentsForEvent
          .filter((p) => p.status === "Partial")
          .map((p) => p.dormerId)
      );

      const dormerTotal = dormers.filter(
        (d) => !d.isDeleted || paidDormerIds.has(d.id)
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
  }, [events, dormers, eventPayments]);

  return { loading, eventsWithStats, dormers };
}
