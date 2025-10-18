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
    const dormerTotal = dormers.length;

    return events.map((event) => {
      const paymentsForEvent = eventPayments.filter(
        (p) => p.eventId === event.id
      );
      const paidDormers = new Set(
        paymentsForEvent
          .filter((p) => p.status === "Paid")
          .map((p) => p.dormerId)
      );
      const partialDormers = new Set(
        paymentsForEvent
          .filter((p) => p.status === "Partial")
          .map((p) => p.dormerId)
      );

      const paidCount = paidDormers.size;
      const partialCount = partialDormers.size;
      const unpaidCount = dormerTotal - paidCount - partialCount;
      const progressPercentage =
        dormerTotal > 0 ? (paidCount / dormerTotal) * 100 : 0;

      return {
        ...event,
        paidCount,
        partialCount,
        unpaidCount,
        dormerTotal,
        progressPercentage,
      };
    });
  }, [events, dormers, eventPayments]);

  return { loading, eventsWithStats, dormers };
}
