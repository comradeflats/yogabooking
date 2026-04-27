"use client";

import { useTranslations } from 'next-intl';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  values: {
    name: string;
    email: string;
    phone?: string;
    instagram_handle?: string;
    telegram_handle?: string;
    notes?: string;
  };
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    instagram_handle?: string;
    telegram_handle?: string;
    notes?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ContactForm({ values, errors, onChange }: ContactFormProps) {
  const t = useTranslations('booking.contact');

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">
          {t('name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder={t('namePlaceholder')}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email">
          {t('email')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder={t('emailPlaceholder')}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone">{t('phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={values.phone || ""}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder={t('phonePlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="instagram">{t('instagram')}</Label>
        <Input
          id="instagram"
          type="text"
          value={values.instagram_handle || ""}
          onChange={(e) => onChange("instagram_handle", e.target.value)}
          placeholder={t('instagramPlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="telegram">{t('telegram')}</Label>
        <Input
          id="telegram"
          type="text"
          value={values.telegram_handle || ""}
          onChange={(e) => onChange("telegram_handle", e.target.value)}
          placeholder={t('telegramPlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          value={values.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder={t('notesPlaceholder')}
          rows={4}
        />
      </div>
    </div>
  );
}
