'use client';

import React, { useState } from 'react';
import { CheckCircle2, Eye, Lightbulb, Lock, LockOpen, Power, ToggleLeft, ToggleRight } from 'lucide-react';
import { lessonMediaUrl } from '@/lib/narrated-lessons/types';

interface BooleanIntroInteractiveProps {
  lessonId: string;
  slideId: string;
}

/**
 * Interactive SVG 1 — Can you enter the computer laboratory?
 * Students discover the two-condition rule naturally before learning the formal AND gate symbol.
 */
function LabAccessInteractive({ lessonId }: { lessonId: string }) {
  const [hasId, setHasId] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  const granted = hasId && hasPermission;
  const outputBit = granted ? 1 : 0;

  return (
    <div className="space-y-4">
      {/* Supporting Illustration 1B */}
      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <img
          src={lessonMediaUrl(lessonId, 'images/intro-computer-laboratory-access.webp')}
          alt="A secondary school student holding a school identification card while a teacher grants permission beside a computer laboratory entrance with an electronic access indicator."
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
        <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-600">
          <strong>Everyday rule:</strong> Entering the computer laboratory requires <em>both</em> a valid student ID card and teacher permission.
        </figcaption>
      </figure>

      {/* Interactive Lab Door Component */}
      <div className="rounded-2xl border border-sky-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
              Interactive Exploration 1
            </p>
            <h3 className="text-base font-extrabold text-slate-900">
              Can you enter the computer laboratory?
            </h3>
          </div>
          <span
            data-testid="lab-output-badge"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
              granted
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {granted ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            {granted ? 'Access granted' : 'Access denied'} · Output: {outputBit}
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 items-center">
          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <div>
                <p className="text-xs font-bold text-slate-900">Valid student ID card</p>
                <p className="text-[11px] text-slate-500">Condition 1 ({hasId ? 'True / 1' : 'False / 0'})</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={hasId}
                aria-label="Valid student ID card"
                onClick={() => setHasId((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                  hasId
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {hasId ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {hasId ? 'Yes (1)' : 'No (0)'}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <div>
                <p className="text-xs font-bold text-slate-900">Teacher&apos;s permission</p>
                <p className="text-[11px] text-slate-500">Condition 2 ({hasPermission ? 'True / 1' : 'False / 0'})</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={hasPermission}
                aria-label="Teacher's permission"
                onClick={() => setHasPermission((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                  hasPermission
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {hasPermission ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {hasPermission ? 'Yes (1)' : 'No (0)'}
              </button>
            </div>

            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {granted
                ? '✓ Both conditions are true, so the door opens and the logical output is 1.'
                : '✕ Both conditions must be true before entry is permitted. At least one requirement is missing, so the output is 0.'}
            </p>
          </div>

          {/* Illustrated Lab Door SVG */}
          <div className="flex flex-col items-center">
            <svg
              viewBox="0 0 320 200"
              className="w-full max-w-[300px] rounded-xl border border-slate-200 bg-slate-50"
              role="img"
              aria-label={granted ? 'Laboratory door open: Access granted (1)' : 'Laboratory door closed: Access denied (0)'}
            >
              {/* Wall */}
              <rect x="0" y="0" width="320" height="200" fill="#F1F5F9" />
              <rect x="0" y="172" width="320" height="28" fill="#CBD5E1" />

              {/* Door Frame */}
              <rect x="92" y="24" width="116" height="148" rx="4" fill="#1E293B" />

              {granted ? (
                <>
                  {/* Open interior with computer monitor */}
                  <rect x="100" y="32" width="100" height="140" fill="#DBEAFE" />
                  <rect x="122" y="88" width="56" height="36" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                  <rect x="144" y="124" width="12" height="10" fill="#475569" />
                  <rect x="116" y="134" width="68" height="8" rx="2" fill="#64748B" />
                  {/* Swung-open door leaf on left */}
                  <polygon points="100,32 122,42 122,166 100,172" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
                </>
              ) : (
                <>
                  {/* Closed door */}
                  <rect x="100" y="32" width="100" height="140" fill="#475569" stroke="#334155" strokeWidth="2" />
                  <rect x="114" y="46" width="72" height="44" rx="4" fill="#94A3B8" opacity="0.5" />
                  <circle cx="184" cy="108" r="5" fill="#FBBF24" />
                  {/* Cross lock indicator */}
                  <circle cx="150" cy="126" r="14" fill="#991B1B" />
                  <path d="M144 120 L156 132 M156 120 L144 132" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                </>
              )}

              {/* Electronic Access Indicator Box */}
              <rect x="224" y="54" width="74" height="72" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <circle cx="261" cy="78" r="12" fill={granted ? '#10B981' : '#EF4444'} />
              <text x="261" y="83" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FFFFFF">
                {outputBit}
              </text>
              <text x="261" y="108" textAnchor="middle" fontSize="10" fontWeight="bold" fill={granted ? '#6EE7B7' : '#FCA5A5'}>
                {granted ? 'OPEN' : 'LOCKED'}
              </text>

              {/* Status Banner */}
              <text x="160" y="191" textAnchor="middle" fontSize="12" fontWeight="bold" fill={granted ? '#047857' : '#B91C1C'}>
                {granted ? '✓ Access granted (Output = 1)' : '✕ Access denied (Output = 0)'}
              </text>
            </svg>
          </div>
        </div>

        {/* All 4 combinations table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">Valid ID</th>
                <th className="px-3 py-2 font-bold">Permission</th>
                <th className="px-3 py-2 font-bold">Access</th>
                <th className="px-3 py-2 font-bold">Output</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: false, perm: false },
                { id: false, perm: true },
                { id: true, perm: false },
                { id: true, perm: true },
              ].map((row, idx) => {
                const ok = row.id && row.perm;
                const active = row.id === hasId && row.perm === hasPermission;
                return (
                  <tr
                    key={idx}
                    className={`border-t border-slate-100 ${
                      active ? 'bg-sky-50 font-bold text-slate-950' : 'text-slate-600'
                    }`}
                  >
                    <td className="px-3 py-1.5">{row.id ? 'Yes (1)' : 'No (0)'}</td>
                    <td className="px-3 py-1.5">{row.perm ? 'Yes (1)' : 'No (0)'}</td>
                    <td className="px-3 py-1.5">{ok ? '✓ Granted' : '✕ Denied'}</td>
                    <td className="px-3 py-1.5 font-mono">{ok ? '1' : '0'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive SVG 2 (Open/Closed Circuit) + Interactive SVG 3 (Digital Signal Waveform) + Reference Table
 */
function ElectricityAndSignalsInteractive({ lessonId }: { lessonId: string }) {
  const [switchClosed, setSwitchClosed] = useState(false);
  const [bits, setBits] = useState<number[]>([0, 1, 1, 0, 1, 0]);

  const toggleBit = (index: number) => {
    setBits((prev) => prev.map((b, i) => (i === index ? (b === 1 ? 0 : 1) : b)));
  };

  // Build exact step-waveform SVG path with NO false transitions between adjacent identical bits
  const startX = 68;
  const stepW = 54;
  const yHigh = 46;
  const yLow = 114;
  const wavePath = bits
    .map((b, i) => {
      const x1 = startX + i * stepW;
      const x2 = x1 + stepW;
      const y = b === 1 ? yHigh : yLow;
      if (i === 0) return `M ${x1} ${y} L ${x2} ${y}`;
      const prevY = bits[i - 1] === 1 ? yHigh : yLow;
      return prevY === y ? `L ${x2} ${y}` : `L ${x1} ${y} L ${x2} ${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-4">
      {/* Supporting Illustration 2B */}
      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <img
          src={lessonMediaUrl(lessonId, 'images/intro-inside-digital-computer.webp')}
          alt="A computer motherboard with progressive magnification toward the processor chip and microscopic electronic pathways inside it."
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
        <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-600">
          <strong>Inside a digital computer:</strong> Microscopic electronic circuits (including transistors) use voltage levels to represent binary signals.
        </figcaption>
      </figure>

      {/* Interactive SVG 2: Simple Electrical Circuit */}
      <div className="rounded-2xl border border-amber-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
              Interactive Exploration 2A
            </p>
            <h3 className="text-base font-extrabold text-slate-900">
              Open and Closed Electrical Circuit (Two-State Analogy)
            </h3>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={switchClosed}
            aria-label="Toggle circuit switch"
            onClick={() => setSwitchClosed((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
              switchClosed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            {switchClosed ? 'Switch Closed · State 1 (ON)' : 'Switch Open · State 0 (OFF)'}
          </button>
        </div>

        <div className="mt-3 flex flex-col items-center">
          <svg
            viewBox="0 0 420 175"
            className="w-full max-w-[440px] rounded-xl border border-slate-200 bg-slate-950"
            role="img"
            aria-label={
              switchClosed
                ? 'Closed circuit: complete path, lamp illuminated, illustrative state 1'
                : 'Open circuit: incomplete path, lamp off, illustrative state 0'
            }
          >
            {/* Connecting wires */}
            <path
              d="M 70 66 L 70 34 L 164 34"
              fill="none"
              stroke={switchClosed ? '#34D399' : '#64748B'}
              strokeWidth="4"
            />
            <path
              d="M 234 34 L 340 34 L 340 70"
              fill="none"
              stroke={switchClosed ? '#34D399' : '#64748B'}
              strokeWidth="4"
            />
            <path
              d="M 340 116 L 340 146 L 70 146 L 70 110"
              fill="none"
              stroke={switchClosed ? '#34D399' : '#64748B'}
              strokeWidth="4"
            />

            {/* Low-voltage Battery symbol (left) */}
            <line x1="50" y1="74" x2="90" y2="74" stroke="#38BDF8" strokeWidth="3.5" />
            <line x1="60" y1="86" x2="80" y2="86" stroke="#38BDF8" strokeWidth="6" />
            <line x1="50" y1="98" x2="90" y2="98" stroke="#38BDF8" strokeWidth="3.5" />
            <line x1="60" y1="110" x2="80" y2="110" stroke="#38BDF8" strokeWidth="6" />
            <text x="34" y="76" fontSize="13" fontWeight="bold" fill="#7DD3FC">+</text>
            <text x="36" y="114" fontSize="14" fontWeight="bold" fill="#7DD3FC">−</text>
            <text x="70" y="132" textAnchor="middle" fontSize="11" fill="#CBD5E1">Battery</text>

            {/* Switch terminals & blade (top) */}
            <circle cx="164" cy="34" r="5" fill="#F8FAFC" />
            <circle cx="234" cy="34" r="5" fill="#F8FAFC" />
            <line
              x1="164"
              y1="34"
              x2={switchClosed ? 234 : 226}
              y2={switchClosed ? 34 : 10}
              stroke="#FBBF24"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="199" y="56" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FDE68A">
              {switchClosed ? 'Switch Closed' : 'Switch Open'}
            </text>

            {/* Lamp symbol (right) */}
            {switchClosed && <circle cx="340" cy="93" r="32" fill="#FACC15" opacity="0.25" />}
            <circle
              cx="340"
              cy="93"
              r="22"
              fill={switchClosed ? '#FEF08A' : '#1E293B'}
              stroke={switchClosed ? '#FACC15' : '#94A3B8'}
              strokeWidth="3"
            />
            {/* Standard lamp X filament symbol */}
            <line x1="326" y1="79" x2="354" y2="107" stroke={switchClosed ? '#B45309' : '#64748B'} strokeWidth="2.5" />
            <line x1="354" y1="79" x2="326" y2="107" stroke={switchClosed ? '#B45309' : '#64748B'} strokeWidth="2.5" />
            <text x="340" y="134" textAnchor="middle" fontSize="11" fill="#CBD5E1">
              {switchClosed ? 'Lamp ON' : 'Lamp OFF'}
            </text>

            {/* Center state readout */}
            <rect x="136" y="76" width="136" height="44" rx="10" fill="#0F172A" stroke={switchClosed ? '#34D399' : '#475569'} strokeWidth="2" />
            <text x="204" y="96" textAnchor="middle" fontSize="12" fontWeight="bold" fill={switchClosed ? '#6EE7B7' : '#CBD5E1'}>
              {switchClosed ? 'Complete Path' : 'Broken Path'}
            </text>
            <text x="204" y="112" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F8FAFC">
              Illustrative state: {switchClosed ? '1' : '0'}
            </text>
          </svg>

          <p className="mt-2.5 text-center text-xs text-slate-600 max-w-xl">
            This switch is a simple analogy for two distinct states. Actual digital circuits represent logical 0 and logical 1 using defined voltage ranges.
          </p>
        </div>
      </div>

      {/* Interactive SVG 3: Digital Signal Waveform + Reference Table */}
      <div className="rounded-2xl border border-indigo-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="pb-3 border-b border-slate-100">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
            Interactive Exploration 2B
          </p>
          <h3 className="text-base font-extrabold text-slate-900">
            Understanding Digital Signals (Sequence: {bits.join(' ')})
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Tap any binary digit below to toggle it. Notice that adjacent identical bits (such as 1, 1) stay flat at the same voltage band with no false transition.
          </p>
        </div>

        <div className="mt-3 flex flex-col items-center">
          <svg
            viewBox="0 0 420 165"
            className="w-full max-w-[460px] rounded-xl border border-slate-200 bg-slate-950"
            role="img"
            aria-label={`Digital signal waveform for binary sequence ${bits.join(', ')}`}
          >
            {/* High and Low voltage bands */}
            <rect x="68" y="30" width="324" height="32" fill="#064E3B" opacity="0.45" />
            <rect x="68" y="98" width="324" height="32" fill="#1E293B" opacity="0.7" />
            <text x="60" y="50" textAnchor="end" fontSize="11" fontWeight="bold" fill="#6EE7B7">HIGH</text>
            <text x="60" y="118" textAnchor="end" fontSize="11" fontWeight="bold" fill="#94A3B8">LOW</text>

            {/* Axes */}
            <line x1="68" y1="20" x2="68" y2="136" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="68" y1="136" x2="400" y2="136" stroke="#CBD5E1" strokeWidth="2" />
            <text x="16" y="84" transform="rotate(-90 16 84)" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#E2E8F0">
              Voltage
            </text>
            <text x="230" y="156" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#E2E8F0">
              Time →
            </text>

            {/* Bit interval dividers & labels */}
            {bits.map((b, i) => {
              const x = startX + i * stepW;
              return (
                <g key={i}>
                  {i > 0 && (
                    <line x1={x} y1="26" x2={x} y2="136" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  )}
                  <text
                    x={x + stepW / 2}
                    y="150"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill={b === 1 ? '#6EE7B7' : '#94A3B8'}
                  >
                    {b}
                  </text>
                </g>
              );
            })}

            {/* Exact digital step waveform */}
            <path d={wavePath} fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinejoin="miter" />
          </svg>

          {/* Interactive bit toggles */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {bits.map((b, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleBit(i)}
                aria-label={`Toggle signal bit ${i + 1}, currently ${b}`}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-extrabold transition ${
                  b === 1
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                Bit {i + 1}: {b}
              </button>
            ))}
          </div>
        </div>

        {/* Reference table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">Binary digit</th>
                <th className="px-3 py-2 font-bold">Typical signal level</th>
                <th className="px-3 py-2 font-bold">Logical meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 text-slate-700">
                <td className="px-3 py-1.5 font-mono font-bold">0</td>
                <td className="px-3 py-1.5">Low (defined low-voltage range)</td>
                <td className="px-3 py-1.5">False / No</td>
              </tr>
              <tr className="border-t border-slate-100 text-slate-700">
                <td className="px-3 py-1.5 font-mono font-bold">1</td>
                <td className="px-3 py-1.5">High (defined high-voltage range)</td>
                <td className="px-3 py-1.5">True / Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * SVG 4 (Conceptual IPO Block Diagram) + Interactive SVG 5 (Same Inputs, Different Logical Rules)
 */
function LogicRulesInteractive() {
  const [inputA, setInputA] = useState<0 | 1>(1);
  const [inputB, setInputB] = useState<0 | 1>(0);
  const [rule, setRule] = useState<'both' | 'either'>('both');
  const [revealNames, setRevealNames] = useState(false);

  const output: 0 | 1 =
    rule === 'both'
      ? inputA === 1 && inputB === 1
        ? 1
        : 0
      : inputA === 1 || inputB === 1
        ? 1
        : 0;

  const explanation =
    rule === 'both'
      ? output === 1
        ? 'Both Input A and Input B are 1, so the rule "Both inputs must be 1" produces Output 1.'
        : 'At least one input is 0, so the rule "Both inputs must be 1" produces Output 0.'
      : output === 1
        ? 'At least one input is 1, so the rule "At least one input must be 1" produces Output 1.'
        : 'Both inputs are 0 (neither is 1), so the rule "At least one input must be 1" produces Output 0.';

  return (
    <div className="space-y-4">
      {/* SVG 4: Conceptual Input -> LOGIC GATE -> Output Block Diagram */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          Conceptual Block Diagram (Not a formal Cambridge gate symbol)
        </p>
        <svg
          viewBox="0 0 520 140"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-950"
          role="img"
          aria-label="Conceptual block diagram: Input A and Input B enter a Logic Gate processing block which applies a logical rule to produce a binary Output."
        >
          {/* Input A */}
          <rect x="18" y="22" width="118" height="36" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <text x="77" y="44" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7DD3FC">Input A (0 or 1)</text>
          <line x1="136" y1="40" x2="188" y2="56" stroke="#38BDF8" strokeWidth="3" />
          <polygon points="188,56 178,49 180,60" fill="#38BDF8" />

          {/* Input B */}
          <rect x="18" y="82" width="118" height="36" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <text x="77" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7DD3FC">Input B (0 or 1)</text>
          <line x1="136" y1="100" x2="188" y2="84" stroke="#38BDF8" strokeWidth="3" />
          <polygon points="188,84 180,80 178,91" fill="#38BDF8" />

          {/* Processing Block */}
          <rect x="190" y="30" width="150" height="80" rx="14" fill="#312E81" stroke="#A78BFA" strokeWidth="2.5" />
          <text x="265" y="64" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#FFFFFF">LOGIC GATE</text>
          <text x="265" y="86" textAnchor="middle" fontSize="11" fill="#DDD6FE">Applies a logical rule</text>

          {/* Output arrow */}
          <line x1="340" y1="70" x2="386" y2="70" stroke="#34D399" strokeWidth="3" />
          <polygon points="390,70 380,64 380,76" fill="#34D399" />

          {/* Output */}
          <rect x="392" y="50" width="112" height="40" rx="8" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
          <text x="448" y="74" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6EE7B7">Output (0 or 1)</text>
        </svg>
      </div>

      {/* Interactive SVG 5: Same Inputs, Different Logical Rules */}
      <div className="rounded-2xl border border-violet-200 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
              Interactive Exploration 3
            </p>
            <h3 className="text-base font-extrabold text-slate-900">
              Same Inputs, Different Logical Rules
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setRevealNames((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-800 hover:bg-violet-100"
          >
            <Eye className="h-3.5 w-3.5" />
            {revealNames ? 'Hide formal gate names' : 'Reveal formal gate names'}
          </button>
        </div>

        {/* Rule selector */}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRule('both')}
            aria-pressed={rule === 'both'}
            className={`rounded-xl border p-3 text-left text-xs transition ${
              rule === 'both'
                ? 'border-violet-500 bg-violet-50 text-violet-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block font-extrabold">
              Rule 1: Both inputs must be 1 {revealNames ? '(AND gate)' : ''}
            </span>
            <span className="text-[11px] font-normal text-slate-600">
              Output is 1 only when A = 1 and B = 1.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRule('either')}
            aria-pressed={rule === 'either'}
            className={`rounded-xl border p-3 text-left text-xs transition ${
              rule === 'either'
                ? 'border-violet-500 bg-violet-50 text-violet-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block font-extrabold">
              Rule 2: At least one input must be 1 {revealNames ? '(OR gate)' : ''}
            </span>
            <span className="text-[11px] font-normal text-slate-600">
              Output is 1 when A = 1, B = 1, or both are 1.
            </span>
          </button>
        </div>

        {/* Inputs + Live Output Indicator */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3 items-center">
          <button
            type="button"
            aria-label={`Toggle Input A, currently ${inputA}`}
            onClick={() => setInputA((v) => (v === 1 ? 0 : 1))}
            className={`rounded-xl border p-3 text-center transition ${
              inputA === 1
                ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <span className="block text-[11px] font-bold uppercase text-slate-500">Input A</span>
            <span className="mt-1 block font-mono text-2xl font-extrabold">{inputA}</span>
            <span className="text-[11px] font-semibold">{inputA === 1 ? 'ON (TRUE)' : 'OFF (FALSE)'}</span>
          </button>

          <button
            type="button"
            aria-label={`Toggle Input B, currently ${inputB}`}
            onClick={() => setInputB((v) => (v === 1 ? 0 : 1))}
            className={`rounded-xl border p-3 text-center transition ${
              inputB === 1
                ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <span className="block text-[11px] font-bold uppercase text-slate-500">Input B</span>
            <span className="mt-1 block font-mono text-2xl font-extrabold">{inputB}</span>
            <span className="text-[11px] font-semibold">{inputB === 1 ? 'ON (TRUE)' : 'OFF (FALSE)'}</span>
          </button>

          <div
            data-testid="rules-output-card"
            className={`rounded-xl border p-3 text-center ${
              output === 1
                ? 'border-amber-400 bg-amber-50 text-amber-950'
                : 'border-slate-300 bg-slate-100 text-slate-700'
            }`}
          >
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase">
              <Lightbulb className={`h-3.5 w-3.5 ${output === 1 ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
              Output
            </span>
            <span className="mt-1 block font-mono text-2xl font-extrabold">{output}</span>
            <span className="text-[11px] font-semibold">{output === 1 ? 'Lamp ON (1)' : 'Lamp OFF (0)'}</span>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-violet-600" />
          <span>{explanation}</span>
        </p>
      </div>
    </div>
  );
}

export function BooleanIntroInteractive({ lessonId, slideId }: BooleanIntroInteractiveProps) {
  if (lessonId !== 'igcse-cs-boolean-logic-a') return null;

  if (slideId === 'intro01') return <LabAccessInteractive lessonId={lessonId} />;
  if (slideId === 'intro02') return <ElectricityAndSignalsInteractive lessonId={lessonId} />;
  if (slideId === 'intro03') return <LogicRulesInteractive />;
  return null;
}
