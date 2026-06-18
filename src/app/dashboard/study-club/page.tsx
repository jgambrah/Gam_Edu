'use client';

import React, { useState } from 'react';
import { AITutor } from '@/components/dashboard/ai-tutor';
import CreditBalance from '@/components/CreditBalance';
import { 
  GraduationCap, Brain, Sparkles, BookOpen, Clock, 
  Award, Zap, CheckCircle2, ChevronRight, HelpCircle 
} from 'lucide-react';

export default function StudyClubPage() {
    // Selected options passed to the AITutor child
    const [difficulty, setDifficulty] = useState('Junior High School');
    const [teachingStyle, setTeachingStyle] = useState('Socratic (ask helpful guiding questions rather than giving raw answers directly)');
    const [subject, setSubject] = useState('Mathematics');

    const subjects = [
      { name: 'Mathematics', icon: '📐', desc: 'Algebra, geometry & arithmetic' },
      { name: 'Science & Tech', icon: '🧬', desc: 'Biology, chemistry & physics' },
      { name: 'English & Arts', icon: '✍️', desc: 'Grammar, literature & prose' },
      { name: 'History & Geo', icon: '🌍', desc: 'World events & mapping' }
    ];

    const stylesList = [
      { 
        name: 'Socratic Coach', 
        val: 'Socratic (ask helpful guiding questions rather than giving raw answers directly)', 
        desc: 'Tutor guides you with helpful hints step-by-step.' 
      },
      { 
        name: 'Fun & Analogies', 
        val: 'Fun & Analogies (explain using engaging metaphors, real-world stories, and emoji)', 
        desc: 'Explains complex topics using metaphors and story hooks.' 
      },
      { 
        name: 'Direct & Rigorous', 
        val: 'Direct & Rigorous (provide immediate clear explanations with definitions and formulas, followed by a practice question)', 
        desc: 'Provides instant formulas, definitions, and quizzes.' 
      },
      { 
        name: 'Exam Challenge', 
        val: 'Exam Challenge (give tough, exam-style practice questions and grade their working)', 
        desc: 'Tests you with high-level exam prep questions.' 
      }
    ];

    const difficulties = [
      'Primary School (Basic)',
      'Junior High School',
      'Senior High School',
      'Advanced Prep'
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-950 text-slate-100 min-h-screen">
            {/* Space-Themed Hero Header Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-950/20">
                {/* Visual gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

                <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                Study & Logic Club
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                            Dr. Gam AI Tutor Workspace
                        </h1>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Master your school syllabus with a customized Socratic learning buddy. Configure difficulty, study focus, and teaching methods instantly.
                        </p>
                    </div>

                    {/* Live Spark Credits Display */}
                    <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-indigo-500/20 self-start md:self-auto backdrop-blur-sm">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Spark Energy</p>
                            <div className="mt-1">
                                <CreditBalance />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Selector Capsule Track */}
            <div className="space-y-2.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                <label className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Select Subject Focus:
                </label>
                <span className="text-[11px] text-indigo-300/85 font-semibold italic">
                  🚀 Note: Dr. Gam can teach any subject or curriculum! These areas are just for loading quick starters.
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {subjects.map((sub) => {
                  const isActive = subject === sub.name;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => setSubject(sub.name)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900/60'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sub.icon}</span>
                        <div>
                          <p className={`text-xs font-bold transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                            {sub.name}
                          </p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{sub.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Workspace split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Dynamic Chat takes 2 cols */}
                <div className="lg:col-span-2">
                    <AITutor 
                      difficulty={difficulty}
                      teachingStyle={teachingStyle}
                      subject={subject}
                    />
                </div>

                {/* Right Side: Sidebar Controls */}
                <div className="space-y-6">
                    {/* Tutor Customizer Settings */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="space-y-1">
                          <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
                            Tutor Customizer
                          </h3>
                          <p className="text-[11px] text-slate-500">Configure parameters to customize response generation.</p>
                        </div>

                        {/* Grade Level Select */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Grade / Difficulty level
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {difficulties.map((diff) => {
                              const isActive = difficulty === diff;
                              return (
                                <button
                                  key={diff}
                                  onClick={() => setDifficulty(diff)}
                                  className={`px-3 py-2.5 rounded-lg text-[11px] font-bold text-center border transition-all ${
                                    isActive
                                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                                      : 'bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300 hover:bg-slate-900/60'
                                  }`}
                                >
                                  {diff.split(' ')[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Teaching Style Select */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Teaching Style Preference
                          </label>
                          <div className="space-y-2">
                            {stylesList.map((styleObj) => {
                              const isActive = teachingStyle === styleObj.val;
                              return (
                                <button
                                  key={styleObj.name}
                                  onClick={() => setTeachingStyle(styleObj.val)}
                                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                                    isActive
                                      ? 'bg-indigo-600/10 border-indigo-500/60 text-indigo-400 shadow-md shadow-indigo-950/20'
                                      : 'bg-slate-950 text-slate-400 border-slate-900 hover:text-slate-300 hover:bg-slate-900/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11.5px] font-bold">{styleObj.name}</span>
                                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{styleObj.desc}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                    </div>

                    {/* How to Interact card */}
                    <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/15 shadow-xl space-y-4">
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          Interaction Guide
                        </h4>
                        
                        <div className="space-y-3.5">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                            <div>
                              <p className="text-xs font-bold text-indigo-200">Interactive Dictation Mode</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                Press the mic button in the chat console to dictate prompts directly to Dr. Gam using your microphone.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                            <div>
                              <p className="text-xs font-bold text-indigo-200">Integrated Speech Output (TTS)</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                Click the speaker icon next to any explanation block to hear Dr. Gam speak back. Excellent for grammar, reading, or foreign languages.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                            <div>
                              <p className="text-xs font-bold text-indigo-200">Interactive Prompt Starters</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                Switch the active subject focus at the top of the workspace to load new study starters, practice quizzes, and concepts.
                              </p>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
