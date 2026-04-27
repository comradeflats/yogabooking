"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema } from "@/lib/validations/booking";
import type { BookingType } from "@/types/booking";
import { BookingTypeToggle } from "@/components/booking/BookingTypeToggle";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelector";
import { ContactForm } from "@/components/booking/ContactForm";
import { CustomTimeRequest } from "@/components/booking/CustomTimeRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function BookPage() {
  const t = useTranslations('booking');
  const router = useRouter();
  const [bookingType, setBookingType] = useState<BookingType>("fixed");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      booking_type: "fixed" as BookingType,
      name: "",
      email: "",
      phone: "",
      instagram_handle: "",
      telegram_handle: "",
      notes: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create booking");
      }

      const booking = await response.json();
      toast.success(t('submit.success'));
      router.push(`/book/success?id=${booking.id}`);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error instanceof Error ? error.message : t('submit.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingType(type);
    form.setValue("booking_type", type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Booking Type Toggle */}
          <Card>
            <CardHeader>
              <CardTitle>{t('type.title')}</CardTitle>
              <CardDescription>
                {t('type.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingTypeToggle
                value={bookingType}
                onChange={handleBookingTypeChange}
              />
            </CardContent>
          </Card>

          {/* Time Selection */}
          {bookingType === "fixed" ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('timeSlot.title')}</CardTitle>
                <CardDescription>
                  {t('timeSlot.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSlotSelector
                  value={(form.watch("time_slot_id") as number | undefined) ?? null}
                  onChange={(id) => form.setValue("time_slot_id", id as any)}
                  error={(form.formState.errors as any).time_slot_id?.message}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('customTime.title')}</CardTitle>
                <CardDescription>
                  {t('customTime.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomTimeRequest
                  values={{
                    requested_date: form.watch("requested_date") as string | undefined,
                    requested_time: form.watch("requested_time") as string | undefined,
                  }}
                  errors={{
                    requested_date: (form.formState.errors as any).requested_date?.message,
                    requested_time: (form.formState.errors as any).requested_time?.message,
                  }}
                  onChange={(field, value) => form.setValue(field as any, value)}
                />
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contact.title')}</CardTitle>
              <CardDescription>
                {t('contact.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                values={{
                  name: form.watch("name"),
                  email: form.watch("email"),
                  phone: form.watch("phone"),
                  instagram_handle: form.watch("instagram_handle"),
                  telegram_handle: form.watch("telegram_handle"),
                  notes: form.watch("notes"),
                }}
                errors={{
                  name: form.formState.errors.name?.message,
                  email: form.formState.errors.email?.message,
                  phone: (form.formState.errors as any).phone?.message,
                  instagram_handle: (form.formState.errors as any).instagram_handle?.message,
                  telegram_handle: (form.formState.errors as any).telegram_handle?.message,
                  notes: (form.formState.errors as any).notes?.message,
                }}
                onChange={(field, value) => form.setValue(field as any, value)}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              {t('../common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('submit.submitting') : t('submit.confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
