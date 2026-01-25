'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { generateTTSAction } from '@/ai/flows/junior-actions';

// Import the module components from their new files
import {
    IconRenderer,
    ModuleContainer,
    NumbersMainModule,
    CountingGame,
    NumberSequenceModule,
    NumberComparisonModule,
    NumberWordsModule,
    NumberBondsModule,
    AdditionModule,
    SubtractionModule,
    TensUnitsModule,
} from '@/components/dashboard/junior-academy/math-modules-a';

import {
    GroupingModule,
    TellingTimeModule,
    MoneyCountingModule,
    MeasurementModule,
    ShapesModule,
    SpatialModule,
    ComparisonGame,
    PatternGame,
    OneToOneGame,
    NumberMagicPen
} from '@/components/dashboard/junior-academy/math-modules-b';

type MathTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one' | 'tracing';

const NumeracyZone: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MathTab>('numbers');
    const { schoolId } = useCurrentSchool();
    const currentSourceRef = useRef<HTMLAudioElement | null>(null);

    const playFeedbackSound = useCallback(async (text: string) => {
      if (!text || !schoolId) return;
      if (currentSourceRef.current) try { currentSourceRef.current.pause(); } catch (e) {}
      const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
      if (result.success && result.data) {
          const audio = new Audio(`data:audio/wav;base64,${result.data}`);
          currentSourceRef.current = audio;
          audio.play();
      }
    }, [schoolId]);
  
    const tabs: {id: MathTab, icon: string}[] = [
      { id: 'numbers', icon: 'fa-1' }, { id: 'counting', icon: 'fa-list-ol' }, { id: 'sequence', icon: 'fa-arrow-right-long' },
      { id: 'comparing', icon: 'fa-scale-unbalanced' }, { id: 'number-words', icon: 'fa-font' }, { id: 'bonds', icon: 'fa-handshake' },
      { id: 'addition', icon: 'fa-plus' }, { id: 'subtraction', icon: 'fa-minus' }, { id: 'tens-units', icon: 'fa-layer-group' },
      { id: 'grouping', icon: 'fa-object-group' }, { id: 'time', icon: 'fa-clock' }, { id: 'money', icon: 'fa-coins' },
      { id: 'measurement', icon: 'fa-ruler-vertical' }, { id: 'shapes', icon: 'fa-shapes' }, { id: 'spatial', icon: 'fa-arrows-up-down-left-right' },
      { id: 'comparison', icon: 'fa-scale-balanced' }, { id: 'patterns', icon: 'fa-square-check' }, { id: 'one-to-one', icon: 'fa-arrows-left-right' },
      { id: 'tracing', icon: 'fa-pen-clip' }
    ];
    
    const renderModule = () => {
      if(!schoolId) return <div className="text-center p-8"><LucideIcons.Loader2 className="animate-spin h-10 w-10 mx-auto text-purple-400"/></div>;
      const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
      const modules: Record<MathTab, React.ReactNode> = {
          'numbers': <ModuleContainer title="Number Recognition" icon="fa-1"><NumbersMainModule {...commonProps} /></ModuleContainer>,
          'counting': <ModuleContainer title="Counting Game" icon="fa-list-ol"><CountingGame {...commonProps} /></ModuleContainer>,
          'sequence': <ModuleContainer title="Number Sequence" icon="fa-arrow-right-long"><NumberSequenceModule {...commonProps} /></ModuleContainer>,
          'comparing': <ModuleContainer title="Number Comparison" icon="fa-scale-unbalanced"><NumberComparisonModule {...commonProps} /></ModuleContainer>,
          'number-words': <ModuleContainer title="Number Words" icon="fa-font"><NumberWordsModule {...commonProps} /></ModuleContainer>,
          'bonds': <ModuleContainer title="Number Bonds" icon="fa-handshake"><NumberBondsModule onSound={playFeedbackSound} /></ModuleContainer>,
          'addition': <ModuleContainer title="Addition" icon="fa-plus"><AdditionModule {...commonProps} /></ModuleContainer>,
          'subtraction': <ModuleContainer title="Subtraction" icon="fa-minus"><SubtractionModule {...commonProps} /></ModuleContainer>,
          'tens-units': <ModuleContainer title="Tens and Units" icon="fa-layer-group"><TensUnitsModule {...commonProps} /></ModuleContainer>,
          'grouping': <ModuleContainer title="Grouping" icon="fa-object-group"><GroupingModule {...commonProps} /></ModuleContainer>,
          'time': <ModuleContainer title="Telling Time" icon="fa-clock"><TellingTimeModule onSound={playFeedbackSound} /></ModuleContainer>,
          'money': <ModuleContainer title="Counting Money" icon="fa-coins"><MoneyCountingModule {...commonProps} /></ModuleContainer>,
          'measurement': <ModuleContainer title="Measurement" icon="fa-ruler-vertical"><MeasurementModule {...commonProps} /></ModuleContainer>,
          'shapes': <ModuleContainer title="Shapes" icon="fa-shapes"><ShapesModule {...commonProps} /></ModuleContainer>,
          'spatial': <ModuleContainer title="Spatial Reasoning" icon="fa-arrows-up-down-left-right"><SpatialModule {...commonProps} /></ModuleContainer>,
          'comparison': <ModuleContainer title="Comparison Game" icon="fa-scale-balanced"><ComparisonGame {...commonProps} /></ModuleContainer>,
          'patterns': <ModuleContainer title="Patterns" icon="fa-square-check"><PatternGame onSound={playFeedbackSound} /></ModuleContainer>,
          'one-to-one': <ModuleContainer title="One-to-One Matching" icon="fa-arrows-left-right"><OneToOneGame onSound={playFeedbackSound} /></ModuleContainer>,
          'tracing': <ModuleContainer title="Number Tracing" icon="fa-pen-clip"><NumberMagicPen {...commonProps} /></ModuleContainer>,
      };
      return modules[activeTab];
    };
  
    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
        <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-purple-50 min-w-max">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1", activeTab === tab.id ? `bg-purple-500 text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50 font-black')}>
                <IconRenderer iconName={tab.icon} className="text-lg" /><span className="whitespace-nowrap">{tab.id.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full px-4">{renderModule()}</div>
      </div>
    );
};
  
export default NumeracyZone;