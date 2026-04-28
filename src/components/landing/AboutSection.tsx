import Image from "next/image";
import { getTranslations } from 'next-intl/server';

export async function AboutSection() {
  const t = await getTranslations('landing.about');

  return (
    <section id="about" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2802&auto=format&fit=crop"
              alt="Polina teaching yoga"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-display mb-6">
              {t('title')}
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                {t('paragraph1')}
              </p>
              <p>
                {t('paragraph2')}
              </p>
              <p>
                {t('paragraph3')}
              </p>
            </div>

            <div className="mt-8 space-y-2">
              <h3 className="font-semibold text-lg">{t('certificationsTitle')}</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {t('cert1')}</li>
                <li>• {t('cert2')}</li>
                <li>• {t('cert3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
