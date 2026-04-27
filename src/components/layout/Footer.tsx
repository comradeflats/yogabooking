import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { AtSign, Send } from "lucide-react";

const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "youryogahandle";
const TELEGRAM_HANDLE = process.env.NEXT_PUBLIC_TELEGRAM_HANDLE || "youryogahandle";

export async function Footer() {
  const t = await getTranslations('layout');
  const landingT = await getTranslations('landing.hero');

  return (
    <footer className="bg-accent text-accent-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg mb-4">{t('header.title')}</h3>
            <p className="text-sm opacity-90">
              {landingT('subtitle')}
            </p>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-3">{t('footer.contact')}</h4>
            <div className="space-y-2 text-sm">
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <AtSign className="h-4 w-4" />
                <span>Instagram</span>
              </a>
              <a
                href={`https://t.me/${TELEGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Telegram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">{t('header.nav.classes')}</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/book"
                className="block hover:text-primary transition-colors"
              >
                {t('header.nav.bookClass')}
              </Link>
              <Link
                href="/#about"
                className="block hover:text-primary transition-colors"
              >
                {t('header.nav.about')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-accent-foreground/20 text-center text-sm">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
