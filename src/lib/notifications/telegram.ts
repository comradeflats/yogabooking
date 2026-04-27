import { Booking, TimeSlot } from "@/types/booking";
import { markTelegramNotificationSent } from "@/lib/db/queries";

export async function sendTelegramNotification(
  booking: Booking,
  timeSlot?: TimeSlot | null
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

  try {
    const isFixedBooking = booking.booking_type === "fixed";

    // Build message
    let message = `🧘‍♀️ *New Booking Received!*\n\n`;
    message += `*Type:* ${isFixedBooking ? "Fixed Booking" : "Custom Request"}\n`;
    message += `*Customer:* ${booking.name}\n`;
    message += `*Email:* ${booking.email}\n`;

    if (booking.phone) {
      message += `*Phone:* ${booking.phone}\n`;
    }

    message += `\n`;

    if (isFixedBooking && timeSlot) {
      message += `*Class Details:*\n`;
      if (timeSlot.class_type) {
        message += `• ${timeSlot.class_type.name}\n`;
      }
      message += `• Date: ${new Date(timeSlot.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}\n`;
      message += `• Time: ${timeSlot.start_time} (${timeSlot.duration_minutes} min)\n`;
      if (timeSlot.instructor_name) {
        message += `• Instructor: ${timeSlot.instructor_name}\n`;
      }
    } else {
      message += `*Requested Time:*\n`;
      message += `• Date: ${new Date(booking.requested_date!).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}\n`;
      message += `• Time: ${booking.requested_time}\n`;
    }

    if (booking.notes) {
      message += `\n*Notes:* ${booking.notes}\n`;
    }

    message += `\n*Booking ID:* #${booking.id}\n`;
    message += `*Status:* ${booking.status}\n`;

    // Send message via Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${JSON.stringify(error)}`);
    }

    // Mark notification as sent
    await markTelegramNotificationSent(booking.id);

    console.log(`✅ Telegram notification sent for booking #${booking.id}`);
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    throw error;
  }
}
