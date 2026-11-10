import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProgress,
  saveProgress,
  loadFavourites,
  toggleFavourite,
  setActiveProgressUser,
  mergeAndSaveCloudShelf,
  exportCloudShelf,
} from './progress-store';

describe('progress-store (cross-device sync & migration)', () => {
  beforeEach(() => {
    localStorage.clear();
    setActiveProgressUser(null);
  });

  it('migrates legacy un-scoped progress and favourites into the first signed-in user scope', () => {
    saveProgress('ama-lost-little-goat', { step: 2, total: 8, done: false, updatedAt: 100 });
    saveProgress('efuas-honest-business', { step: 11, total: 12, done: true, updatedAt: 200 });
    toggleFavourite('ama-lost-little-goat');

    setActiveProgressUser('user-gh-1');
    expect(loadProgress('ama-lost-little-goat')?.step).toBe(2);
    expect(loadProgress('efuas-honest-business')?.done).toBe(true);
    expect(loadFavourites().has('ama-lost-little-goat')).toBe(true);

    // A second user on the same device gets a clean personal shelf
    setActiveProgressUser('user-gh-2');
    expect(loadProgress('ama-lost-little-goat')).toBeUndefined();
    expect(loadFavourites().size).toBe(0);
  });

  it('never downgrades a completed story back to undone when re-opened', () => {
    setActiveProgressUser('user-1');
    saveProgress('kofis-colourful-garden', { step: 7, total: 8, done: true, updatedAt: 100 });
    saveProgress('kofis-colourful-garden', { step: 0, total: 8, done: false, updatedAt: 200 });
    const p = loadProgress('kofis-colourful-garden');
    expect(p?.done).toBe(true);
    expect(p?.step).toBe(0);
  });

  it('merges local and remote cloud shelves deterministically across office and home computers', () => {
    // Laptop has 1 in-progress, 1 finished, 1 favourite
    setActiveProgressUser('director-1');
    saveProgress('story-a', { step: 3, total: 8, done: false, updatedAt: 500 });
    saveProgress('story-b', { step: 7, total: 8, done: true, updatedAt: 600 });
    toggleFavourite('story-b');
    const cloudFromLaptop = exportCloudShelf('director-1');

    // Simulate brand-new office computer with empty localStorage pulling cloudFromLaptop
    localStorage.clear();
    setActiveProgressUser('director-1');
    const { merged, needsUpload } = mergeAndSaveCloudShelf(cloudFromLaptop, 'director-1');
    expect(needsUpload).toBe(false);
    expect(merged.favourites).toEqual(['story-b']);
    expect(loadProgress('story-a')?.step).toBe(3);
    expect(loadProgress('story-b')?.done).toBe(true);
    expect(loadFavourites().has('story-b')).toBe(true);
  });
});
