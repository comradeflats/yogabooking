import { HeroSection } from "@/components/landing/HeroSection";
import { ClassTypesSection } from "@/components/landing/ClassTypesSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ClassTypesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
