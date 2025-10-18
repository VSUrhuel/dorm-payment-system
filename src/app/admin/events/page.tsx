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

  // A simple skeleton loader
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Loading Events...</h1>
        {/* You can add a more detailed skeleton here */}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-2 md:flex md:justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Payables</h1>
          <p className="text-gray-600 mt-2">
            Manage one-time payables separate from the main dorm fund
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsWithStats.map((event) => (
          <Card key={event.id} className="border-gray-200">
            <CardHeader className={undefined}>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {event.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount Due:</span>
                <span className="font-semibold text-green-600">
                  ₱{event.amountDue.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Collection Progress:</span>
                  <span className="font-medium">
                    {event.paidCount}/{event.dormerTotal} Paid
                  </span>
                </div>
                <Progress value={event.progressPercentage} className="h-2" />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(event.progressPercentage)}% Complete
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs text-center mt-2">
                  <div className="text-green-600">{event.paidCount} Paid</div>
                  <div className="text-yellow-600">
                    {event.partialCount} Partial
                  </div>
                  <div className="text-red-600">{event.unpaidCount} Unpaid</div>
                </div>
              </div>

              <div className="w-full">
                <Link href={`/admin/events/${event.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
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
    </div>
  );
}
