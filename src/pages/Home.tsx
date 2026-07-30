import { HeroSection } from '../components/home/HeroSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { PhilosophySection } from '../components/home/PhilosophySection';
import { BrandsSection } from '../components/home/BrandsSection';
import { BuildYourBoxBanner } from '../components/home/BuildYourBoxBanner';
import { StoreLocatorTeaser } from '../components/home/StoreLocatorTeaser';
import { Footer } from '../components/layout/Footer';
import { SEO, SITE_URL } from '../components/seo/SEO';
import { STORE_INFO } from '../utils/constants';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'EMRICKSCENTS',
  description:
    "Luxury fragrance boutique in Lagos, Nigeria, offering authentic designer and niche perfumes, diffusers, scented candles, and body sprays from the world's most iconic perfume houses.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: STORE_INFO.address,
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: STORE_INFO.coords.lat,
    longitude: STORE_INFO.coords.lng,
  },
  priceRange: '₦₦₦',
  sameAs: [] as string[],
};

export default function Home() {
  return (
    <>
      <SEO
        title="Luxury Perfumes & Designer Fragrances in Lagos"
        description="Shop authentic luxury perfumes in Lagos — Chanel, Dior, Tom Ford, YSL, Amouage & more. Designer and niche fragrances, diffusers, and candles with WhatsApp checkout and Nigeria-wide delivery."
        path="/"
        type="website"
        jsonLd={organizationJsonLd}
      />
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
