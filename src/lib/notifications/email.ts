import { Resend } from "resend";
import { Booking, TimeSlot } from "@/types/booking";
import BookingConfirmation from "@/emails/BookingConfirmation";
import CustomRequestReceived from "@/emails/CustomRequestReceived";

// Lazy initialization of Resend client
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) {
    throw new Error("Resend client not initialized");
  }
  return resend;
}

export async function sendBookingConfirmation(
  booking: Booking,
  timeSlot?: TimeSlot | null
): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL;

  if (!process.env.RESEND_API_KEY || !fromEmail) {
    console.warn("Resend credentials not configured, skipping email");
    return;
  }

  try {
    const isFixedBooking = booking.booking_type === "fixed";

    if (isFixedBooking && !timeSlot) {
      throw new Error("Time slot is required for fixed booking confirmation");
    }

    const client = getResendClient();
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: isFixedBooking
        ? "Your Yoga Class Booking is Confirmed! 🧘‍♀️"
        : "We've Received Your Custom Time Request 🙏",
      react: isFixedBooking
        ? BookingConfirmation({ booking, timeSlot: timeSlot! })
        : CustomRequestReceived({ booking }),
    });

    if (error) {
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log(`✅ Email sent to ${booking.email} (ID: ${data?.id})`);
  } catch (error) {
    console.error("Failed to send email confirmation:", error);
    throw error;
  }
}
