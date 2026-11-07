'use client';
import { useState } from 'react';

/**
 * PLACEHOLDER illustration. No image exists for these pages yet, so this draws a coloured scene from the story's palette
 * and an emoji motif, and says so on the picture. The real alt text is kept (role="img"), and the illustration brief
 * can be opened so reviewers see what the final art must show.
 */
export function PlaceholderArt({ motif, palette, alt, brief, compact = false }: { motif: string; palette: [string, string]; alt: string; brief?: string; compact?: boolean }) {
  const [showBrief, setShowBrief] = useState(false);
  return (
    <div className="relative mx-auto overflow-hidden rounded-2xl shadow-inner" style={{ aspectRatio: '4 / 3', width: compact ? '100%' : 'min(100%, calc(44vh * 4 / 3))', background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)` }}>
      <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center select-none">
        <span style={{ fontSize: compact ? '2.5rem' : 'clamp(4rem, 18vw, 9rem)', lineHeight: 1, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.2))' }}>{motif}</span>
      </div>
      <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Placeholder illustration</span>
      {!compact && brief && (
        <>
          <button type="button" onClick={() => setShowBrief((v) => !v)} aria-expanded={showBrief}
            className="absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {showBrief ? 'Hide brief' : 'Illustration brief'}
          </button>
          {showBrief && <div className="absolute inset-x-2 bottom-12 max-h-[60%] overflow-auto rounded-xl bg-white/95 p-3 text-sm text-slate-800 shadow-lg"><strong>Brief for the illustrator:</strong> {brief}</div>}
        </>
      )}
    </div>
  );
}
