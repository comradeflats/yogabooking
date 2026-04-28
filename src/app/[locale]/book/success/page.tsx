import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, User, Mail, Phone } from "lucide-react";

async function getBooking(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bookings/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function SuccessContent({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  const bookingId = params.id;

  if (!bookingId) {
    notFound();
  }

  const booking = await getBooking(bookingId);

  if (!booking) {
    notFound();
  }

  const isFixedBooking = booking.booking_type === "fixed";
  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    cancelled: "bg-red-500",
    completed: "bg-blue-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            {isFixedBooking
              ? "Your class has been booked successfully"
              : "We've received your custom time request"}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Booking Details</CardTitle>
              <Badge variant="outline">#{booking.id}</Badge>
            </div>
            <CardDescription>
              Reference this booking ID for any inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[booking.status as keyof typeof statusColors]}`} />
              <span className="font-medium capitalize">{booking.status}</span>
            </div>

            {/* Class Details or Custom Request */}
            {isFixedBooking && booking.time_slot ? (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-lg">Class Information</h3>

                {booking.time_slot.class_type && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-8 rounded"
                      style={{ backgroundColor: booking.time_slot.class_type.color }}
                    />
                    <div>
                      <div className="font-medium">{booking.time_slot.class_type.name}</div>
                      {booking.time_slot.class_type.description && (
                        <div className="text-sm text-muted-foreground">
                          {booking.time_slot.class_type.description}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(booking.time_slot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.time_slot.start_time} ({booking.time_slot.duration_minutes} minutes)</span>
                </div>

                {booking.time_slot.instructor_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Instructor: {booking.time_slot.instructor_name}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-lg">Requested Time</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(booking.requested_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.requested_time}</span>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold">Your Information</h3>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{booking.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{booking.email}</span>
              </div>
              {booking.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.phone}</span>
                </div>
              )}
            </div>

            {booking.notes && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isFixedBooking ? (
              <>
                <p className="text-sm">
                  ✅ You&apos;ll receive a confirmation email at <strong>{booking.email}</strong>
                </p>
                <p className="text-sm">
                  📧 We&apos;ll send you a reminder 24 hours before your class
                </p>
                <p className="text-sm">
                  🧘‍♀️ Please arrive 10 minutes early for your first class
                </p>
                <p className="text-sm">
                  💼 Bring your own mat or let us know if you need one
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  ✅ We&apos;ve received your custom time request
                </p>
                <p className="text-sm">
                  📧 We&apos;ll review your request and get back to you within 24 hours at <strong>{booking.email}</strong>
                </p>
                <p className="text-sm">
                  🙏 Thank you for your patience while we check our availability
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
          <Link href="/book">
            <Button>Book Another Class</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    }>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
