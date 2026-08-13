import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ShippingModalProvider } from "./context/ShippingModalContext";
import { Navbar } from "./components/layout/Navbar";
import { PageWrapper } from "./components/layout/PageWrapper";
import { SearchOverlay } from "./components/ui/SearchOverlay";
import { CartNotification } from "./components/ui/CartNotification";
import { ShippingModal } from "./components/ui/ShippingModal";
import { CookieConsent } from "./components/ui/CookieConsent";
import { ChatWidget } from "./components/ui/ChatWidget";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
// Home stays eager — it's the most common landing page, no reason to add a chunk-fetch delay to it.
// Everything else (including the mapbox-gl/react-map-gl-heavy Contact/StoreLocator pages) is
// route-split so visiting Home/Shop doesn't pull in code those routes never touch.
import Home from "./pages/Home";
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const BuildYourBox = lazy(() => import("./pages/BuildYourBox"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const StoreLocator = lazy(() => import("./pages/StoreLocator"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));

function AppContent() {
  return (
    <>
      <Navbar />
      <SearchOverlay />
      <CartNotification />
      <ShippingModal />
      <CookieConsent />
      <ChatWidget />
      <PageWrapper>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/build-your-box" element={<BuildYourBox />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/store-locator" element={<StoreLocator />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
