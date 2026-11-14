'use client';
import { useEffect, useState } from 'react';

/**
 * Story illustration frame. Renders the story's 3D/illustrated scene image when available,
 * or a styled gradient motif card with accessible alt text.
 */
export function PlaceholderArt({
  motif,
  palette,
  alt,
  compact = false,
  imageSrc,
  onZoom,
}: {
  motif: string;
  palette: [string, string];
  alt: string;
  brief?: string;
  compact?: boolean;
  imageSrc?: string;
  imageLabel?: string;
  onZoom?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [imageSrc]);
  const showImage = Boolean(imageSrc) && !failed;
  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-2xl shadow-inner ${onZoom && showImage ? 'group cursor-pointer' : ''}`}
      style={{
        aspectRatio: '4 / 3',
        width: compact ? '100%' : 'min(100%, calc(44vh * 4 / 3))',
        background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
      }}
      onClick={onZoom && showImage ? onZoom : undefined}
      title={onZoom && showImage ? 'Click to zoom and explore illustration with narrative' : undefined}
    >
      {showImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={alt}
            loading={compact ? 'lazy' : undefined}
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {onZoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onZoom();
              }}
              aria-label="Zoom illustration"
              className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-slate-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <span>🔍</span>
              <span>Zoom</span>
            </button>
          )}
        </>
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center select-none">
          <span style={{ fontSize: compact ? '2.5rem' : 'clamp(4rem, 18vw, 9rem)', lineHeight: 1, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.2))' }}>{motif}</span>
        </div>
      )}
    </div>
  );
}
