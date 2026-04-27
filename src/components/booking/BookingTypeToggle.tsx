"use client";

import { useTranslations } from 'next-intl';
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";

interface BookingTypeToggleProps {
  value: "fixed" | "custom";
  onChange: (value: "fixed" | "custom") => void;
}

export function BookingTypeToggle({ value, onChange }: BookingTypeToggleProps) {
  const t = useTranslations('booking.type');

  return (
    <div className="space-y-3">
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as "fixed" | "custom")}
        className="flex flex-col gap-3"
      >
        <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <input
            type="radio"
            value="fixed"
            checked={value === "fixed"}
            onChange={() => onChange("fixed")}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary"
          />
          <div className="flex-1">
            <div className="font-medium text-foreground">{t('fixed')}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t('fixedDescription')}
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <input
            type="radio"
            value="custom"
            checked={value === "custom"}
            onChange={() => onChange("custom")}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary"
          />
          <div className="flex-1">
            <div className="font-medium text-foreground">{t('custom')}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t('customDescription')}
            </div>
          </div>
        </label>
      </RadioGroup>
    </div>
  );
}
