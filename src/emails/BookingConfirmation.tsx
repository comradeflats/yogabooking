import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Booking, TimeSlot } from "@/types/booking";

interface BookingConfirmationProps {
  booking: Booking;
  timeSlot: TimeSlot;
}

export default function BookingConfirmation({
  booking,
  timeSlot,
}: BookingConfirmationProps) {
  const formattedDate = new Date(timeSlot.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Your yoga class booking is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🧘‍♀️ Booking Confirmed!</Heading>

          <Text style={text}>Hi {booking.name},</Text>

          <Text style={text}>
            Your yoga class booking has been confirmed. We&apos;re excited to see you
            on the mat!
          </Text>

          <Section style={infoSection}>
            <Heading style={h2}>Class Details</Heading>

            {timeSlot.class_type && (
              <>
                <Text style={label}>Class Type:</Text>
                <Text style={value}>{timeSlot.class_type.name}</Text>
                {timeSlot.class_type.description && (
                  <Text style={description}>
                    {timeSlot.class_type.description}
                  </Text>
                )}
              </>
            )}

            <Text style={label}>Date:</Text>
            <Text style={value}>{formattedDate}</Text>

            <Text style={label}>Time:</Text>
            <Text style={value}>
              {timeSlot.start_time} ({timeSlot.duration_minutes} minutes)
            </Text>

            {timeSlot.instructor_name && (
              <>
                <Text style={label}>Instructor:</Text>
                <Text style={value}>{timeSlot.instructor_name}</Text>
              </>
            )}

            <Text style={label}>Booking ID:</Text>
            <Text style={value}>#{booking.id}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading style={h2}>What to Bring</Heading>
            <Text style={text}>
              • Your own yoga mat (or let us know if you need one)
              <br />
              • Comfortable, breathable clothing
              <br />
              • Water bottle
              <br />
              • Towel (optional)
              <br />• Open mind and positive energy ✨
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading style={h2}>Important Notes</Heading>
            <Text style={text}>
              • Please arrive 10 minutes early, especially for your first class
              <br />
              • Classes start on time, latecomers may not be admitted
              <br />
              • If you need to cancel, please let us know at least 24 hours in
              advance
              <br />• We&apos;ll send you a reminder 24 hours before your class
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Reply to this email or contact us anytime.
            <br />
            <br />
            See you on the mat! 🙏
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const infoSection = {
  padding: "0 40px",
  marginBottom: "20px",
};

const label = {
  color: "#666",
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "4px",
  marginTop: "20px",
};

const value = {
  color: "#333",
  fontSize: "16px",
  marginTop: "4px",
  marginBottom: "4px",
};

const description = {
  color: "#666",
  fontSize: "14px",
  fontStyle: "italic",
  marginTop: "4px",
  marginBottom: "8px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  textAlign: "center" as const,
};
