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
  }
}
