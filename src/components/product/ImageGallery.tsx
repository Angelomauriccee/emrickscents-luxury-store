import { useState, useRef } from 'react';
import gsap from 'gsap';
import { FiX } from 'react-icons/fi';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const mainImageRef = useRef<HTMLImageElement>(null);

  const handleThumbnailClick = (index: number) => {
    const el = mainImageRef.current;
    if (!el || index === activeIndex) return;
    gsap.to(el, {
      opacity: 0, duration: 0.15, onComplete: () => {
        setActiveIndex(index);
        gsap.to(el, { opacity: 1, duration: 0.35 });
      }
    });
  };

  return (
    <>
      <div>
        {/* Main image */}
        <div
          onClick={() => setIsZoomed(true)}
          style={{
            aspectRatio: '4/5',
            background: 'var(--bg-surface)',
            border: '1px solid var(--gold-border)',
            overflow: 'hidden',
            marginBottom: '16px',
            cursor: 'zoom-in',
          }}
        >
          <img
            ref={mainImageRef}
            src={images[activeIndex] || images[0]}
            alt={alt}
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                style={{
                  width: '80px',
                  height: '96px',
                  background: 'var(--bg-surface)',
                  border: `1px solid ${idx === activeIndex ? 'var(--gold)' : 'var(--bg-border)'}`,
                  overflow: 'hidden',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  flexShrink: 0,
                }}
              >
                <img
                  src={img}
                  alt={`${alt} ${idx + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Overlay */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <button
            onClick={() => setIsZoomed(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <FiX size={32} />
          </button>
          <img
            src={images[activeIndex] || images[0]}
            alt={`${alt} zoomed`}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        </div>
      )}
    </>
  );
}
