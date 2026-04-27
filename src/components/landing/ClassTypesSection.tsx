import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllClassTypes } from "@/lib/db/queries";

export async function ClassTypesSection() {
  const t = await getTranslations('landing.classes');
  const tCommon = await getTranslations('common');
  const classTypes = await getAllClassTypes();

  return (
    <section id="classes" className="section-padding bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classTypes.map((type) => (
            <Link
              key={type.id}
              href="/book"
              className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all bg-card"
            >
              <div
                className="h-2"
                style={{ backgroundColor: type.color }}
              />
              <div className="p-6">
                <h3 className="text-xl font-display mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {type.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{type.duration_minutes} {tCommon('minutes')}</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
