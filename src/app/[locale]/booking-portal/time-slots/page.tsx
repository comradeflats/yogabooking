"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  duration_minutes: number;
  max_bookings: number;
  current_bookings: number;
  is_available: boolean;
  instructor_name: string | null;
  class_type?: {
    id: number;
    name: string;
    color: string;
  };
}

export default function TimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/booking-portal/time-slots");
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Failed to fetch time slots");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, slotInfo: string) => {
    if (!confirm(`Are you sure you want to delete this time slot?\n\n${slotInfo}\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/booking-portal/time-slots/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Delete failed:", response.status, errorData);
        throw new Error(errorData.error || "Failed to delete time slot");
      }

      toast.success("Time slot deleted successfully");
      fetchTimeSlots(); // Refresh the list
    } catch (error) {
      console.error("Error deleting time slot:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete time slot");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Time Slots</h1>
          <p className="text-muted-foreground">
            Manage class schedules and availability
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Time Slots ({timeSlots.length})</CardTitle>
          <CardDescription>
            Upcoming and past class schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading time slots...
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No time slots found. Create your first time slot to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border rounded-lg p-4 space-y-3"
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: slot.class_type?.color || "#71717a",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {slot.class_type && (
                          <Badge
                            style={{
                              backgroundColor: slot.class_type.color,
                              color: "white",
                            }}
                          >
                            {slot.class_type.name}
                          </Badge>
                        )}
                        <Badge variant={slot.is_available ? "default" : "secondary"}>
                          {slot.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      <p className="font-semibold">
                        {format(new Date(slot.date), "EEEE, MMMM d, yyyy")}
                      </p>

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>⏰ {slot.start_time}</span>
                        <span>⏱️ {slot.duration_minutes} min</span>
                        {slot.instructor_name && (
                          <span>👤 {slot.instructor_name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Badge variant="outline">
                        {slot.current_bookings} / {slot.max_bookings} booked
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          handleDelete(
                            slot.id,
                            `${format(new Date(slot.date), "PPP")} at ${slot.start_time}`
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
