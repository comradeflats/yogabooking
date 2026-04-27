import Image from "next/image";

export function AboutSection() {
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
              Meet Polina
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                Welcome to my practice. My yoga journey began over a decade ago, and since then,
                I've dedicated myself to creating spaces where students feel safe to explore,
                challenge themselves, and grow.
              </p>
              <p>
                I believe that yoga is not one-size-fits-all. Each body is unique, each day brings
                different energy, and every practice should honor where you are in the moment.
                Whether you're seeking flexibility, strength, stress relief, or simply a moment
                of peace, we'll craft a practice that serves you.
              </p>
              <p>
                My teaching style blends traditional yoga philosophy with modern movement science,
                always with a focus on breath, alignment, and mindful awareness.
              </p>
            </div>

            <div className="mt-8 space-y-2">
              <h3 className="font-semibold text-lg">Certifications</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 500-Hour Registered Yoga Teacher (RYT-500)</li>
                <li>• Yin Yoga & Myofascial Release Certification</li>
                <li>• Trauma-Informed Yoga Training</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
