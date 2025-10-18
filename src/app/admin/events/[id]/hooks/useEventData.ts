"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { firestore as db } from "../../../../../lib/firebase";
import { useParams } from "next/navigation";
import { Dormer } from "../../../dormers/types";
import { Event, EventPayment, EventDormerData } from "../../types";
import { toast } from "sonner";

export function useEventData() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [dormers, setDormers] = useState<Dormer[]>([]);
  const [payments, setPayments] = useState<EventPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const dormersQuery = query(
      collection(db, "dormers"),
      where("role", "==", "User")
    );
    const unsubscribeDormers = onSnapshot(dormersQuery, (snapshot) => {
      setDormers(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Dormer))
      );
    });

    const eventDocRef = doc(db, "events", eventId);
    const unsubscribeEvent = onSnapshot(eventDocRef, (doc) => {
      if (doc.exists()) {
        setEvent({ id: doc.id, ...doc.data() } as Event);
      } else {
        toast.error("Event not found!");
        setEvent(null);
      }
      setLoading(false);
    });

    const paymentsQuery = query(
      collection(db, "eventPayments"),
      where("eventId", "==", eventId)
    );
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      setPayments(
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as EventPayment)
        )
      );
    });

    return () => {
      unsubscribeDormers();
      unsubscribeEvent();
      unsubscribePayments();
    };
  }, [eventId]);

  const eventDormersData: EventDormerData[] = useMemo(() => {
    const paymentsMap = new Map(payments.map((p) => [p.dormerId, p]));
    return dormers.map((dormer) => {
      const payment = paymentsMap.get(dormer.id);
      return {
        ...dormer,
        paymentStatus: payment?.status ?? "Unpaid",
        amountPaid: payment?.amount ?? 0,
        paymentDate: payment?.createdAt ?? null,
        paymentMethod: payment?.paymentMethod ?? null,
        recordedBy: payment?.recordedBy ?? null,
      };
    });
  }, [dormers, payments]);

  const filteredDormers = useMemo(() => {
    return eventDormersData.filter((dormer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        dormer.firstName?.toLowerCase().includes(searchLower) ||
        dormer.lastName?.toLowerCase().includes(searchLower) ||
        dormer.email?.toLowerCase().includes(searchLower);
      const matchesStatus =
        statusFilter === "All" || dormer.roomNumber === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [eventDormersData, searchTerm, statusFilter]);

  const paginatedDormers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDormers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDormers, currentPage]);

  const totalPages = Math.ceil(filteredDormers.length / itemsPerPage);

  const stats = useMemo(() => {
    const totalDormers = eventDormersData.length;
    const paidDormers = eventDormersData.filter(
      (d) => d.paymentStatus === "Paid"
    ).length;
    const unpaidDormers = totalDormers - paidDormers;
    const totalCollected = eventDormersData.reduce(
      (sum, d) => sum + d.amountPaid,
      0
    );
    const collectionProgress =
      totalDormers > 0 ? (paidDormers / totalDormers) * 100 : 0;
    return {
      totalDormers,
      paidDormers,
      unpaidDormers,
      totalCollected,
      collectionProgress,
    };
  }, [eventDormersData]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return {
    eventId,
    loading,
    event,
    paginatedDormers,
    filteredDormers,
    stats,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleNextPage,
    handlePreviousPage,
    dormers,
    payments,
  };
}
