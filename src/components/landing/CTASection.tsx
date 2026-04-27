import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-display mb-6">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
          Book your first session today and discover what your practice can become
        </p>
        <Link href="/book">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
          >
            Book Your First Session
          </Button>
        </Link>
      </div>
    </section>
  );
}
