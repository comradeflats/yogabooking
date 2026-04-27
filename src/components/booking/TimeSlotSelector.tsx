"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ru, enUS } from 'date-fns/locale';
import type { TimeSlot } from "@/types/booking";

interface TimeSlotSelectorProps {
  value: number | null;
  onChange: (timeSlotId: number) => void;
  error?: string;
}

export function TimeSlotSelector({ value, onChange, error }: TimeSlotSelectorProps) {
  const t = useTranslations('booking.timeSlot');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const dateLocale = locale === 'ru' ? ru : enUS;
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available time slots
    fetch("/api/time-slots")
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch time slots:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">{tCommon('loading')}</div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="space-y-3">
        <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            {t('noSlots')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-4">
        {slots.map((slot) => {
          const slotDate = parseISO(slot.date);
          const isSelected = value === slot.id;
          const availableSpots = slot.max_bookings - slot.current_bookings;

          return (
            <label
              key={slot.id}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                isSelected ? "border-primary bg-primary/5" : "border-border"
              } border-l-4`}
              style={{
                borderLeftColor: slot.class_type?.color || "#71717a"
              }}
            >
              <input
                type="radio"
                name="time_slot"
                value={slot.id}
                checked={isSelected}
                onChange={() => onChange(slot.id)}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-medium text-foreground">
                    {format(slotDate, "EEEE, MMMM d, yyyy", { locale: dateLocale })}
                  </div>
                  <Badge variant="secondary">
                    {availableSpots > 0 ? t('spotsAvailable', { count: availableSpots }) : t('fullyBooked')}
                  </Badge>
                </div>

                {slot.class_type && (
                  <div className="flex items-center gap-2">
                    <Badge
                      className="text-white font-medium"
                      style={{
                        backgroundColor: slot.class_type.color,
                        borderColor: slot.class_type.color,
                      }}
                    >
                      {slot.class_type.name}
                    </Badge>
                    {slot.class_type.description && (
                      <span className="text-xs text-muted-foreground">
                        {slot.class_type.description}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>⏰ {slot.start_time}</span>
                  <span>⏱️ {slot.duration_minutes} {tCommon('minutes')}</span>
                  {slot.instructor_name && (
                    <span>👤 {slot.instructor_name}</span>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
