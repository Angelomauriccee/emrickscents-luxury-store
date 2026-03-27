import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ImageGallery } from '../components/product/ImageGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { FragranceNotes } from '../components/product/FragranceNotes';
import { StickyCartBar } from '../components/product/StickyCartBar';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Footer } from '../components/layout/Footer';
import { getProductBySlug } from '../firebase/products';
import { Product } from '../types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then((p) => {
        if (!p) { navigate('/404', { replace: true }); return; }
        setProduct(p);
        setLoading(false);
        document.title = `${p.name} — EMRICKSCENTS`;
      })
      .catch(() => { navigate('/404', { replace: true }); });
  }, [slug, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!product) return null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-content pdp-breadcrumb" style={{ padding: '24px 80px' }}>
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Collections', path: '/shop' },
            { label: product.name },
          ]}
        />
      </div>

      {/* PDP layout */}
      <div className="container-content pdp-main" style={{ padding: '0 80px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '64px' }} className="pdp-layout">
          {/* Left — Gallery */}
          <div>
            <ImageGallery
              images={product.images?.length > 0 ? product.images : [product.image]}
              alt={product.name}
            />
          </div>

          {/* Right — Info */}
          <div style={{ paddingTop: '8px' }}>
            <ProductInfo product={product} />
            <div style={{ marginTop: '32px' }}>
              <FragranceNotes
                details={product.details}
                description={product.description}
                ingredients={product.ingredients}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky cart bar */}
      <StickyCartBar product={product} />

      {/* Related products */}
      <RelatedProducts
        currentSlug={product.id}
        brand={product.brand ?? ''}
        collection={product.collection}
      />

      <Footer variant="full" />

      <style>{`
        @media (max-width: 1023px) {
          .pdp-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 767px) {
          .pdp-breadcrumb { padding: 16px 24px !important; }
          .pdp-main { padding: 0 24px 60px !important; }
          .pdp-thumbnails { flex-wrap: nowrap !important; overflow-x: auto !important; padding-bottom: 4px !important; -webkit-overflow-scrolling: touch !important; }
          .pdp-thumbnails button { width: 60px !important; height: 72px !important; flex-shrink: 0 !important; }
        }
      `}</style>
    </>
  );
}
