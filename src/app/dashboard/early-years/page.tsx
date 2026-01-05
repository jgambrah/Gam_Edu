'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const EarlyYearsLayout = dynamic(() => import('./components/Layout'), { ssr: false });
const LiteracyZone = dynamic(() => import('./components/LiteracyZone'), { ssr: false });
const NumeracyZone = dynamic(() => import('./components/NumeracyZone'), { ssr: false });
const ScienceExploration = dynamic(() => import('./components/ScienceExploration'), { ssr: false });
const ArtsHub = dynamic(() => import('./components/ArtsHub'), { ssr: false });
const LiveTutor = dynamic(() => import('./components/TutorSession'), { ssr: false });
import { MODULES } from './constants';
import type { ModuleType } from './types';


const ModuleCard: React.FC<{
  type: ModuleType;
  title: string;
  icon: string;
  color: string;
  description: string;
  onClick: () => void;
}> = ({ title, icon, color, description, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-8 rounded-[40px] shadow-xl border-b-[12px] transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between min-h-[300px] ${color}`}
  >
    <div>
      <div className="w-20 h-20 bg-white/50 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-md">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-3xl font-black text-black/70 mb-2 leading-tight">{title}</h3>
    </div>
    <p className="font-bold text-black/50">{description}</p>
  </button>
);


export default function EarlyYearsMainPage() {
  const [activeModule, setActiveModule] = React.useState<ModuleType | null>(null);

  const renderModule = () => {
    switch (activeModule) {
      case 'LITERACY': return <LiteracyZone />;
      case 'NUMERACY': return <NumeracyZone />;
      case 'SCIENCE': return <ScienceExploration />;
      case 'ARTS': return <ArtsHub />;
      case 'TUTOR': return <LiveTutor />;
      default: return null;
    }
  };

  return (
    <EarlyYearsLayout onHome={() => setActiveModule(null)} showHome={!!activeModule}>
        {activeModule ? renderModule() : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-8">
                {MODULES.map(mod => (
                    <ModuleCard 
                        key={mod.type}
                        {...mod}
                        onClick={() => setActiveModule(mod.type)}
                    />
                ))}
            </div>
        )}
    </EarlyYearsLayout>
  );
}