"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import { useEventData } from "./hooks/useEventData";
import { useEventActions } from "./hooks/useEventAction";
import { EventDormerData } from "../types";
import { Button } from "../../../../components/ui/button";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import EventDormersTable from "../components/EventDormersTable";
import AddEventPaymentModal from "../components/AddEventPaymentModal";
import DormerFilters from "../../dormers/components/DormerFilters";

export default function EventDetailsContent() {
  const [user, setUser] = useState<User | null>(null);
  const {
    loading,
    event,
    paginatedDormers,
    stats,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleNextPage,
    handlePreviousPage,
    dormers,
    payments,
  } = useEventData();

  const { isSendingEmail, handlePaymentSubmit, remindPayable } =
    useEventActions(event, payments, dormers);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDormer, setSelectedDormer] = useState<EventDormerData | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsubscribe();
  }, []);

  const handleLogPayment = (dormer: EventDormerData) => {
    setSelectedDormer(dormer);
    setPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
          <p className="mt-4 text-[#333333] font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm" className="text-[#2E7D32] hover:bg-[#A5D6A7]/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
        <Card className="border-2 border-gray-100 shadow-md bg-white">
          <CardContent className="p-0">
            <div className="text-center py-16 px-4">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-red-100/50 rounded-full blur-2xl"></div>
                <div className="relative p-6 rounded-full bg-red-500">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#333333] mb-2">Event Not Found</h1>
              <p className="text-gray-600 mb-6">
                The event you're looking for doesn't exist or may have been removed.
              </p>
              <Link href="/admin/events">
                <Button className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold transition-all" variant="default" size="default">
                  Return to Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm" className="text-[#2E7D32] hover:bg-[#A5D6A7]/20 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-100 shadow-lg p-6 md:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-[#12372A]">{event.name}</h1>
              <Badge
                variant={event.status === "Active" ? "default" : "secondary"}
                className={
                  event.status === "Active"
                    ? "bg-[#A5D6A7] text-[#2E7D32] hover:bg-[#A5D6A7] font-semibold px-3 py-1"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100 font-semibold px-3 py-1"
                }
              >
                {event.status}
              </Badge>
            </div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">{event.description}</p>
          </div>
          <div className="lg:ml-6">
            <Button
              className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
              onClick={remindPayable}
              disabled={isSendingEmail || stats.unpaidDormers === 0}
              variant="default"
              size="default"
            >
              {isSendingEmail ? "Sending..." : "Send Reminder"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#12372A] mb-4">Event Statistics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Amount Due
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#E0E0E0]">
              <DollarSign className="h-5 w-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl md:text-3xl font-bold text-[#333333]">₱{event.amountDue.toFixed(2)}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5">per dormer</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Participants
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#E0E0E0]">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl md:text-3xl font-bold text-[#333333]">{stats.totalDormers}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5">Total dormers assigned</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Total Collected
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#A5D6A7]">
              <CheckCircle className="h-5 w-5 text-[#2E7D32]" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <div className="text-2xl md:text-3xl font-bold text-[#2E7D32]">
              ₱{stats.totalCollected.toFixed(2)}
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5">
              {Math.round(stats.collectionProgress)}% collected
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Due Date
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-red-100">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-lg md:text-xl font-bold text-[#333333]">
              {new Date(event.dueDate).toLocaleDateString()}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5">Payment deadline</p>
          </CardContent>
        </Card>
      </div>

      <DormerFilters
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        count={paginatedDormers.length}
        resetFilter={() => {
          setSearchTerm("");
          setStatusFilter("All");
        }}
      />

      <EventDormersTable
        dormers={paginatedDormers}
        onLogPayment={handleLogPayment}
        eventAmount={event.amountDue}
      />

      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </Button>
        </div>
      </div>

      <AddEventPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        dormer={selectedDormer}
        currentUser={user}
        event={event}
        onSave={(data) => handlePaymentSubmit(data, user)}
      />
    </div>
  );
}
