'use client';

import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { PointerCue } from '@/lib/narrated-lessons/types';

interface TeacherPointerOverlayProps {
  cue: PointerCue | null;
  editable?: boolean;
  onUpdateRegion?: (cueId: string, region: { x: number; y: number; w: number; h: number }) => void;
}

/**
 * Pure HTML/CSS overlay positioned over the 16:9 slide stage.
 * - Never baked into SVGs or AI images
 * - High-contrast double-stroke outline (works on light & dark areas, never colour-only)
 * - Minimum 4px ring thickness even on a 360px phone
 * - Respects prefers-reduced-motion (motion-reduce:animate-none)
 * - Pulse/bounce strictly slower than 1 Hz (1.4s cycle)
 */
export function TeacherPointerOverlay({
  cue,
  editable = false,
  onUpdateRegion,
}: TeacherPointerOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragMode, setDragMode] = useState<'move' | 'resize' | null>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  if (!cue || cue.target.type !== 'region') {
    return (
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {cue?.label ? `Teacher pointing to ${cue.label}` : ''}
      </div>
    );
  }

  const { x, y, w, h } = cue.target;

  const startDrag = (e: React.PointerEvent, mode: 'move' | 'resize') => {
    if (!editable || !onUpdateRegion) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragMode(mode);
    dragStartRef.current = { clientX: e.clientX, clientY: e.clientY, x, y, w, h };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragMode || !dragStartRef.current || !containerRef.current || !onUpdateRegion) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dxPct = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;

    if (dragMode === 'move') {
      const nx = Math.max(0, Math.min(100 - dragStartRef.current.w, dragStartRef.current.x + dxPct));
      const ny = Math.max(0, Math.min(100 - dragStartRef.current.h, dragStartRef.current.y + dyPct));
      onUpdateRegion(cue.id, {
        x: Math.round(nx * 10) / 10,
        y: Math.round(ny * 10) / 10,
        w: dragStartRef.current.w,
        h: dragStartRef.current.h,
      });
    } else {
      const nw = Math.max(6, Math.min(100 - dragStartRef.current.x, dragStartRef.current.w + dxPct));
      const nh = Math.max(6, Math.min(100 - dragStartRef.current.y, dragStartRef.current.h + dyPct));
      onUpdateRegion(cue.id, {
        x: dragStartRef.current.x,
        y: dragStartRef.current.y,
        w: Math.round(nw * 10) / 10,
        h: Math.round(nh * 10) / 10,
      });
    }
  };

  const endDrag = () => {
    setDragMode(null);
    dragStartRef.current = null;
  };

  // Place arrow outside the target so it never covers the item being pointed at
  const arrowAbove = y >= 14;
  const arrowLeftSide = !arrowAbove && x >= 14;

  return (
    <div
      ref={containerRef}
      data-testid="teacher-pointer-overlay"
      data-cue-id={cue.id}
      data-cue-style={cue.style}
      className={`absolute inset-0 overflow-hidden ${editable ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Screen-reader polite announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {cue.label ? `Teacher pointing to ${cue.label}` : ''}
      </div>

      {/* Inline slow-pulse keyframes (1.4s = 0.71 Hz, strictly <= 1 Hz; disabled under prefers-reduced-motion) */}
      <style>{`
        @keyframes gameduPointerPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.025); opacity: 0.88; }
        }
        @keyframes gameduPointerBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .gamedu-pointer-pulse {
          animation: gameduPointerPulse 1.4s ease-in-out infinite;
        }
        .gamedu-pointer-bob {
          animation: gameduPointerBob 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .gamedu-pointer-pulse,
          .gamedu-pointer-bob {
            animation: none !important;
          }
        }
      `}</style>

      {/* SPOTLIGHT STYLE: dims everything outside the cutout */}
      {cue.style === 'spotlight' && (
        <div
          onPointerDown={(e) => startDrag(e, 'move')}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.56)',
          }}
          className={`gamedu-pointer-pulse absolute rounded-2xl border-[4px] border-amber-400 outline outline-[3px] outline-white ${
            editable ? 'cursor-move' : ''
          }`}
        >
          {editable && (
            <div
              onPointerDown={(e) => startDrag(e, 'resize')}
              className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-slate-900 bg-amber-400 shadow"
              title="Drag to resize region"
            />
          )}
        </div>
      )}

      {/* RING STYLE: high-contrast double-stroke rounded box */}
      {cue.style === 'ring' && (
        <div
          onPointerDown={(e) => startDrag(e, 'move')}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
          }}
          className={`gamedu-pointer-pulse absolute rounded-2xl border-[4px] border-amber-400 shadow-[0_0_0_3px_#0f172a,inset_0_0_0_2px_#ffffff] ${
            editable ? 'cursor-move' : ''
          }`}
        >
          {editable && (
            <div
              onPointerDown={(e) => startDrag(e, 'resize')}
              className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-slate-900 bg-amber-400 shadow"
              title="Drag to resize region"
            />
          )}
        </div>
      )}

      {/* ARROW STYLE: static crisp outline + bouncing pointer positioned outside the target */}
      {cue.style === 'arrow' && (
        <div
          onPointerDown={(e) => startDrag(e, 'move')}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
          }}
          className={`absolute rounded-2xl border-[4px] border-dashed border-amber-400 shadow-[0_0_0_3px_#0f172a] ${
            editable ? 'cursor-move' : ''
          }`}
        >
          <div
            className={`gamedu-pointer-bob absolute flex items-center justify-center rounded-full border-[3px] border-slate-950 bg-amber-400 p-1.5 text-slate-950 shadow-lg ${
              arrowAbove
                ? '-top-11 left-1/2 -translate-x-1/2'
                : arrowLeftSide
                  ? 'top-1/2 -left-11 -translate-y-1/2'
                  : '-bottom-11 left-1/2 -translate-x-1/2'
            }`}
          >
            {arrowLeftSide ? (
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            ) : (
              <ArrowDown className={`h-4 w-4 stroke-[3] ${!arrowAbove ? 'rotate-180' : ''}`} />
            )}
          </div>
          {editable && (
            <div
              onPointerDown={(e) => startDrag(e, 'resize')}
              className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-slate-900 bg-amber-400 shadow"
              title="Drag to resize region"
            />
          )}
        </div>
      )}
    </div>
  );
}
