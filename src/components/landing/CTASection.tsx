import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { getTranslations } from 'next-intl/server';

export async function CTASection() {
  const t = await getTranslations('landing.cta');

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-display mb-6">
          {t('title')}
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
          {t('subtitle')}
        </p>
        <Link href="/book">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
          >
            {t('button')}
          </Button>
        </Link>
      </div>
    </section>
  );
}
