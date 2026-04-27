import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Polina's classes have completely transformed my practice. Her personalized approach helps me feel seen and supported.",
    author: "Sarah M.",
  },
  {
    quote: "I've tried many instructors, but Polina's attention to alignment and breathwork is unmatched.",
    author: "James K.",
  },
  {
    quote: "As a beginner, I was nervous, but Polina created such a welcoming space. I'm hooked!",
    author: "Maria L.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display mb-4">
            What Students Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic text-lg">
                  "{testimonial.quote}"
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
