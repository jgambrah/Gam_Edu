'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ConstructionLabInteractiveConfig } from '@/lib/narrated-lessons/interactive-schema';

const DomainLoading = () => (
  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
    Loading construction laboratory module...
  </div>
);

// Independently lazy-loaded bounded domain modules (opening one domain never downloads the others)
const LazyLegacyBooleanCircuitLab = dynamic(
  () => import('../BooleanCircuitLab').then((m) => m.BooleanCircuitLab),
  { ssr: false, loading: DomainLoading },
);

const LazyDeclarativeBooleanCircuitAdapter = dynamic(
  () => import('./DeclarativeBooleanCircuitAdapter').then((m) => m.DeclarativeBooleanCircuitAdapter),
  { ssr: false, loading: DomainLoading },
);

const LazyEquationBalancerLab = dynamic(
  () => import('./EquationBalancerLab').then((m) => m.EquationBalancerLab),
  { ssr: false, loading: DomainLoading },
);

const LazyElectricalCircuitLab = dynamic(
  () => import('./ElectricalCircuitLab').then((m) => m.ElectricalCircuitLab),
  { ssr: false, loading: DomainLoading },
);

const LazyBioSequenceLab = dynamic(
  () => import('./BioSequenceLab').then((m) => m.BioSequenceLab),
  { ssr: false, loading: DomainLoading },
);

const LazyAtomBondLab = dynamic(
  () => import('./AtomBondLab').then((m) => m.AtomBondLab),
  { ssr: false, loading: DomainLoading },
);

const LazyGeometryConstructorLab = dynamic(
  () => import('./GeometryConstructorLab').then((m) => m.GeometryConstructorLab),
  { ssr: false, loading: DomainLoading },
);

const LazyMeasurementLab = dynamic(
  () => import('./MeasurementLab').then((m) => m.MeasurementLab),
  { ssr: false, loading: DomainLoading },
);

const LazyDataStatsLab = dynamic(
  () => import('./DataStatsLab').then((m) => m.DataStatsLab),
  { ssr: false, loading: DomainLoading },
);

const LazyNumberManipulativeLab = dynamic(
  () => import('./NumberManipulativeLab').then((m) => m.NumberManipulativeLab),
  { ssr: false, loading: DomainLoading },
);

export interface ConstructionLabRouterProps {
  config: ConstructionLabInteractiveConfig;
  lessonId: string;
  slideId?: string;
}

export function ConstructionLabRouter({ config, lessonId, slideId }: ConstructionLabRouterProps) {
  switch (config.labKind) {
    case 'boolean-circuit':
      if (config.circuitConfig) {
        return <LazyDeclarativeBooleanCircuitAdapter config={config} />;
      }
      return <LazyLegacyBooleanCircuitLab lessonId={lessonId} slideId={slideId} />;
    case 'equation-balancer':
      return <LazyEquationBalancerLab config={config} />;
    case 'electrical-circuit':
      return <LazyElectricalCircuitLab config={config} />;
    case 'bio-sequence-builder':
      return <LazyBioSequenceLab config={config} />;
    case 'atom-bond-builder':
      return <LazyAtomBondLab config={config} />;
    case 'geometry-constructor':
      return <LazyGeometryConstructorLab config={config} />;
    case 'measurement-lab':
      return <LazyMeasurementLab config={config} />;
    case 'data-stats-lab':
      return <LazyDataStatsLab config={config} />;
    case 'number-manipulative':
      return <LazyNumberManipulativeLab config={config} />;
  }
}
