'use client';
import { useId, useState } from 'react';

export type ShelfGroup = 'browse' | 'mine' | 'topics' | 'review';
export interface ToolbarShelf { id: string; label: string; group: ShelfGroup }
export interface ToolbarChip { key: string; text: string; onRemove: () => void }

const GROUP_TITLES: Record<ShelfGroup, string> = { browse: 'Browse', mine: 'My shelf', topics: 'Topics', review: 'Developer' };
const GROUP_ORDER: ShelfGroup[] = ['browse', 'mine', 'topics', 'review'];

const selectCls = 'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 focus:border-indigo-500 focus:outline-none';

/**
 * One compact row in place of the old two rows of pill tabs: Collection and Stage dropdowns, search, and a Filters button
 * that opens the detailed filters (class, age, genre, reading level). Nothing was removed, it is just tucked away until
 * wanted. Selected filters show as small removable chips underneath.
 */
export function LibraryToolbar({
  shelves, shelf, onShelf, shelfSuffix,
  stages, stage, onStage,
  search, onSearch,
  filtersCount, chips, onClearAll, active,
  children,
}: {
  shelves: readonly ToolbarShelf[];
  shelf: string;
  onShelf: (id: string) => void;
  /** Extra text after a shelf's label, for example a count: { 'under-review': ' (3)' }. */
  shelfSuffix?: Readonly<Record<string, string>>;
  stages: readonly { id: string; label: string }[];
  stage: string;
  onStage: (id: string) => void;
  search: string;
  onSearch: (v: string) => void;
  /** How many detailed filters are set (shown on the Filters button). */
  filtersCount: number;
  chips: readonly ToolbarChip[];
  onClearAll: () => void;
  active: boolean;
  /** The detailed filter form, rendered inside the Filters panel. */
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="mb-4" data-testid="library-toolbar">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.5fr)_auto]">
        <label className="block text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
          <span className="mb-0.5 block">Collection</span>
          <select aria-label="Collection" value={shelf} onChange={(e) => onShelf(e.target.value)} className={selectCls}>
            {GROUP_ORDER.map((g) => {
              const items = shelves.filter((s) => s.group === g);
              if (!items.length) return null;
              return (
                <optgroup key={g} label={GROUP_TITLES[g]}>
                  {items.map((s) => (
                    <option key={s.id} value={s.id} data-testid={s.id === 'under-review' ? 'under-review-tab' : undefined}>{s.label}{shelfSuffix?.[s.id] ?? ''}</option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>
        <label className="block text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
          <span className="mb-0.5 block">Stage</span>
          <select aria-label="Stage" value={stage} onChange={(e) => onStage(e.target.value)} className={selectCls}>
            {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label className="block text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
          <span className="mb-0.5 block">Search</span>
          <input
            type="search" aria-label="Search stories" placeholder="🔍 Title, topic or character…" value={search} onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-extrabold transition lg:w-auto ${open || filtersCount ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'}`}
          >
            <span aria-hidden>🎚️</span> Filters
            {filtersCount > 0 && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] text-white" aria-label={`${filtersCount} filters set`}>{filtersCount}</span>}
            <span aria-hidden className="text-xs">{open ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {open && <div id={panelId} className="mt-2" data-testid="filters-panel">{children}</div>}

      {active && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5" data-testid="active-filters" aria-label="Selected filters" role="group">
          {chips.map((c) => (
            <span key={c.key} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pl-3 pr-1 text-xs font-bold text-indigo-900">
              {c.text}
              <button type="button" onClick={c.onRemove} aria-label={`Remove ${c.text}`} className="flex h-5 w-5 items-center justify-center rounded-full text-indigo-700 hover:bg-indigo-200">✕</button>
            </span>
          ))}
          <button type="button" onClick={onClearAll} className="rounded-full px-2 py-0.5 text-xs font-extrabold text-slate-600 underline hover:text-slate-900">Clear all</button>
        </div>
      )}
    </div>
  );
}
