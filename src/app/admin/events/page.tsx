"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useEventsData } from "./hooks/useEventsData";
import { useEventActions } from "./hooks/useEventsAction";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Skeleton } from "../../../components/ui/skeleton";
import { Plus, Eye } from "lucide-react";
import AddEventModal from "./components/AddEventModal";

export default function EventsContent() {
  const [user, setUser] = useState<User | null>(null);
  const { loading, eventsWithStats, dormers } = useEventsData();
  const { isSubmitting, handleSaveEvent } = useEventActions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-10 w-64 bg-gray-200" />
            <Skeleton className="h-5 w-96 bg-gray-200" />
          </div>
          <Skeleton className="h-10 w-40 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2 border-gray-100 shadow-md bg-white">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 bg-gray-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-7 w-20 bg-gray-200" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </div>
                  <Skeleton className="h-2 w-full bg-gray-200" />
                  <Skeleton className="h-3 w-24 mx-auto bg-gray-200" />
                  
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="py-1.5 px-2 rounded-lg bg-gray-100">
                        <Skeleton className="h-5 w-8 mx-auto mb-1 bg-gray-200" />
                        <Skeleton className="h-3 w-12 mx-auto bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full pt-2">
                  <Skeleton className="h-9 w-full bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
            Event Payables
          </h1>
          <p className="text-sm md:text-base text-[#12372A] mt-1">
            Manage one-time payables separate from the main dorm fund
          </p>
        </div>
        <Button
          className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold transition-all"
          onClick={() => setIsAddModalOpen(true)}
          variant={undefined}
          size={undefined}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(eventData) =>
          handleSaveEvent({ ...eventData, status: "Active" }, user, dormers)
        }
      />

      {eventsWithStats.length === 0 ? (
        <Card className="border-2 border-gray-100 shadow-md bg-white">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-16 px-4">              
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                No events created yet
              </h3>
              
              <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                Create your first event to start tracking one-time payables separate from regular dorm fees.
              </p>
              
              <Button
                className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold transition-all"
                onClick={() => setIsAddModalOpen(true)}
                variant={undefined}
                size={undefined}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {eventsWithStats.map((event) => (
            <Card key={event.id} className="border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-[#12372A] group-hover:text-[#2E7D32] transition-colors">
                  {event.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Amount Due:</span>
                  <span className="font-bold text-xl text-[#2E7D32]">
                    ₱{event.amountDue.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Collection Progress:</span>
                    <span className="font-semibold text-[#333333]">
                      {event.paidCount}/{event.dormerTotal} Paid
                    </span>
                  </div>
                  <Progress value={event.progressPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 text-center font-medium">
                    {Math.round(event.progressPercentage)}% Complete
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center mt-3">
                    <div className="py-1.5 px-2 rounded-lg bg-[#A5D6A7]/20">
                      <span className="font-bold text-[#2E7D32]">{event.paidCount}</span>
                      <span className="text-gray-600 block">Paid</span>
                    </div>
                    <div className="py-1.5 px-2 rounded-lg bg-yellow-50">
                      <span className="font-bold text-yellow-700">{event.partialCount}</span>
                      <span className="text-gray-600 block">Partial</span>
                    </div>
                    <div className="py-1.5 px-2 rounded-lg bg-red-50">
                      <span className="font-bold text-red-600">{event.unpaidCount}</span>
                      <span className="text-gray-600 block">Unpaid</span>
                    </div>
                  </div>
                </div>

                <div className="w-full pt-2">
                  <Link href={`/admin/events/${event.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex w-full border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all font-semibold"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
