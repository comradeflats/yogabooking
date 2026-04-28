"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Booking {
  id: number;
  booking_type: "fixed" | "custom";
  name: string;
  email: string;
  phone: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  requested_date?: string;
  requested_time?: string;
  time_slot?: {
    id: number;
    date: string;
    start_time: string;
    duration_minutes: number;
    class_type?: {
      id: number;
      name: string;
      color: string;
    };
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = statusFilter === "all"
        ? "/api/booking-portal/bookings"
        : `/api/booking-portal/bookings?status=${statusFilter}`;

      const response = await fetch(url);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/booking-portal/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("Booking status updated");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bookings</h1>
        <p className="text-muted-foreground">
          Manage all customer bookings
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "confirmed" ? "default" : "outline"}
              onClick={() => setStatusFilter("confirmed")}
              size="sm"
            >
              Confirmed
            </Button>
            <Button
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              onClick={() => setStatusFilter("cancelled")}
              size="sm"
            >
              Cancelled
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              onClick={() => setStatusFilter("completed")}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({bookings.length})</CardTitle>
          <CardDescription>
            Recent booking activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{booking.name}</h3>
                        <Badge variant="outline">#{booking.id}</Badge>
                        <Badge variant="secondary">
                          {booking.booking_type === "fixed" ? "Fixed" : "Custom"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.email}
                        {booking.phone && ` • ${booking.phone}`}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  {booking.booking_type === "fixed" && booking.time_slot ? (
                    <div className="space-y-2">
                      {booking.time_slot.class_type && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1 h-8 rounded"
                            style={{ backgroundColor: booking.time_slot.class_type.color }}
                          />
                          <Badge
                            style={{
                              backgroundColor: booking.time_slot.class_type.color,
                              color: "white",
                            }}
                          >
                            {booking.time_slot.class_type.name}
                          </Badge>
                        </div>
                      )}
                      <p className="text-sm">
                        📅 {format(new Date(booking.time_slot.date), "PPP")}
                      </p>
                      <p className="text-sm">
                        ⏰ {booking.time_slot.start_time} ({booking.time_slot.duration_minutes} min)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm">
                        📅 Requested: {format(new Date(booking.requested_date!), "PPP")}
                      </p>
                      <p className="text-sm">
                        ⏰ {booking.requested_time}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Created {format(new Date(booking.created_at), "PPp")}
                    </p>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => value && updateStatus(booking.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
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
