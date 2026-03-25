import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { ShippingModalProvider } from './context/ShippingModalContext';
import { Navbar } from './components/layout/Navbar';
import { PageWrapper } from './components/layout/PageWrapper';
import { SearchOverlay } from './components/ui/SearchOverlay';
import { CartNotification } from './components/ui/CartNotification';
import { ShippingModal } from './components/ui/ShippingModal';
import { CookieConsent } from './components/ui/CookieConsent';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import BuildYourBox from './pages/BuildYourBox';
import About from './pages/About';
import Contact from './pages/Contact';
import StoreLocator from './pages/StoreLocator';
import NotFound from './pages/NotFound';

import { testConnection } from './firebase/products';

function AppContent() {
  useEffect(() => { testConnection(); }, []);
  return (
    <>
      <Navbar />
      <SearchOverlay />
      <CartNotification />
      <ShippingModal />
      <CookieConsent />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/build-your-box" element={<BuildYourBox />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageWrapper>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SearchProvider>
          <ShippingModalProvider>
            <AppContent />
          </ShippingModalProvider>
        </SearchProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
