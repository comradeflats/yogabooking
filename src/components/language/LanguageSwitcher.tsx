'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string | null) => {
    if (newLocale) {
      router.replace(pathname, { locale: newLocale as Locale });
    }
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[120px] border-border">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{localeNames.en}</SelectItem>
        <SelectItem value="ru">{localeNames.ru}</SelectItem>
      </SelectContent>
    </Select>
  );
}
