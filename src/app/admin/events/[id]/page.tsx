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
      <div className="p-4 md:p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm" className={undefined}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="text-gray-600 mt-2">
            The event you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/admin/events" className="mt-4 inline-block">
            <Button className={undefined} variant={undefined} size={undefined}>
              Return to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm" className={undefined}>
              Events
            </Button>
          </Link>
          <span>/</span>
          <p className="text-gray-600">{event.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={remindPayable}
            disabled={isSendingEmail || stats.unpaidDormers === 0}
            variant={undefined}
            size={undefined}
          >
            {isSendingEmail ? "Sending..." : "Send Reminder"}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <Badge
            variant={event.status === "Active" ? "default" : "secondary"}
            className={
              event.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {event.status}
          </Badge>
        </div>
        <p className="text-gray-600 mt-2">{event.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={undefined}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount Due
            </CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl font-bold">₱{event.amountDue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">per dormer</p>
          </CardContent>
        </Card>

        <Card className={undefined}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl font-bold">{stats.totalDormers}</p>
            <p className="text-xs text-gray-500 mt-1">Total dormers assigned</p>
          </CardContent>
        </Card>

        <Card className={undefined}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Total Collected
            </CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <div className="text-2xl font-bold text-green-600">
              ₱{stats.totalCollected.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(stats.collectionProgress)}% collected
            </p>
          </CardContent>
        </Card>

        <Card className={undefined}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-lg font-bold">
              {new Date(event.dueDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Payment deadline</p>
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={undefined}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={undefined}
        >
          Next
        </Button>
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
