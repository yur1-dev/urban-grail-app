import { HeroSection } from "@/components/shop/HeroSection";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import { Footer } from "@/components/ui/Footer";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
