'use client';

/**
 * Story illustration frame. Renders the story's 3D/illustrated scene image when available,
 * or a styled gradient motif card with accessible alt text.
 */
export function PlaceholderArt({ motif, palette, alt, compact = false, imageSrc }: { motif: string; palette: [string, string]; alt: string; brief?: string; compact?: boolean; imageSrc?: string; imageLabel?: string }) {
  return (
    <div className="relative mx-auto overflow-hidden rounded-2xl shadow-inner" style={{ aspectRatio: '4 / 3', width: compact ? '100%' : 'min(100%, calc(44vh * 4 / 3))', background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)` }}>
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center select-none">
          <span style={{ fontSize: compact ? '2.5rem' : 'clamp(4rem, 18vw, 9rem)', lineHeight: 1, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.2))' }}>{motif}</span>
        </div>
      )}
    </div>
  );
}
