"use client";

import { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ru, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react";

interface CustomTimeRequestProps {
  values: {
    requested_date?: string;
    requested_time?: string;
  };
  errors: {
    requested_date?: string;
    requested_time?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function CustomTimeRequest({ values, errors, onChange }: CustomTimeRequestProps) {
  const t = useTranslations('booking.customTime');
  const locale = useLocale();
  const dateLocale = locale === 'ru' ? ru : enUS;
  const [showCalendar, setShowCalendar] = useState(false);
  const selectedDate = values.requested_date ? new Date(values.requested_date) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange("requested_date", format(date, "yyyy-MM-dd"));
      setShowCalendar(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="requested_date">
          {t('date')} <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm border-2 rounded-lg hover:border-primary/50 transition-colors ${
              errors.requested_date ? "border-destructive" : "border-border"
            }`}
          >
            <span className={selectedDate ? "text-foreground" : "text-muted-foreground"}>
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy", { locale: dateLocale }) : t('datePlaceholder')}
            </span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </button>
          {showCalendar && (
            <div className="absolute z-10 mt-2 p-3 bg-card border-2 border-border rounded-lg shadow-lg">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </div>
          )}
        </div>
        {errors.requested_date && (
          <p className="text-sm text-destructive mt-1">{errors.requested_date}</p>
        )}
      </div>

      <div>
        <Label htmlFor="requested_time">
          {t('time')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="requested_time"
          type="time"
          value={values.requested_time || ""}
          onChange={(e) => onChange("requested_time", e.target.value)}
          placeholder={t('timePlaceholder')}
          className={errors.requested_time ? "border-destructive" : ""}
        />
        {errors.requested_time && (
          <p className="text-sm text-destructive mt-1">{errors.requested_time}</p>
        )}
      </div>
    </div>
  );
}
