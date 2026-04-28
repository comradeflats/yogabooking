import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from 'next-intl/server';

export async function TestimonialsSection() {
  const t = await getTranslations('landing.testimonials');

  const testimonials = [
    {
      quote: t('quote1'),
      author: t('author1'),
    },
    {
      quote: t('quote2'),
      author: t('author2'),
    },
    {
      quote: t('quote3'),
      author: t('author3'),
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display mb-4">
            {t('title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic text-lg">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="font-semibold">— {testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
