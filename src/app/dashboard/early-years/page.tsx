'use client';

import React, { useState } from 'react';
import LiteracyZone from './components/LiteracyZone';
import TutorSession from './components/TutorSession';
import NumeracyZone from './components/NumeracyZone';
import ScienceExploration from './components/ScienceExploration';
import ArtsHub from './components/ArtsHub';
import { ModuleType } from './types';
import { MODULES } from './constants';
import { Button } from '@/components/ui/button';

const EarlyYearsPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);

  const renderModule = () => {
    switch (activeModule) {
      case 'LITERACY': return <LiteracyZone />;
      case 'NUMERACY': return <NumeracyZone />;
      case 'SCIENCE': return <ScienceExploration />;
      case 'ARTS': return <ArtsHub />;
      case 'TUTOR': return <TutorSession />;
      default: return null;
    }
  };

  if (activeModule) {
    return (
        <div className="max-w-4xl mx-auto mt-4 animate-in fade-in duration-500">
          <div className="mb-8">
            <Button 
              onClick={() => setActiveModule(null)}
              variant="ghost"
              className="text-gray-500 font-bold flex items-center gap-2 transition-colors hover:text-gray-700"
            >
              <i className="fas fa-arrow-left"></i> Back to Learning Map
            </Button>
          </div>
          {renderModule()}
        </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <section className="text-center mb-16 mt-8">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          What do you want to <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">learn today?</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Choose a fun zone below and start your adventure in reading, writing, and discovery!
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MODULES.map((module) => (
          <button
            key={module.type}
            onClick={() => setActiveModule(module.type)}
            className={`${module.color} p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all text-left flex flex-col h-64 relative overflow-hidden group border-4 border-white`}
          >
            <div className="mb-4 w-16 h-16 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl text-gray-800 shadow-inner group-hover:rotate-12 transition-transform">
              <i className={`fas ${module.icon}`}></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h3>
            <p className="text-gray-700/80 font-medium">{module.description}</p>
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i className={`fas ${module.icon} text-9xl`}></i>
            </div>
          </button>
        ))}
      </div>

      <section className="mt-20 p-12 bg-white rounded-[3rem] shadow-xl border-4 border-dashed border-gray-100 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">For Parents</span>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Integrated Phonics & Early Learning</h3>
          <p className="text-gray-500 text-lg mb-6">
            Our curriculum follows the Nursery 1 syllabus, focusing on letter recognition, phonics, fine motor development, and basic scientific exploration of the world.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <i className="fas fa-check-circle text-green-500"></i> Phonemic Awareness
            </div>
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <i className="fas fa-check-circle text-green-500"></i> Integrated Literacy
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img src="https://picsum.photos/seed/kids-learning/400/300" className="rounded-3xl shadow-lg" alt="Happy Kids" />
        </div>
      </section>
    </div>
  );
};

export default EarlyYearsPage;
