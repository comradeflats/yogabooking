"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus } from "lucide-react";

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
      const response = await fetch("/api/admin/time-slots");
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Failed to fetch time slots");
    } finally {
      setLoading(false);
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
                    <div className="space-y-2">
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

                    <div className="text-right">
                      <Badge variant="outline">
                        {slot.current_bookings} / {slot.max_bookings} booked
                      </Badge>
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
