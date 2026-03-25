import { HeroSection } from '../components/home/HeroSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { PhilosophySection } from '../components/home/PhilosophySection';
import { BrandsSection } from '../components/home/BrandsSection';
import { BuildYourBoxBanner } from '../components/home/BuildYourBoxBanner';
import { StoreLocatorTeaser } from '../components/home/StoreLocatorTeaser';
import { Footer } from '../components/layout/Footer';

export default function Home() {
  return (
    <>
      <HeroSection />
      <NewArrivalsSection />
      <PhilosophySection />
      <BrandsSection />
      <BuildYourBoxBanner />
      <StoreLocatorTeaser />
      <Footer variant="full" />
    </>
  );
}
