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
import { Booking } from "@/types/booking";

interface CustomRequestReceivedProps {
  booking: Booking;
}

export default function CustomRequestReceived({
  booking,
}: CustomRequestReceivedProps) {
  const formattedDate = new Date(booking.requested_date!).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Html>
      <Head />
      <Preview>We've received your custom time request</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🙏 Request Received!</Heading>

          <Text style={text}>Hi {booking.name},</Text>

          <Text style={text}>
            Thank you for your interest in booking a yoga session with us. We've
            received your custom time request and will review it shortly.
          </Text>

          <Section style={infoSection}>
            <Heading style={h2}>Your Request Details</Heading>

            <Text style={label}>Requested Date:</Text>
            <Text style={value}>{formattedDate}</Text>

            <Text style={label}>Requested Time:</Text>
            <Text style={value}>{booking.requested_time}</Text>

            {booking.notes && (
              <>
                <Text style={label}>Your Notes:</Text>
                <Text style={value}>{booking.notes}</Text>
              </>
            )}

            <Text style={label}>Request ID:</Text>
            <Text style={value}>#{booking.id}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading style={h2}>What Happens Next?</Heading>
            <Text style={text}>
              1. We'll review your requested time slot
              <br />
              2. Check instructor availability
              <br />
              3. Get back to you within 24 hours
              <br />
              4. If approved, you'll receive a confirmation with class details
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading style={h2}>In the Meantime</Heading>
            <Text style={text}>
              Feel free to browse our available scheduled classes. You can book
              instantly without waiting for approval!
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Reply to this email or contact us anytime.
            <br />
            <br />
            We'll be in touch soon! ✨
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
