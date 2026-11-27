/**
 * GAM EDU — Step 4F Geometry Construction Engine Barrel
 * Re-exports all 4 pure mathematical modules for `labKind: 'geometry-constructor'`.
 */

export * from './geometry-primitives';
export * from './geometry-compass';
export * from './geometry-transforms-coord';
export * from './geometry-circle-theorems';
export * from './geometry-step5e';

export type GeometryConstructorMode =
  | 'compass-straightedge'
  | 'transformations'
  | 'coordinate-geometry'
  | 'circle-theorems'
  | 'cube-nets'
  | 'loci-regions';
