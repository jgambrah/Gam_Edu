

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';
import { collection, query, where, orderBy, serverTimestamp, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { 
  Sigma, Languages, Microscope, BookOpen, 
  Rocket, Wand2, PenTool, Loader2, Save, Trash2, Library, Brain, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Atom as AtomIcon, Languages as LanguagesIcon, Sigma as SigmaIcon,
  Folder, FileText, ChevronRight, ChevronLeft, GraduationCap, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


// Import AI actions
import { awardActivityXP, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { Student } from '@/lib/types';
import { generateSeniorEnglish, generateSeniorMath, generateSeniorLab } from '@/ai/flows/senior-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';


// --- HELPER: TEXT TO SPEECH ---
const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; 
    window.speechSynthesis.speak(u);
};

// --- HELPER: LATEX CLEANER ---
const cleanLatex = (formula: string = "") => {
    if (!formula) return "";
    return formula
        .replace(/\$\$/g, '')      
        .replace(/\$/g, '')        
        .replace(/\\\[/g, '')      
        .replace(/\\\]/g, '')      
        .trim();
};

// --- ROBUST MATH RENDERER ---
function SafeMath({ formula, block = true }: { formula: string, block?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-full animate-pulse bg-slate-100 rounded" />;

  const cleaned = cleanLatex(formula);

  try {
    return block ? (
      <div className="math-container py-2 overflow-x-auto">
        <BlockMath math={cleaned} />
      </div>
    ) : (
      <BlockMath math={cleaned} />
    );
  } catch (error) {
    console.error("LaTeX Error:", error);
    return <code className="text-red-500">{formula}</code>;
  }
}

const CATEGORIES = [
    'Early Childhood', 
    'Lower Primary', 
    'Upper Primary', 
    'Junior Secondary (JHS)', 
    'Senior Secondary (SHS)'
];

const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const juniorStyles = {
    // English Storybook styles
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    
    // Science Quest styles
    questCard: "bg-gradient-to-b from-sky-400 to-blue-500 border-b-[12px] border-blue-700 rounded-[50px] text-white",
    stepBubble: "w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow-lg border-4 border-blue-200",
    
    // Math Playground styles
    card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
    header: "p-10 text-center",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    
    // Global Elements
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};

export type SecondaryGradeTier = 'Senior Secondary (SHS)' | 'Junior Secondary (JHS)';

interface SuggestedModuleCard {
    title: string;
    domain: string;
    gradeTier: SecondaryGradeTier;
    meta: string;
    description: string;
    difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
    sampleInstruction: string;
    sampleFormula?: string;
    sampleAnswer: string;
    content?: string;
    background?: string;
    hypothesisPrompt?: string;
    hypothesisOptions?: string[];
    conclusion?: string;
    explanation?: string;
}

const SUGGESTED_MATH_MODULES: SuggestedModuleCard[] = [
    // Senior Secondary (SHS)
    {
        title: "Polynomials & Quadratic Functions",
        domain: "ALGEBRA",
        gradeTier: "Senior Secondary (SHS)",
        meta: "5 Subtopics • 50 mins",
        description: "Formulate and solve higher-degree polynomial systems, remainder theorem, discriminant analysis, and roots of quadratic equations.",
        difficulty: "Advanced",
        sampleInstruction: "Solve for the positive value of x in the quadratic expression:",
        sampleFormula: "3x^2 - 12x + 9 = 0",
        sampleAnswer: "3"
    },
    {
        title: "Differential Calculus & Tangent Slopes",
        domain: "ALGEBRA",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Subtopics • 45 mins",
        description: "First-principles differentiation, product/quotient power rules, and rate of change tangent derivations.",
        difficulty: "Advanced",
        sampleInstruction: "Evaluate derivative f'(x) for f(x) = 2x^3 - 4x at x = 2:",
        sampleFormula: "f'(x) = 6x^2 - 4",
        sampleAnswer: "20"
    },
    {
        title: "Financial Math & Compound Amortization",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Subtopics • 40 mins",
        description: "Compound interest formulas, sinking funds, capital depreciation schedules, and annuity investments.",
        difficulty: "Intermediate",
        sampleInstruction: "Calculate the total compound value A of Principal $1000 at 10% compounded annually for 2 years:",
        sampleFormula: "A = 1000(1 + 0.10)^2",
        sampleAnswer: "1210"
    },
    {
        title: "Trigonometric Identities & Circle Theorems",
        domain: "GEOMETRY & TRIGONOMETRY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "5 Subtopics • 55 mins",
        description: "Compound angle proofs, unit circle radian measures, sine/cosine rules, and cyclic quadrilateral geometry.",
        difficulty: "Advanced",
        sampleInstruction: "Evaluate tan(theta) if sin(theta) = 3/5 and cos(theta) = 4/5:",
        sampleFormula: "\\tan(\\theta) = \\frac{3/5}{4/5}",
        sampleAnswer: "0.75"
    },
    {
        title: "Vectors & Coordinate Geometry",
        domain: "GEOMETRY & TRIGONOMETRY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Subtopics • 45 mins",
        description: "Scalar dot products, vector equations of lines in 2D space, and perpendicular slope conditions.",
        difficulty: "Advanced",
        sampleInstruction: "Find the scalar dot product of vectors u = (3, 4) and v = (2, -1):",
        sampleFormula: "\\mathbf{u} \\cdot \\mathbf{v} = (3)(2) + (4)(-1)",
        sampleAnswer: "2"
    },
    {
        title: "Probability Distributions & Combinatorics",
        domain: "STATISTICS & PROBABILITY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Subtopics • 40 mins",
        description: "Permutations, combinations nCr, binomial distributions, and expected value variances.",
        difficulty: "Advanced",
        sampleInstruction: "Calculate combinations 5C2 for choosing 2 lab partners from 5 candidates:",
        sampleFormula: "\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1}",
        sampleAnswer: "10"
    },

    // Junior Secondary (JHS)
    {
        title: "Linear & Quadratic Equations",
        domain: "ALGEBRA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Subtopics • 45 mins",
        description: "Formulate and solve first and second-degree polynomial systems using factoring and the quadratic formula.",
        difficulty: "Intermediate",
        sampleInstruction: "Solve for the positive value of x in the quadratic expression:",
        sampleFormula: "2x^2 - 8x + 6 = 0",
        sampleAnswer: "3"
    },
    {
        title: "Algebraic Fractions & Indices",
        domain: "ALGEBRA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Subtopics • 35 mins",
        description: "Simplifying rational algebraic expressions, fractional exponents, and exponential power laws.",
        difficulty: "Advanced",
        sampleInstruction: "Simplify and evaluate the exponential index expression:",
        sampleFormula: "\\frac{2^3 \\times 2^4}{2^5}",
        sampleAnswer: "4"
    },
    {
        title: "Simultaneous Systems",
        domain: "ALGEBRA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "5 Subtopics • 50 mins",
        description: "Solve coupled multi-variable linear equations using substitution, elimination, and graph intersections.",
        difficulty: "Intermediate",
        sampleInstruction: "Solve for the value of y in the simultaneous system:",
        sampleFormula: "\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}",
        sampleAnswer: "3"
    },
    {
        title: "Fractions, Percentages & Proportions",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Subtopics • 30 mins",
        description: "Ratios, direct proportions, fraction conversions, and commercial percentage discount calculations.",
        difficulty: "Foundation",
        sampleInstruction: "Calculate 25% of 240 in integer format:",
        sampleFormula: "25\\% \\times 240",
        sampleAnswer: "60"
    },
    {
        title: "Pythagorean & Trig Ratios",
        domain: "GEOMETRY & TRIGONOMETRY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Subtopics • 45 mins",
        description: "Right-angled triangle geometry, sine, cosine, and tangent trigonometric relationships.",
        difficulty: "Intermediate",
        sampleInstruction: "Calculate hypotenuse length c for a right-angled triangle where a = 3 and b = 4:",
        sampleFormula: "c = \\sqrt{3^2 + 4^2}",
        sampleAnswer: "5"
    },
    {
        title: "Set Theory & Probability",
        domain: "STATISTICS & PROBABILITY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Subtopics • 30 mins",
        description: "Venn diagrams, sample spaces, union, intersection, and event outcome odds.",
        difficulty: "Foundation",
        sampleInstruction: "A fair 6-sided die is rolled. Calculate the probability of rolling a prime number (decimal form):",
        sampleFormula: "P(\\text{Prime}) = \\frac{3}{6}",
        sampleAnswer: "0.5"
    }
];

const SUGGESTED_ENGLISH_MODULES: SuggestedModuleCard[] = [
    // Senior Secondary (SHS)
    {
        title: "Rhetorical Devices & Argumentation",
        domain: "RHETORIC & ESSAYS",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Modules • 45 mins",
        description: "Master ethos, pathos, logos, antithesis, and persuasive rhetoric in contemporary and classical essays.",
        difficulty: "Advanced",
        sampleInstruction: "Analyze the tone and rhetorical emphasis of the excerpt.",
        sampleAnswer: "Persuasive",
        content: "To argue for progress is not merely to suggest change; it is to demand that justice and equity form the very foundation upon which tomorrow is constructed."
    },
    {
        title: "Tragic Hero Archetypes & Dramatic Verse",
        domain: "LITERATURE & POETRY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Modules • 50 mins",
        description: "Examine hubris, hamartia, catharsis, and iambic pentameter in classical and modern theatrical drama.",
        difficulty: "Advanced",
        sampleInstruction: "Identify the primary archetype exemplified in the monologue.",
        sampleAnswer: "Tragic Hero",
        content: "He stood upon the precipice of his ambition, blinded by pride, refusing to heed the whispers of impending doom."
    },
    {
        title: "Critical Reading & Scholarly Inferences",
        domain: "NARRATIVE & COMPREHENSION",
        gradeTier: "Senior Secondary (SHS)",
        meta: "3 Modules • 40 mins",
        description: "Deconstruct implicit author stances, synthesize conflicting evidence, and evaluate argumentative theses.",
        difficulty: "Intermediate",
        sampleInstruction: "Infer the main conclusion drawn by the author.",
        sampleAnswer: "Dedication",
        content: "Success in inquiry is seldom accidental; it is born from countless hours of patient trial, steady observation, and unwavering curiosity."
    },
    {
        title: "Post-Colonial Literary Imagery & Symbolism",
        domain: "LITERATURE & POETRY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "3 Modules • 45 mins",
        description: "Explore motifs of identity, cultural resonance, and sensory symbolism in West African and world literature.",
        difficulty: "Advanced",
        sampleInstruction: "Evaluate the primary poetic device used in the passage.",
        sampleAnswer: "Metaphor",
        content: "Knowledge is an unending river, carving through solid stone of doubt with patient, unrelenting grace."
    },

    // Junior Secondary (JHS)
    {
        title: "Narrative Structure & Perspective",
        domain: "NARRATIVE & COMPREHENSION",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Modules • 35 mins",
        description: "Examine first, second, and third-person omniscient viewpoints, non-linear timelines, and story pacing.",
        difficulty: "Intermediate",
        sampleInstruction: "Identify the narrative point of view and thematic motif.",
        sampleAnswer: "First person",
        content: "I watched the morning mist roll down the hills, feeling the quiet rhythm of the school waking to another dawn of discovery and ambition."
    },
    {
        title: "Poetic Meter & Sensory Imagery",
        domain: "LITERATURE & POETRY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Modules • 40 mins",
        description: "Understand iambic pentameter, metaphor, personification, and sensory imagery in lyric verse.",
        difficulty: "Foundation",
        sampleInstruction: "Identify the literary device used in the passage.",
        sampleAnswer: "Personification",
        content: "The wind whispered secrets through the ancient cedar boughs as twilight descended upon the peaceful valley."
    },
    {
        title: "Informational Text & Central Idea Inferences",
        domain: "NARRATIVE & COMPREHENSION",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Modules • 30 mins",
        description: "Draw deductive conclusions, synthesize implicit author intentions, and analyze text evidence.",
        difficulty: "Foundation",
        sampleInstruction: "Infer the author's primary intended takeaway.",
        sampleAnswer: "Curiosity",
        content: "Scientific breakthrough begins with simple curiosity, nurtured through disciplined exploration and persistent question-asking."
    },
    {
        title: "Persuasive Speeches & Basic Rhetoric",
        domain: "RHETORIC & ESSAYS",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Modules • 35 mins",
        description: "Identify call-to-action techniques, repetition, and emotive diction in youth debates.",
        difficulty: "Intermediate",
        sampleInstruction: "Identify the persuasive technique used in the concluding sentence.",
        sampleAnswer: "Call to action",
        content: "We cannot wait for another generation to take up this mantle. Today, let us step forward together into the light of shared responsibility."
    }
];

const SUGGESTED_SCIENCE_MODULES: SuggestedModuleCard[] = [
    // Senior Secondary (SHS)
    {
        title: "Newtonian Mechanics & Force Dynamics",
        domain: "PHYSICAL SCIENCES & PHYSICS",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Labs • 50 mins",
        description: "Simulate velocity, momentum conservation, kinetic energy transfers, and friction coefficients.",
        difficulty: "Advanced",
        sampleInstruction: "Evaluate net force and acceleration for colliding masses.",
        sampleAnswer: "F = ma",
        background: "Newton's laws govern how macroscopic objects interact under applied external forces and gravity.",
        hypothesisPrompt: "How does doubling mass affect acceleration when applied force remains constant?",
        hypothesisOptions: ["Acceleration is halved", "Acceleration doubles", "Acceleration remains identical"],
        conclusion: "Acceleration is inversely proportional to mass under constant applied net force.",
        explanation: "According to Newton's Second Law (F = ma), a = F/m, hence doubling m halves a."
    },
    {
        title: "Acid-Base Titration & pH Equilibrium",
        domain: "CHEMICAL REACTIONS & MATTER",
        gradeTier: "Senior Secondary (SHS)",
        meta: "3 Labs • 45 mins",
        description: "Measure stoichiometric equivalence, buffer capacities, and Henderson-Hasselbalch endpoints.",
        difficulty: "Advanced",
        sampleInstruction: "Calculate neutralization equivalence endpoint.",
        sampleAnswer: "pH 7",
        background: "When hydrochloric acid reacts with sodium hydroxide, neutralization produces salt and water.",
        hypothesisPrompt: "What is the expected pH at the stoichiometric equivalence point for a strong acid and strong base?",
        hypothesisOptions: ["pH = 7.0 (Neutral)", "pH = 3.5 (Acidic)", "pH = 10.0 (Basic)"],
        conclusion: "Strong acid and strong base titrations yield a neutral salt solution at equivalence.",
        explanation: "Equal moles of H+ and OH- ions combine to form neutral H2O molecules."
    },
    {
        title: "Cellular Respiration & ATP Synthase Pathways",
        domain: "LIFE SCIENCES & BIOLOGY",
        gradeTier: "Senior Secondary (SHS)",
        meta: "4 Labs • 45 mins",
        description: "Investigate glycolysis, the Krebs cycle, mitochondrial electron transport chains, and chemiosmosis.",
        difficulty: "Advanced",
        sampleInstruction: "Determine the primary cellular location of oxidative phosphorylation.",
        sampleAnswer: "Mitochondria",
        background: "Cellular respiration converts biochemical energy from nutrients into ATP, releasing waste products.",
        hypothesisPrompt: "Which cellular component generates the largest yield of ATP during aerobic respiration?",
        hypothesisOptions: ["Mitochondrial inner membrane", "Cytoplasm cytosol", "Nuclear membrane"],
        conclusion: "The electron transport chain on the inner mitochondrial membrane yields the bulk of cellular ATP.",
        explanation: "Proton gradient electrochemical potential drives ATP synthase rotary phosphorylation."
    },
    {
        title: "Electromagnetic Induction & Faraday's Law",
        domain: "PHYSICAL SCIENCES & PHYSICS",
        gradeTier: "Senior Secondary (SHS)",
        meta: "3 Labs • 40 mins",
        description: "Construct virtual solenoid coils, observe induced electromotive forces, and test Lenz's Law.",
        difficulty: "Advanced",
        sampleInstruction: "State the polarity rule determined by Lenz's Law.",
        sampleAnswer: "Opposes change",
        background: "A changing magnetic flux through a conductor induces an electromotive force (EMF).",
        hypothesisPrompt: "What happens to the induced voltage when the magnet is plunged through the coil at twice the speed?",
        hypothesisOptions: ["Induced voltage doubles", "Induced voltage drops to zero", "Induced voltage remains unchanged"],
        conclusion: "Induced electromotive force is directly proportional to the rate of change of magnetic flux.",
        explanation: "Faraday's Law specifies EMF = -d(Phi)/dt; higher relative velocity induces greater potential difference."
    },

    // Junior Secondary (JHS)
    {
        title: "Photosynthesis & Light Absorption",
        domain: "LIFE SCIENCES & BIOLOGY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Labs • 40 mins",
        description: "Investigate light and dark reaction stages, chlorophyll absorption, and oxygen bubble synthesis in plant cells.",
        difficulty: "Foundation",
        sampleInstruction: "Hypothesize oxygen output under concentrated light spectra.",
        sampleAnswer: "Increases",
        background: "Green plants convert sunlight, water, and carbon dioxide into glucose and oxygen through chloroplasts.",
        hypothesisPrompt: "What happens to the rate of photosynthesis when light intensity doubles?",
        hypothesisOptions: ["Photosynthetic rate increases up to saturation", "Photosynthetic rate drops to zero", "No measurable change"],
        conclusion: "Light intensity directly accelerates the photolysis of water until enzyme saturation occurs.",
        explanation: "Chlorophyll pigments absorb photons, transferring energy to reaction centers for ATP generation."
    },
    {
        title: "Acids, Bases & Neutralization Titration",
        domain: "CHEMICAL REACTIONS & MATTER",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Labs • 35 mins",
        description: "Measure pH shifts, litmus indicator endpoints, and stoichiometric salt-water yields.",
        difficulty: "Intermediate",
        sampleInstruction: "Calculate neutralization equivalence endpoint.",
        sampleAnswer: "pH 7",
        background: "When hydrochloric acid reacts with sodium hydroxide, neutralization produces salt and water.",
        hypothesisPrompt: "What is the expected pH at the stoichiometric equivalence point for a strong acid and strong base?",
        hypothesisOptions: ["pH = 7.0 (Neutral)", "pH = 3.5 (Acidic)", "pH = 10.0 (Basic)"],
        conclusion: "Strong acid and strong base titrations yield a neutral salt solution at equivalence.",
        explanation: "Equal moles of H+ and OH- ions combine to form neutral H2O molecules."
    },
    {
        title: "Electric Circuits, Voltage & Ohm's Law",
        domain: "PHYSICAL SCIENCES & PHYSICS",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Labs • 35 mins",
        description: "Construct virtual series and parallel circuits to measure current, potential difference, and resistance.",
        difficulty: "Foundation",
        sampleInstruction: "Determine current I given V = 12V and R = 4Ω.",
        sampleAnswer: "3A",
        background: "Ohm's law relates current (I), voltage (V), and resistance (R) in a closed conductive path.",
        hypothesisPrompt: "If circuit resistance is doubled while supply voltage is kept constant, what occurs to the current?",
        hypothesisOptions: ["Current is halved", "Current doubles", "Voltage drops to zero"],
        conclusion: "Current flowing through a conductor is inversely proportional to resistance.",
        explanation: "By Ohm's Law (I = V/R), increasing resistance diminishes electron flow rate."
    },
    {
        title: "Density, Pressure & Liquid Upthrust",
        domain: "PHYSICAL SCIENCES & PHYSICS",
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Labs • 30 mins",
        description: "Archimedes' principle, displacement cans, buoyant force, and sinking vs floating criteria.",
        difficulty: "Foundation",
        sampleInstruction: "State the condition for an object to float in water.",
        sampleAnswer: "Density less than water",
        background: "An object immersed in fluid experiences an upward buoyant force equal to the weight of fluid displaced.",
        hypothesisPrompt: "What happens when an object with density 0.8 g/cm³ is placed in water (1.0 g/cm³)?",
        hypothesisOptions: ["It floats on the surface", "It sinks to the bottom", "It dissolves instantly"],
        conclusion: "Substances with a density lower than the surrounding fluid experience net positive buoyancy and float.",
        explanation: "The weight of the displaced water exceeds the object's gravitational pull, maintaining equilibrium at the surface."
    }
];

const DEFAULT_ENGLISH_STRANDS: Record<string, { subTopic: string; story: any }[]> = {
    'LITERATURE & POETRY': [
        {
            subTopic: 'Poetic Meter & Literary Imagery',
            story: {
                id: 'def-eng-1',
                title: 'The Whispering Pines',
                category: 'LITERATURE & POETRY',
                subTopic: 'Poetic Meter & Literary Imagery',
                content: 'The wind swept through the ancient forest, whispering forgotten ballads to the wandering stars above.',
                quiz: [
                    { question: 'What literary device is present in "whispering forgotten ballads"?', options: ['Personification', 'Hyperbole', 'Irony', 'Onomatopoeia'], answer: 'Personification' }
                ]
            }
        }
    ],
    'NARRATIVE & COMPREHENSION': [
        {
            subTopic: 'Narrative Structure & Perspective',
            story: {
                id: 'def-eng-2',
                title: 'Echoes of the High Plains',
                category: 'NARRATIVE & COMPREHENSION',
                subTopic: 'Narrative Structure & Perspective',
                content: 'I watched the morning mist roll down the hills, feeling the quiet rhythm of the school waking to another dawn of discovery and ambition.',
                quiz: [
                    { question: 'What point of view is used in the passage?', options: ['First person', 'Second person', 'Third person omniscient', 'Third person limited'], answer: 'First person' }
                ]
            }
        }
    ],
    'RHETORIC & ESSAYS': [
        {
            subTopic: 'Rhetorical Devices & Argumentation',
            story: {
                id: 'def-eng-3',
                title: 'The Pillars of Civic Progress',
                category: 'RHETORIC & ESSAYS',
                subTopic: 'Rhetorical Devices & Argumentation',
                content: 'To argue for progress is not merely to suggest change; it is to demand that justice and equity form the very foundation upon which tomorrow is constructed.',
                quiz: [
                    { question: 'What is the primary rhetorical appeal in demanding justice and equity?', options: ['Ethos & Pathos', 'Paparazzi', 'Satire', 'Allegory'], answer: 'Ethos & Pathos' }
                ]
            }
        }
    ]
};

const DEFAULT_MATH_STRANDS: Record<string, { subTopic: string; problem: any }[]> = {
    'ALGEBRA': [
        {
            subTopic: 'Linear & Quadratic Equations',
            problem: {
                id: 'def-alg-1',
                title: 'Linear & Quadratic Equations',
                category: 'ALGEBRA',
                subTopic: 'Linear & Quadratic Equations',
                instruction: 'Solve for positive x in the quadratic equation:',
                latexFormula: '2x^2 - 8x + 6 = 0',
                answer: '3',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Algebraic Fractions & Indices',
            problem: {
                id: 'def-alg-2',
                title: 'Algebraic Fractions & Indices',
                category: 'ALGEBRA',
                subTopic: 'Algebraic Fractions & Indices',
                instruction: 'Simplify and evaluate the exponential index expression:',
                latexFormula: '\\frac{2^3 \\times 2^4}{2^5}',
                answer: '4',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Simultaneous Systems',
            problem: {
                id: 'def-alg-3',
                title: 'Simultaneous Systems',
                category: 'ALGEBRA',
                subTopic: 'Simultaneous Systems',
                instruction: 'Solve for the value of y in the simultaneous system:',
                latexFormula: '\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}',
                answer: '3',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Inequalities & Graphs',
            problem: {
                id: 'def-alg-4',
                title: 'Inequalities & Graphs',
                category: 'ALGEBRA',
                subTopic: 'Inequalities & Graphs',
                instruction: 'Find the maximum integer value for x satisfying the inequality:',
                latexFormula: '3x - 5 < 10',
                answer: '4',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        }
    ],
    'ARITHMETIC & NUMERACY': [
        {
            subTopic: 'Fractions, Decimals & Percentages',
            problem: {
                id: 'def-arith-1',
                title: 'Percentages & Conversions',
                category: 'ARITHMETIC & NUMERACY',
                subTopic: 'Fractions, Decimals & Percentages',
                instruction: 'Calculate 25% of 240 in integer format:',
                latexFormula: '25\\% \\times 240',
                answer: '60',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Ratios & Proportions',
            problem: {
                id: 'def-arith-2',
                title: 'Direct Proportions',
                category: 'ARITHMETIC & NUMERACY',
                subTopic: 'Ratios & Proportions',
                instruction: 'If 3 pencils cost $15, find the cost of 7 pencils:',
                latexFormula: '\\frac{15}{3} \\times 7',
                answer: '35',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Financial Math & Interest',
            problem: {
                id: 'def-arith-3',
                title: 'Simple Interest',
                category: 'ARITHMETIC & NUMERACY',
                subTopic: 'Financial Math & Interest',
                instruction: 'Calculate simple interest for Principal $500 at 5% for 2 years:',
                latexFormula: 'I = \\frac{500 \\times 5 \\times 2}{100}',
                answer: '50',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        }
    ],
    'GEOMETRY & TRIGONOMETRY': [
        {
            subTopic: 'Pythagoras Theorem',
            problem: {
                id: 'def-geom-1',
                title: 'Right-Angled Triangle Hypotenuse',
                category: 'GEOMETRY & TRIGONOMETRY',
                subTopic: 'Pythagoras Theorem',
                instruction: 'Find hypotenuse c where a = 3 and b = 4:',
                latexFormula: 'c = \\sqrt{3^2 + 4^2}',
                answer: '5',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Angles & Polygons',
            problem: {
                id: 'def-geom-2',
                title: 'Interior Angle Sums',
                category: 'GEOMETRY & TRIGONOMETRY',
                subTopic: 'Angles & Polygons',
                instruction: 'Find the interior angle sum of a pentagon (5 sides) in degrees:',
                latexFormula: '(5 - 2) \\times 180^\\circ',
                answer: '540',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Trigonometric Ratios',
            problem: {
                id: 'def-geom-3',
                title: 'Sine & Cosine Relations',
                category: 'GEOMETRY & TRIGONOMETRY',
                subTopic: 'Trigonometric Ratios',
                instruction: 'In a right triangle with opposite = 6 and hypotenuse = 10, find sin(theta):',
                latexFormula: '\\sin(\\theta) = \\frac{6}{10}',
                answer: '0.6',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        }
    ],
    'STATISTICS & PROBABILITY': [
        {
            subTopic: 'Central Tendency (Mean, Median, Mode)',
            problem: {
                id: 'def-stat-1',
                title: 'Arithmetic Mean',
                category: 'STATISTICS & PROBABILITY',
                subTopic: 'Central Tendency (Mean, Median, Mode)',
                instruction: 'Calculate the mean of 10, 15, and 20:',
                latexFormula: '\\frac{10 + 15 + 20}{3}',
                answer: '15',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Frequency Tables',
            problem: {
                id: 'def-stat-2',
                title: 'Cumulative Frequency',
                category: 'STATISTICS & PROBABILITY',
                subTopic: 'Frequency Tables',
                instruction: 'A survey of 50 students has 30 preferring Science. Find the relative frequency percentage:',
                latexFormula: '\\frac{30}{50} \\times 100\\%',
                answer: '60',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        },
        {
            subTopic: 'Theoretical Probability',
            problem: {
                id: 'def-stat-3',
                title: 'Dice & Coin Probability',
                category: 'STATISTICS & PROBABILITY',
                subTopic: 'Theoretical Probability',
                instruction: 'Calculate the probability of rolling an even number on a standard 6-sided die (decimal):',
                latexFormula: 'P(\\text{Even}) = \\frac{3}{6}',
                answer: '0.5',
                gradeLevel: 'Junior Secondary (JHS)'
            }
        }
    ]
};

const DEFAULT_SCIENCE_STRANDS: Record<string, { subTopic: string; lab: any }[]> = {
    'PHYSICAL SCIENCES & PHYSICS': [
        {
            subTopic: 'Projectile Motion & Gravity',
            lab: {
                id: 'def-sci-1',
                title: 'Trajectory of Projectiles',
                category: 'PHYSICAL SCIENCES & PHYSICS',
                subTopic: 'Projectile Motion & Gravity',
                background: 'Examine ballistic curves under gravitational acceleration g = 9.8 m/s^2.',
                hypothesisPrompt: 'State your hypothesis regarding launch angle vs range.',
                hypothesisOptions: ['Maximum range occurs at 45 degrees', 'Maximum range occurs at 90 degrees', 'Angle has no effect on range'],
                steps: [
                    { stepNumber: 1, action: 'Set launch velocity to 20 m/s at 45 degrees.' },
                    { stepNumber: 2, action: 'Measure flight time and horizontal impact distance.' }
                ],
                conclusion: 'Symmetric projectile range is maximized at a 45 degree launch elevation.',
                explanation: 'Equal distribution of vertical flight time and horizontal speed maximizes horizontal displacement.'
            }
        }
    ],
    'CHEMICAL REACTIONS & MATTER': [
        {
            subTopic: 'Reaction Kinetics & Catalysis',
            lab: {
                id: 'def-sci-2',
                title: 'Enzyme & Catalyst Rates',
                category: 'CHEMICAL REACTIONS & MATTER',
                subTopic: 'Reaction Kinetics & Catalysis',
                background: 'Observe the thermal acceleration of catalytic decomposition of hydrogen peroxide.',
                hypothesisPrompt: 'How does temperature affect enzyme reaction velocity?',
                hypothesisOptions: ['Reaction rate increases up to the optimal denaturation point', 'Temperature has no effect', 'Reaction rate always decreases with temperature'],
                steps: [
                    { stepNumber: 1, action: 'Prepare 10ml H2O2 at 25C and 40C.' },
                    { stepNumber: 2, action: 'Add catalase and record gas volume evolved per minute.' }
                ],
                conclusion: 'Enzymatic catalysis rate doubles per 10C rise until thermal denaturation occurs.',
                explanation: 'Higher kinetic energy increases molecular collision frequency up to the structural integrity threshold.'
            }
        }
    ],
    'LIFE SCIENCES & BIOLOGY': [
        {
            subTopic: 'Photosynthesis & Light Absorption',
            lab: {
                id: 'def-sci-3',
                title: 'Chlorophyll Action Spectrum',
                category: 'LIFE SCIENCES & BIOLOGY',
                subTopic: 'Photosynthesis & Light Absorption',
                background: 'Analyze oxygen production rates under red, green, and blue light wavelengths.',
                hypothesisPrompt: 'Which light wavelength yields highest photosynthetic output?',
                hypothesisOptions: ['Blue and red wavelengths yield maximum photosynthetic rate', 'Green light yields highest rate', 'All wavelengths yield identical rate'],
                steps: [
                    { stepNumber: 1, action: 'Place Elodea pondweed under blue filter LED.' },
                    { stepNumber: 2, action: 'Count oxygen bubbles produced over 5 minutes.' }
                ],
                conclusion: 'Chlorophyll a and b absorb blue and red photons while reflecting green light.',
                explanation: 'Pigment absorption peaks in the blue (430nm) and red (660nm) bands drive light-dependent reactions.'
            }
        }
    ]
};

// --- 1. ENGLISH MASTERY (FOLDER ORGANIZED) ---
const ENGLISH_DOMAINS = [
    'ALL DOMAINS',
    'LITERATURE & POETRY',
    'NARRATIVE & COMPREHENSION',
    'RHETORIC & ESSAYS'
];

function EnglishMastery({ canEdit, activeGrade = 'Senior Secondary (SHS)' }: { canEdit: boolean; activeGrade?: SecondaryGradeTier }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string>('ALL DOMAINS');

    const isJunior = isJuniorLevel(activeGrade);
    const isPrimary = (activeGrade as string) === 'Early Childhood' || (activeGrade as string) === 'Lower Primary' || (activeGrade as string) === 'Upper Primary';

    const storiesQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_stories'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: library } = useCollection<any>(storiesQuery);

    // Folder Logic for English with default curriculum strands
    const folderStructure = useMemo(() => {
        const structure: Record<string, Record<string, any[]>> = {};

        // Populate baseline strands
        Object.entries(DEFAULT_ENGLISH_STRANDS).forEach(([strand, subItems]) => {
            structure[strand] = {};
            subItems.forEach(item => {
                structure[strand][item.subTopic] = [{ ...item.story, gradeLevel: activeGrade }];
            });
        });

        // Overlay DB items if available
        if (library && library.length > 0) {
            const filtered = library.filter(s => (s.gradeLevel || 'Junior Secondary (JHS)') === activeGrade);
            filtered.forEach(s => {
                const category = (s.category || s.genre || 'LITERATURE & POETRY').toUpperCase();
                const subTopic = s.subTopic || 'Standard Comprehension';
                if (!structure[category]) structure[category] = {};
                if (!structure[category][subTopic]) structure[category][subTopic] = [];
                structure[category][subTopic].push(s);
            });
        }

        return structure;
    }, [library, activeGrade]);

    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    const checkAnswers = async () => {
        let correct = 0;
        activeStory.quiz.forEach((q: any, i: number) => {
            if (answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++;
        });
        if (correct === activeStory.quiz.length) { 
            confetti(); 
            speak("Analysis complete! You have mastered this passage.");
            if (user && firestore) {
                const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
                await awardActivityXP(firestore, targetStudentId, 50, 'Senior English Passage', 'stem_explorer');
                await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'LIBRARY_BOOK_RETURNED' });
                await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });
                toast({ title: 'Passage Mastered! 📚', description: '+50 XP saved to your profile! STEM Pioneer & Avid Reader badges evaluated.' });
            }
        }
        else { speak(`Keep investigating. You found ${correct} insights.`); }
    };

    const filteredModules = SUGGESTED_ENGLISH_MODULES.filter(mod => {
        const matchesGrade = mod.gradeTier === activeGrade;
        const matchesDomain = selectedDomain === 'ALL DOMAINS' || mod.domain === selectedDomain;
        return matchesGrade && matchesDomain;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {activeStory ? (
                /* FULL-WIDTH INTERACTIVE READING WORKSTATION */
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setActiveStory(null); setAnswers([]); }}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Recommended Modules
                        </Button>
                        <span className="text-xs text-slate-400">
                            Active Module: <strong className="text-indigo-300">{activeStory.title}</strong>
                        </span>
                    </div>
                    <Card className={`overflow-hidden ${isJunior ? juniorStyles.storybook : "rounded-[36px] bg-slate-900 border border-slate-800 shadow-2xl animate-in zoom-in"}`}>
                        <div className={isJunior ? "text-center mb-8" : "bg-gradient-to-r from-indigo-950 to-slate-900 p-8 sm:p-10 border-b border-indigo-900/30 text-white"}>
                            {isJunior && <div className="text-7xl mb-4 animate-bounce">📖</div>}
                            <CardTitle className={isJunior ? "text-4xl sm:text-5xl font-black text-orange-800" : "text-3xl sm:text-4xl font-black text-white"}>
                                {activeStory.title}
                            </CardTitle>
                            {isJunior && <p className="text-orange-400 font-black mt-2 uppercase tracking-widest">A Magic Tale</p>}
                        </div>

                        <CardContent className={isJunior ? "space-y-12" : "p-6 sm:p-10 space-y-10"}>
                            <div className={cn(
                                "relative overflow-hidden font-serif leading-relaxed whitespace-pre-wrap rounded-3xl p-6 sm:p-10 shadow-inner",
                                isJunior 
                                    ? "bg-[#FFFDF7] text-orange-950 text-2xl pl-10 md:pl-16 border-4 border-orange-100" 
                                    : isPrimary 
                                        ? "bg-[#FCFBF7] text-slate-800 text-lg pl-10 md:pl-16 border border-slate-200" 
                                        : "bg-[#FCFAF2] text-slate-850 text-lg md:columns-2 gap-10 border border-[#EADFCA]"
                            )}>
                                {activeStory.content}
                            </div>

                            {/* QUIZ SECTION */}
                            <div className="space-y-8 pt-8 border-t border-slate-800">
                                <h3 className={isJunior ? "text-4xl font-black text-orange-600 text-center" : "text-xl sm:text-2xl font-black text-white flex items-center gap-3"}>
                                    <Sparkles className="text-indigo-400" /> Comprehension & Literary Check
                                </h3>

                                {activeStory.quiz && activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className={isJunior ? "space-y-4 text-center" : "space-y-2"}>
                                        <p className={isJunior ? "text-2xl font-black text-blue-900" : "font-bold text-slate-200 text-sm flex items-center gap-2"}>
                                            {isJunior ? `🌈 ${q.question}` : <><span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">{i + 1}</span> {q.question}</>}
                                        </p>
                                        <Input 
                                            placeholder={isJunior ? "Tell me the secret..." : "Type analysis..."} 
                                            value={answers[i] || ""} 
                                            onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} 
                                            className={isJunior ? juniorStyles.input : "h-12 bg-slate-900 border-slate-850 text-white rounded-xl focus:border-indigo-550 focus:ring-0"} 
                                        />
                                    </div>
                                ))}
                                <Button 
                                    onClick={checkAnswers} 
                                    className={isJunior 
                                        ? juniorStyles.button 
                                        : "w-full h-14 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-base rounded-xl shadow-[0_4px_0_#4338ca] hover:shadow-[0_2px_0_#4338ca] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all"
                                    }
                                >
                                    {isJunior ? "CHECK MY ANSWERS! 🏆" : "SUBMIT ANALYSIS"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* FULL-WIDTH CURRICULUM MODULES */
                <div className="space-y-4">
                    {/* FULL-WIDTH SECTION HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2.5">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    Curriculum Labs & Recommended Modules
                                </h3>
                                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    {activeGrade}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Interactive literary comprehension passages, rhetorical analyses, and guided textual breakdowns.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl font-semibold">
                                {filteredModules.length} Modules Available
                            </span>
                        </div>
                    </div>

                    {/* DOMAIN FILTER PILL BAR */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                        {ENGLISH_DOMAINS.map((domain) => {
                            const isActive = selectedDomain === domain;
                            return (
                                <button
                                    key={domain}
                                    type="button"
                                    onClick={() => setSelectedDomain(domain)}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                                        isActive
                                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                            : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                                    )}
                                >
                                    <span>{domain}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* STANDARDIZED 3-COLUMN CARD GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredModules.map((mod, i) => (
                            <div 
                                key={i} 
                                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 hover:bg-slate-850/80 transition-all flex flex-col justify-between group h-full shadow-lg"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[170px]">
                                            {mod.domain}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0",
                                            mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            mod.difficulty === 'Advanced' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {mod.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2 min-h-[44px] line-clamp-2">
                                        {mod.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 min-h-[36px] leading-relaxed">
                                        {mod.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 mt-auto">
                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                        {mod.meta}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setActiveStory({
                                                id: `suggested-eng-${i}`,
                                                title: mod.title,
                                                content: mod.content,
                                                quiz: [
                                                    { question: mod.sampleInstruction, options: [mod.sampleAnswer, 'Alternative interpretation', 'Contrasting viewpoint', 'None of the above'], answer: mod.sampleAnswer }
                                                ],
                                                gradeLevel: activeGrade
                                            });
                                            setAnswers([]);
                                        }}
                                        className="h-8 px-3.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <span>Launch Lab</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* EXPANDABLE COMPLETE SYLLABUS CATALOG ARCHIVE */}
                    <div className="mt-8 pt-6 border-t border-slate-800/60">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="archive" className="border border-slate-800/80 bg-slate-900/40 rounded-2xl px-5 overflow-hidden">
                                <AccordionTrigger className="hover:no-underline py-4 text-xs font-bold text-slate-300 hover:text-white group flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <FolderOpen className="w-4 h-4 text-indigo-400" />
                                        <span>Browse Complete Syllabus Catalog & Archived Passages</span>
                                        <span className="text-[11px] font-normal text-slate-500">
                                            ({Object.keys(folderStructure).length} Subject Strands)
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Object.entries(folderStructure).map(([cat, subs]) => (
                                            <div key={cat} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                                                <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                                                    <Folder className="w-3.5 h-3.5" />
                                                    <span>{cat}</span>
                                                </div>
                                                <div className="space-y-1 pl-1">
                                                    {Object.entries(subs as any).map(([subTitle, items]: [string, any]) => (
                                                        <div key={subTitle} className="space-y-1">
                                                            <span className="text-[10px] text-slate-400 font-semibold block">{subTitle}</span>
                                                            {items.map((item: any) => (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => { setActiveStory(item); setAnswers([]); }}
                                                                    className="w-full text-left p-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 truncate flex items-center gap-1.5 transition-colors"
                                                                >
                                                                    <FileText className="w-3 h-3 text-slate-500 shrink-0" />
                                                                    <span className="truncate">{item.title}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 2. ADVANCED MATH LAB ---
function CounterDisplay({ count }: { count: number }) {
    const icons = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍦'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    // Cap at 20 so the screen doesn't get too messy
    const displayCount = Math.min(count, 20);

    return (
        <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/50 rounded-3xl mt-4">
            {Array.from({ length: displayCount }).map((_, i) => (
                <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {icon}
                </span>
            ))}
            {count > 20 && <span className="text-xl font-black text-blue-400">... and more!</span>}
        </div>
    );
}

const MATH_DOMAINS = [
    'ALL DOMAINS',
    'ALGEBRA',
    'ARITHMETIC & NUMERACY',
    'GEOMETRY & TRIGONOMETRY',
    'STATISTICS & PROBABILITY'
];

function MathLab({ canEdit, activeGrade = 'Senior Secondary (SHS)' }: { canEdit: boolean; activeGrade?: SecondaryGradeTier; }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<any>(null);
    const [selectedDomain, setSelectedDomain] = useState<string>('ALL DOMAINS');

    const isJunior = isJuniorLevel(activeGrade);
    const theme = isJunior ? juniorStyles : null;

    const mathQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_math'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: dbProblems, isLoading } = useCollection<any>(mathQuery);

    const folderStructure = useMemo(() => {
        const structure: Record<string, Record<string, any[]>> = {};

        // Populate baseline strands (Algebra, Arithmetic, Geometry, Statistics)
        Object.entries(DEFAULT_MATH_STRANDS).forEach(([strand, subItems]) => {
            structure[strand] = {};
            subItems.forEach(item => {
                structure[strand][item.subTopic] = [{ ...item.problem, gradeLevel: activeGrade }];
            });
        });

        // Overlay DB items if available
        if (dbProblems && dbProblems.length > 0) {
            const filtered = dbProblems.filter(p => (p.gradeLevel || 'Junior Secondary (JHS)') === activeGrade);
            filtered.forEach(p => {
                const subject = (p.category || 'ALGEBRA').toUpperCase();
                const sub = p.subTopic || 'Standard Practice';
                if (!structure[subject]) structure[subject] = {};
                if (!structure[subject][sub]) structure[subject][sub] = [];
                structure[subject][sub].push(p);
            });
        }

        return structure;
    }, [dbProblems, activeGrade]);

    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    const checkAnswer = async () => {
        if (userInput.trim().toLowerCase() === problem.answer.toLowerCase().trim()) {
            setFeedback({ ok: true, msg: "Logical match confirmed! Well done." });
            confetti();
            speak("Correct solution.");
            if (user && firestore) {
                const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
                await awardActivityXP(firestore, targetStudentId, 40, 'Senior Math Solution', 'stem_explorer');
                await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });
                toast({ title: 'Math Solution Confirmed! 📐', description: '+40 XP saved to your profile! STEM Pioneer badge evaluated.' });
            }
        } else {
            setFeedback({ ok: false, msg: `Correction required. Expected: ${problem.answer}` });
            speak("Review your derivation.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {problem ? (
                /* FULL-WIDTH INTERACTIVE SOLVER WORKSTATION */
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setProblem(null); setFeedback(null); }}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
                        </Button>
                        <span className="text-xs text-slate-400">
                            Active Module: <strong className="text-indigo-300">{problem.title || problem.subTopic}</strong>
                        </span>
                    </div>

                    <Card className={isJunior ? theme?.card : "rounded-[36px] bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-white animate-in zoom-in"}>
                        <div className={isJunior ? theme?.header : "bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950/80 p-8 border-b border-emerald-900/30 text-white"}>
                            <div className="flex justify-between items-center">
                                <CardTitle className={isJunior ? "text-4xl font-black text-blue-900" : "text-3xl font-black text-white"}>
                                    {isJunior && "🌈 "} {problem.title}
                                </CardTitle>
                                <Badge className={isJunior ? "bg-white text-pink-500 text-base px-4" : "bg-emerald-600 text-white font-bold"}>
                                    {problem.gradeLevel || activeGrade}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-8 md:p-12 space-y-8">
                            {isJunior ? (
                                <div className={theme?.mathBox}>
                                    <div className="text-7xl text-blue-600 flex justify-center">
                                        <SafeMath formula={problem.latexFormula} />
                                    </div>
                                    {(!isNaN(parseInt(problem.answer))) && (
                                        <div className="mt-8 border-t border-sky-200 pt-6">
                                            <p className="text-center font-black text-sky-500 uppercase text-xs tracking-widest mb-2">Can you count them?</p>
                                            <CounterDisplay count={parseInt(problem.answer)} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-slate-950 border border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
                                    {/* Terminal Bar */}
                                    <div className="bg-slate-900/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">DERIVATION ENGINE v1.0</span>
                                        <div className="w-12" />
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center items-center">
                                        <div className="text-3xl md:text-4xl text-emerald-400 font-mono tracking-wide drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]">
                                            <SafeMath formula={problem.latexFormula} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-center space-y-6">
                                <p className={isJunior ? "text-2xl font-black text-blue-800" : "text-xl font-semibold text-slate-300 italic"}>
                                    {isJunior ? "✨ " + problem.instruction : `"${problem.instruction}"`}
                                </p>
                                <div className="flex flex-col items-center gap-4">
                                    <Input 
                                        value={userInput} 
                                        onChange={e => setUserInput(e.target.value)} 
                                        placeholder={isJunior ? "Type Number Here..." : "Enter Solution..."} 
                                        className={isJunior 
                                            ? juniorStyles.input 
                                            : "h-16 text-3xl font-mono text-center border-2 border-slate-800 bg-slate-950 text-emerald-400 rounded-2xl focus:border-emerald-500 focus:ring-0 shadow-inner max-w-md w-full"
                                        }
                                    />
                                    <Button 
                                        onClick={checkAnswer} 
                                        className={isJunior 
                                            ? theme?.button 
                                            : "h-14 px-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                                        }
                                    >
                                        {isJunior ? "I'M FINISHED! 🚀" : "VERIFY ANSWER"}
                                    </Button>
                                </div>
                            </div>

                            {feedback && (
                                <div className={`p-6 rounded-2xl border flex items-center justify-center gap-3 animate-bounce ${feedback.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                    {feedback.ok ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                    <p className="text-base font-bold">{feedback.msg}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* FULL-WIDTH CURRICULUM MODULES & CATALOG ARCHIVE */
                <div className="space-y-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                Curriculum Labs & Recommended Modules • {activeGrade}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Launch an interactive laboratory module below or browse the full syllabus catalog below.
                            </p>
                        </div>
                    </div>

                    {/* SUBJECT DOMAIN PILL BAR */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                        {MATH_DOMAINS.map((domain) => {
                            const isActive = selectedDomain === domain;
                            return (
                                <button
                                    key={domain}
                                    type="button"
                                    onClick={() => setSelectedDomain(domain)}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                                        isActive
                                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                            : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                                    )}
                                >
                                    <span>{domain}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* FULL-WIDTH 3-COLUMN MODULE CARDS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SUGGESTED_MATH_MODULES.filter(mod => {
                            const matchesGrade = mod.gradeTier === activeGrade;
                            const matchesDomain = selectedDomain === 'ALL DOMAINS' || mod.domain === selectedDomain;
                            return matchesGrade && matchesDomain;
                        }).map((mod, i) => (
                            <div 
                                key={i} 
                                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 hover:bg-slate-850/80 transition-all flex flex-col justify-between group h-full shadow-lg"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            {mod.domain}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                                            mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            mod.difficulty === 'Advanced' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {mod.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2 min-h-[44px] line-clamp-2">
                                        {mod.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 min-h-[36px] leading-relaxed">
                                        {mod.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 mt-auto">
                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                        {mod.meta}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setProblem({
                                                id: `suggested-math-${i}`,
                                                title: mod.title,
                                                category: mod.domain,
                                                subTopic: mod.title,
                                                instruction: mod.sampleInstruction,
                                                latexFormula: mod.sampleFormula,
                                                answer: mod.sampleAnswer,
                                                gradeLevel: activeGrade
                                            });
                                            setFeedback(null);
                                            setUserInput("");
                                        }}
                                        className="h-8 px-3.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <span>Launch Lab</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* EXPANDABLE SYLLABUS CATALOG ARCHIVE ACCORDION */}
                    <div className="pt-6 border-t border-slate-800/80">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="catalog" className="border border-slate-800/80 rounded-2xl bg-slate-900/40 px-4">
                                <AccordionTrigger className="hover:no-underline py-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200">
                                    <div className="flex items-center gap-2">
                                        <FolderOpen className="w-4 h-4 text-indigo-400" />
                                        <span>Browse Full Syllabus Catalog & Repository ({Object.keys(folderStructure).length} Strands)</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-2">
                                    <ScrollArea className="max-h-[380px] rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                                        <div className="space-y-2">
                                            {isLoading ? <Skeleton className="h-32 w-full" /> : Object.keys(folderStructure).length === 0 ? (
                                                <div className="text-center py-12 text-slate-500">
                                                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                    <p className="text-xs font-medium">No archived problems in this category yet.</p>
                                                </div>
                                            ) : (
                                                Object.entries(folderStructure).map(([subject, subTopics]) => (
                                                    <Accordion key={subject} type="single" collapsible className="w-full">
                                                        <AccordionItem value={subject} className="border-none">
                                                            <AccordionTrigger className="hover:no-underline p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl mb-1 group flex items-center justify-between text-slate-300 hover:text-white transition-all text-xs font-bold">
                                                                <div className="flex items-center gap-2">
                                                                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                                                                    <span className="uppercase tracking-wider">{subject}</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="pt-1 pl-3 space-y-1">
                                                                {Object.entries(subTopics as any).map(([subTitle, items]: [string, any]) => (
                                                                    <Accordion key={subTitle} type="single" collapsible>
                                                                        <AccordionItem value={subTitle} className="border-none">
                                                                            <AccordionTrigger className="text-xs font-semibold text-slate-400 py-2 hover:text-indigo-300 pl-2 flex items-center justify-between">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Folder className="w-3 h-3 text-slate-500" />
                                                                                    <span>{subTitle} ({items.length})</span>
                                                                                </div>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent className="space-y-1 pl-3">
                                                                                {items.map((item: any) => (
                                                                                    <button
                                                                                        key={item.id}
                                                                                        onClick={() => { setProblem(item); setFeedback(null); setUserInput(""); }}
                                                                                        className={`w-full text-left p-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                                                                                            problem?.id === item.id 
                                                                                                ? 'bg-indigo-600 text-white' 
                                                                                                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                                                                        }`}
                                                                                    >
                                                                                        <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                                                                        <span className="truncate">{item.title}</span>
                                                                                    </button>
                                                                                ))}
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                ))}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 3. DISCOVERY LAB (FOLDER ORGANIZED) ---
const SCIENCE_DOMAINS = [
    'ALL DOMAINS',
    'PHYSICAL SCIENCES & PHYSICS',
    'CHEMICAL REACTIONS & MATTER',
    'LIFE SCIENCES & BIOLOGY'
];

function DiscoveryLab({ canEdit, activeGrade = 'Senior Secondary (SHS)' }: { canEdit: boolean; activeGrade?: SecondaryGradeTier; }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [lab, setLab] = useState<any>(null);
    const [stage, setStage] = useState<'hypothesis' | 'experiment' | 'conclusion'>('hypothesis');
    const [selectedDomain, setSelectedDomain] = useState<string>('ALL DOMAINS');

    const isJunior = isJuniorLevel(activeGrade);
    const theme = isJunior ? juniorStyles : null;

    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    const handleCompleteMission = async () => {
        setLab(null);
        confetti();
        if (user && firestore) {
            const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
            await awardActivityXP(firestore, targetStudentId, 60, 'Discovery Lab Mission', 'stem_explorer');
            await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });
            toast({ title: 'Discovery Mission Complete! 🔬', description: '+60 XP saved to your profile! STEM Pioneer badge evaluated.' });
        }
    };

    const labQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_labs'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: dbLabs, isLoading } = useCollection<any>(labQuery);

    const folderStructure = useMemo(() => {
        const structure: Record<string, Record<string, any[]>> = {};

        // Populate baseline strands
        Object.entries(DEFAULT_SCIENCE_STRANDS).forEach(([strand, subItems]) => {
            structure[strand] = {};
            subItems.forEach(item => {
                structure[strand][item.subTopic] = [{ ...item.lab, gradeLevel: activeGrade }];
            });
        });

        // Overlay DB items if available
        if (dbLabs && dbLabs.length > 0) {
            const filtered = dbLabs.filter(l => (l.gradeLevel || 'Junior Secondary (JHS)') === activeGrade);
            filtered.forEach(l => {
                const category = (l.category || 'PHYSICAL SCIENCES & PHYSICS').toUpperCase();
                const subTopic = l.subTopic || 'Research Mission';
                if (!structure[category]) structure[category] = {};
                if (!structure[category][subTopic]) structure[category][subTopic] = [];
                structure[category][subTopic].push(l);
            });
        }

        return structure;
    }, [dbLabs, activeGrade]);
    
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {lab ? (
                /* FULL-WIDTH INTERACTIVE LAB WORKSTATION */
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setLab(null); }}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
                        </Button>
                        <span className="text-xs text-slate-400">
                            Active Module: <strong className="text-cyan-300">{lab.title}</strong>
                        </span>
                    </div>

                    <Card className={`overflow-hidden ${isJunior ? theme?.card : "rounded-[36px] bg-slate-900/90 border border-slate-800 shadow-2xl animate-in zoom-in"}`}>
                        <div className={`grid md:grid-cols-3 ${isJunior ? 'min-h-[500px]' : 'min-h-[600px]'}`}>
                            <div className={isJunior ? `p-8 space-y-8 ${theme?.questCard}` : `bg-slate-950 text-white p-8 md:p-10 space-y-8 border-r border-slate-800 relative`}>
                                {!isJunior && (
                                    <div className="absolute left-[38px] top-12 bottom-36 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-violet-500/20 hidden md:block" />
                                )}
                                <div className="flex flex-col gap-6 relative z-10">
                                    {['hypothesis', 'experiment', 'conclusion'].map((s: any, i) => {
                                        const isActive = stage === s;
                                        const isCompleted = (stage === 'experiment' && i === 0) || (stage === 'conclusion' && i <= 1);
                                        return (
                                            <div key={s} className={cn("flex items-center gap-4 transition-all duration-300", isActive ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-60')}>
                                                <div className={isJunior 
                                                    ? theme?.stepBubble 
                                                    : cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold relative transition-all duration-300 border-2",
                                                        isActive ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 
                                                        isCompleted ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                                                    )
                                                }>
                                                    {(!isJunior && isActive) && <div className="absolute -inset-1.5 rounded-full border border-cyan-400/40 animate-ping" />}
                                                    <span className={isJunior ? "" : "font-mono text-sm"}>{i+1}</span>
                                                </div>
                                                <div>
                                                    {!isJunior && <span className="font-black text-slate-500 text-[10px] tracking-wider block">STAGE {i+1}</span>}
                                                    <span className="font-black text-sm text-slate-200">
                                                        {isJunior 
                                                            ? (s === 'hypothesis' ? 'The Big Guess' : s === 'experiment' ? 'Let\'s Explore!' : 'What Happened?') 
                                                            : (s === 'hypothesis' ? 'Hypothesis' : s === 'experiment' ? 'Experiment' : 'Conclusion')
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <hr className="opacity-10 border-slate-800" />
                                <div className="space-y-2">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isJunior ? 'text-blue-200' : 'text-cyan-400 flex items-center gap-1'}`}>🧪 Scientific Background</p>
                                    <p className={isJunior 
                                        ? "text-sm leading-relaxed italic opacity-85" 
                                        : "text-xs leading-relaxed text-slate-400 italic bg-slate-900/40 p-4 rounded-2xl border border-slate-800 shadow-inner"
                                    }>
                                        {lab.background}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-slate-900/10">
                                {stage === 'hypothesis' && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4">
                                        <h2 className={isJunior ? "text-4xl font-black text-blue-600 text-center" : "text-2xl md:text-3xl font-black text-slate-200"}>
                                            {isJunior ? '🤔 What is your Guess?' : lab.question}
                                        </h2>
                                        <div className={isJunior ? "p-8 bg-white rounded-[36px] border-4 border-blue-100 shadow-inner animate-in zoom-in" : "p-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in"}>
                                            {isJunior && <p className="text-blue-400 font-bold mb-6 text-center uppercase tracking-widest">Pick a card!</p>}
                                            <div className="grid grid-cols-1 gap-4">
                                                {lab.hypothesisOptions.map((opt: string) => (
                                                    <Button 
                                                        key={opt} 
                                                        variant="outline" 
                                                        className={isJunior 
                                                            ? "h-20 text-xl font-black border-4 border-blue-50 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-2xl transition-all" 
                                                            : "bg-slate-900 border-2 border-slate-800 hover:border-cyan-500 hover:bg-slate-850 text-slate-200 hover:text-white h-auto py-5 px-6 text-left justify-start font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group shadow-md cursor-pointer"
                                                        } 
                                                        onClick={() => setStage('experiment')}
                                                    >
                                                        {isJunior ? "✨ " + opt : (
                                                            <>
                                                                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                                                                    →
                                                                </div>
                                                                <span className="text-sm md:text-base">{opt}</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {stage === 'experiment' && (
                                    <div className="space-y-8 animate-in zoom-in-95">
                                        <div className="text-center space-y-3">
                                            <h2 className={isJunior ? "text-4xl font-black text-blue-600" : "text-2xl md:text-3xl font-black text-cyan-400"}>
                                                {isJunior ? '🚀 Experiment Time!' : 'Simulation in Progress'}
                                            </h2>
                                            <p className={isJunior ? "text-xl font-bold text-slate-600" : "text-sm text-slate-400"}>Running active variable simulation model...</p>
                                        </div>

                                        <div className="h-56 bg-slate-950/80 border border-slate-800 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-inner">
                                            <div className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                                            <div className="absolute w-48 h-48 border-2 border-dashed border-cyan-500/20 rounded-full animate-spin [animation-duration:15s]" />
                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                <span className="text-5xl animate-bounce">🧪</span>
                                                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 text-xs font-semibold">
                                                    Data Collecting...
                                                </Badge>
                                            </div>
                                        </div>

                                        <Button 
                                            onClick={() => setStage('conclusion')} 
                                            className={isJunior 
                                                ? juniorStyles.button 
                                                : "w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-base rounded-xl shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                                            }
                                        >
                                            {isJunior ? "SEE RESULTS! 🔍" : "OBSERVE FINDINGS"}
                                        </Button>
                                    </div>
                                )}
                                {stage === 'conclusion' && (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-6">
                                        <div className="p-6 md:p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                                                    ✓
                                                </div>
                                                <h3 className="text-lg font-black text-emerald-400">Scientific Finding</h3>
                                            </div>
                                            <p className={`leading-relaxed font-bold ${isJunior ? 'text-2xl text-emerald-900' : 'text-base md:text-lg text-emerald-200'}`}>{lab.conclusion}</p>
                                        </div>
                                        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Principle</span>
                                            <p className={`leading-relaxed ${isJunior ? 'text-xl text-slate-600' : 'text-sm text-slate-300'}`}>{lab.explanation}</p>
                                        </div>
                                        <Button 
                                            onClick={handleCompleteMission} 
                                            className={isJunior 
                                                ? juniorStyles.button 
                                                : "w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                                            }
                                        >
                                            {isJunior ? "COMPLETE MY MISSION! 🏆" : "COMPLETE MISSION"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                /* FULL-WIDTH CURRICULUM RESEARCH MODULES & CATALOG */
                <div className="space-y-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                Curriculum Labs & Recommended Modules • {activeGrade}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Select a research module to explore hypotheses, virtual experiments, and findings.
                            </p>
                        </div>
                    </div>

                    {/* SUBJECT DOMAIN PILL BAR */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                        {SCIENCE_DOMAINS.map((domain) => {
                            const isActive = selectedDomain === domain;
                            return (
                                <button
                                    key={domain}
                                    type="button"
                                    onClick={() => setSelectedDomain(domain)}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                                        isActive
                                            ? "bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30"
                                            : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                                    )}
                                >
                                    <span>{domain}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* FULL-WIDTH 3-COLUMN MODULE CARDS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SUGGESTED_SCIENCE_MODULES.filter(mod => {
                            const matchesGrade = mod.gradeTier === activeGrade;
                            const matchesDomain = selectedDomain === 'ALL DOMAINS' || mod.domain === selectedDomain;
                            return matchesGrade && matchesDomain;
                        }).map((mod, i) => (
                            <div 
                                key={i} 
                                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 hover:bg-slate-850/80 transition-all flex flex-col justify-between group h-full shadow-lg"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[170px]">
                                            {mod.domain}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0",
                                            mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            mod.difficulty === 'Advanced' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {mod.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2 min-h-[44px] line-clamp-2">
                                        {mod.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 min-h-[36px] leading-relaxed">
                                        {mod.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 mt-auto">
                                    <span className="text-[11px] font-medium text-slate-500">
                                        {mod.meta}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setLab({
                                                id: `suggested-sci-${i}`,
                                                title: mod.title,
                                                background: mod.background,
                                                hypothesisPrompt: mod.hypothesisPrompt,
                                                hypothesisOptions: mod.hypothesisOptions,
                                                steps: [
                                                    { stepNumber: 1, action: mod.sampleInstruction }
                                                ],
                                                conclusion: mod.conclusion,
                                                explanation: mod.explanation
                                            });
                                            setStage('hypothesis');
                                        }}
                                        className="h-8 px-3.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <span>Launch Lab</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* EXPANDABLE SYLLABUS CATALOG ARCHIVE ACCORDION */}
                    <div className="pt-6 border-t border-slate-800/80">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="catalog" className="border border-slate-800/80 rounded-2xl bg-slate-900/40 px-4">
                                <AccordionTrigger className="hover:no-underline py-4 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200">
                                    <div className="flex items-center gap-2">
                                        <FolderOpen className="w-4 h-4 text-cyan-400" />
                                        <span>Browse Full Syllabus Catalog & Repository ({Object.keys(folderStructure).length} Strands)</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-2">
                                    <ScrollArea className="max-h-[380px] rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                                        <div className="space-y-2">
                                            {isLoading ? <Skeleton className="h-32 w-full" /> : Object.keys(folderStructure).length === 0 ? (
                                                <div className="text-center py-12 text-slate-500">
                                                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                    <p className="text-xs font-medium">No archived labs in this category yet.</p>
                                                </div>
                                            ) : (
                                                Object.entries(folderStructure).map(([cat, subs]) => (
                                                    <Accordion key={cat} type="single" collapsible className="w-full">
                                                        <AccordionItem value={cat} className="border-none">
                                                            <AccordionTrigger className="hover:no-underline p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-xl mb-1 group flex items-center justify-between text-slate-300 hover:text-white transition-all text-xs font-bold">
                                                                <div className="flex items-center gap-2">
                                                                    <Folder className="w-3.5 h-3.5 text-cyan-400" />
                                                                    <span className="uppercase tracking-wider">{cat}</span>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="pt-1 pl-3 space-y-1">
                                                                {Object.entries(subs as any).map(([subTitle, items]: [string, any]) => (
                                                                    <Accordion key={subTitle} type="single" collapsible>
                                                                        <AccordionItem value={subTitle} className="border-none">
                                                                            <AccordionTrigger className="text-xs font-semibold text-slate-400 py-2 hover:text-cyan-300 pl-2 flex items-center justify-between">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Folder className="w-3.5 h-3.5 text-slate-500" />
                                                                                    <span>{subTitle} ({items.length})</span>
                                                                                </div>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent className="space-y-1 pl-3">
                                                                                {items.map((item: any) => (
                                                                                    <button
                                                                                        key={item.id}
                                                                                        onClick={() => { setLab(item); setStage('hypothesis'); }}
                                                                                        className={`w-full text-left p-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                                                                                            lab?.id === item.id 
                                                                                                ? 'bg-cyan-600 text-white' 
                                                                                                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                                                                        }`}
                                                                                    >
                                                                                        <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                                                                        <span className="truncate">{item.title}</span>
                                                                                    </button>
                                                                                ))}
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                ))}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            )}
        </div>
    );
}

// Quick syllabus topic suggestions for module creator organized by grade tier and subject
const QUICK_TOPICS_BY_SUBJECT_AND_TIER: Record<SecondaryGradeTier, Record<'math' | 'english' | 'science', string[]>> = {
    'Senior Secondary (SHS)': {
        math: [
            "Simultaneous Linear & Quadratic Systems",
            "Polynomial Factorization & Remainder Theorem",
            "Trigonometric Functions & Unit Circle",
            "Calculus: Differential Limits & Rates of Change",
            "Calculus: Definite & Indefinite Integrals",
            "Probability Distributions & Hypothesis Testing",
            "Vector Algebra & 3D Coordinate Geometry",
            "Financial Mathematics: Compound Interest & Annuities"
        ],
        english: [
            "Rhetorical Devices, Ethos, Pathos & Logos",
            "Tragic Hero Archetypes in Dramatic Literature",
            "Comparative Analysis of Post-Colonial Poetry",
            "Critical Inferences & Scholarly Text Synthesis",
            "Style, Syntax & Tone in Argumentative Essays",
            "Narrative Structure, Pacing & Point of View"
        ],
        science: [
            "Newtonian Mechanics, Momentum & Kinetic Energy",
            "Acid-Base Titration & Chemical Equilibrium",
            "Cellular Respiration, Glycolysis & Krebs Cycle",
            "Electromagnetic Induction & Faraday's Law",
            "Genetics: Mendelian Inheritance & DNA Replication",
            "Thermodynamics, Heat Transfer & Entropy"
        ]
    },
    'Junior Secondary (JHS)': {
        math: [
            "Linear & Quadratic Equations",
            "Algebraic Fractions & Indices",
            "Simultaneous Linear Systems",
            "Fractions, Percentages & Proportions",
            "Pythagorean Theorem & Trig Ratios",
            "Set Theory & Basic Probability",
            "Perimeter, Area & Volume of Prisms"
        ],
        english: [
            "Narrative Structure & Perspective",
            "Poetic Meter & Sensory Imagery",
            "Informational Text & Central Idea Inferences",
            "Expository Paragraph Structure",
            "Active vs. Passive Voice & Verb Tenses",
            "Context Clues & Academic Vocabulary"
        ],
        science: [
            "Elements, Compounds & Mixtures",
            "Force, Motion & Simple Machines",
            "Plant & Animal Cell Biology",
            "Photosynthesis & Plant Transport",
            "Electric Circuits, Voltage & Current",
            "States of Matter & Thermal Expansion"
        ]
    }
};

// --- 4. ADMIN CONSOLE (HYBRID AI & MANUAL CREATOR) ---
function AdminConsole({ 
    onContentAdded, 
    activeGrade = 'Senior Secondary (SHS)',
    activeSubject,
    onSubjectChange
}: { 
    onContentAdded: () => void; 
    activeGrade?: SecondaryGradeTier;
    activeSubject: 'math' | 'english' | 'science';
    onSubjectChange: (s: 'math' | 'english' | 'science') => void;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
    const [loading, setLoading] = useState(false);

    // AI Form State
    const [topic, setTopic] = useState("");
    const [instructions, setInstructions] = useState('');

    // Dynamic quick topic suggestions based on active tier and active lab
    const quickTopicList = useMemo(() => {
        return QUICK_TOPICS_BY_SUBJECT_AND_TIER[activeGrade]?.[activeSubject] || QUICK_TOPICS_BY_SUBJECT_AND_TIER['Senior Secondary (SHS)'][activeSubject];
    }, [activeGrade, activeSubject]);
    
    // Manual Form State
    const [manualData, setManualData] = useState<any>({
        title: '',
        category: '', // Broad Category (e.g. Algebra)
        subTopic: '', // Sub Topic (e.g. Linear Equations)
        gradeLevel: activeGrade,
        latexFormula: '',
        instruction: '',
        answer: '',
        content: '', // For English
        genre: '',   // For English
        quiz: [{ question: '', answer: '' }, { question: '', answer: '' }, { question: '', answer: '' }],
        background: '', // For Science
        question: '',
        hypothesisPrompt: '',
        hypothesisOptions: ['', '', ''],
        conclusion: '',
        explanation: '',
        icon: '🔬'
    });

    useEffect(() => {
        setManualData((prev: any) => ({ ...prev, gradeLevel: activeGrade }));
    }, [activeGrade]);

    const handleAiGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        const isJunior = isJuniorLevel(activeGrade);
        const systemInstructions = isJunior ? `${instructions}. Target audience: 5-7 year olds. Use simple words, short sentences, and LOTS of emojis. In math, make sure the answer is a whole number between 1 and 20 so it can be counted visually.` : instructions;
        const context = { 
            topic, 
            gradeLevel: activeGrade as any, 
            instructions: systemInstructions 
        };

        let res;
        if (activeSubject === 'math') res = await generateSeniorMath(context);
        else if (activeSubject === 'english') res = await generateSeniorEnglish(context);
        else res = await generateSeniorLab(context);

        if (res.success && res.data) {
            await addDoc(collection(firestore!, activeSubject === 'math' ? 'senior_math' : activeSubject === 'english' ? 'senior_stories' : 'senior_labs'), {
                ...res.data,
                gradeLevel: activeGrade, 
                createdAt: serverTimestamp()
            });
            toast({ title: 'AI Success', description: `Added to ${activeGrade} library.` });
            onContentAdded();
            setTopic("");
        }
        setLoading(false);
    };

    const handleManualSave = async () => {
        if (!manualData.title || !manualData.category || !manualData.subTopic) {
            toast({ title: "Filing Required", description: "You must provide a Category and Sub-Topic to place this in the correct folder.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const colName = activeSubject === 'math' ? 'senior_math' : activeSubject === 'english' ? 'senior_stories' : 'senior_labs';
            await addDoc(collection(firestore!, colName), {
                ...manualData,
                gradeLevel: manualData.gradeLevel || activeGrade,
                createdAt: serverTimestamp()
            });
            toast({ title: "Saved", description: "Manual entry added to the folders." });
            onContentAdded();
            setManualData({ ...manualData, title: '', latexFormula: '', content: '', background: '', answer: '' });
        } catch (e) {
            toast({ title: "Error", description: "Failed to save manually.", variant: "destructive" });
        }
        setLoading(false);
    };

    return (
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl text-white p-3.5 sm:p-4 mb-3.5 shadow-xl relative overflow-hidden">
            {/* Header Strip */}
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2.5 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                            Professor's Desk
                            <span className="text-[11px] font-semibold text-slate-400">Curriculum Generator</span>
                        </h2>
                        <p className="text-[11px] text-slate-400">Create new syllabus-aligned academic modules or publish custom lab exercises.</p>
                    </div>
                </div>
                
                {/* Creation Mode Segmented Toggle with HIGH CONTRAST */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-700 shadow-inner items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setCreationMode('ai')}
                        className={cn(
                            "rounded-lg font-bold text-xs h-7 px-3.5 transition-all cursor-pointer flex items-center gap-1.5",
                            creationMode === 'ai'
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400/50"
                                : "bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 shadow-xs"
                        )}
                    >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>AI Magic</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setCreationMode('manual')}
                        className={cn(
                            "rounded-lg font-bold text-xs h-7 px-3.5 transition-all cursor-pointer flex items-center gap-1.5",
                            creationMode === 'manual'
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400/50"
                                : "bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 shadow-xs"
                        )}
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>Manual</span>
                    </button>
                </div>
            </div>

            {/* SUBJECT PRESET TABS & LOCKED TIER BADGE */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Active Lab:</span>
                    <button
                        type="button"
                        onClick={() => onSubjectChange('math')}
                        className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                            activeSubject === 'math'
                                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                        )}
                    >
                        <SigmaIcon className="w-3.5 h-3.5" />
                        <span>Advanced Math Lab</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSubjectChange('english')}
                        className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                            activeSubject === 'english'
                                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                        )}
                    >
                        <LanguagesIcon className="w-3.5 h-3.5" />
                        <span>English Mastery</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSubjectChange('science')}
                        className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                            activeSubject === 'science'
                                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                        )}
                    >
                        <AtomIcon className="w-3.5 h-3.5" />
                        <span>Discovery Lab</span>
                    </button>
                </div>

                {/* Subtle locked tier badge inheriting the page-level active tier */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Tier:</span>
                    <span className="font-bold text-indigo-300">{activeGrade}</span>
                </div>
            </div>
            
            {creationMode === 'ai' ? (
                <div className="space-y-3 animate-in fade-in">
                    {/* SECTION 1: INPUT CONTROLS */}
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                1. Input Controls
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                                Configure parameters for <strong className="text-slate-200">{activeSubject === 'math' ? 'Advanced Mathematics Lab' : activeSubject === 'english' ? 'English Mastery & Literature' : 'Scientific Discovery Lab'}</strong>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                            {/* Quick Topics Dropdown */}
                            <div className="space-y-1 md:col-span-4">
                                <Label className="text-[10px] uppercase font-bold text-slate-400">Curriculum Quick-Pick</Label>
                                <Select 
                                    value={quickTopicList.includes(topic) ? topic : ""} 
                                    onValueChange={(val) => setTopic(val)}
                                >
                                    <SelectTrigger className="h-9 bg-slate-900 border-slate-750 text-xs font-medium text-slate-300 rounded-lg hover:border-slate-600 transition-colors">
                                        <SelectValue placeholder="Select suggested topic..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-56">
                                        {quickTopicList.map((item) => (
                                            <SelectItem key={item} value={item} className="text-xs cursor-pointer focus:bg-indigo-600/30 focus:text-white">
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Topic Input Field */}
                            <div className="space-y-1 md:col-span-8">
                                <Label className="text-[10px] uppercase font-bold text-slate-400">Topic Prompt or Objective</Label>
                                <div className="flex items-center gap-2 px-3 bg-slate-900/90 border border-slate-750 rounded-lg focus-within:border-indigo-500/70 transition-colors h-9">
                                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <Input 
                                        value={topic} 
                                        onChange={e => setTopic(e.target.value)} 
                                        onKeyDown={e => { if (e.key === 'Enter' && !loading && topic.trim()) handleAiGenerate(); }}
                                        placeholder={
                                            activeGrade === 'Junior Secondary (JHS)'
                                                ? (
                                                    activeSubject === 'math'
                                                        ? "e.g. Linear Equations, Algebraic Indices, Pythagorean Theorem..."
                                                        : activeSubject === 'english'
                                                        ? "e.g. Narrative Perspective, Sensory Imagery, Main Idea Inferences..."
                                                        : "e.g. Simple Machines, Plant Cells, Electric Circuits..."
                                                )
                                                : (
                                                    activeSubject === 'math' 
                                                        ? "e.g. Simultaneous Equations, Polynomial Factorization, Trigonometric Identities..."
                                                        : activeSubject === 'english'
                                                        ? "e.g. Rhetorical Devices & Ethos, Comparative Poetry, Tragic Hero Archetypes..."
                                                        : "e.g. Newtonian Mechanics & Energy, Acid-Base Titration, Cellular Respiration..."
                                                )
                                        } 
                                        className="h-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ACTION BUTTONS & CREDIT BADGE */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-slate-400">
                            <span className="bg-indigo-950/80 text-indigo-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-indigo-800/40 flex items-center gap-1.5 shrink-0">
                                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> Costs 10 Credits
                            </span>
                            <span className="text-[11px] hidden sm:inline">Generates complete syllabus theory, worked examples, formulas, or lab simulations.</span>
                        </div>

                        <Button 
                            onClick={handleAiGenerate} 
                            disabled={loading || !topic.trim()} 
                            className="w-full sm:w-auto h-9 px-5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:border-indigo-400/50 hover:-translate-y-0.5 active:translate-y-0 border border-indigo-500/30 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none shrink-0"
                        >
                            {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <><Wand2 className="h-3.5 w-3.5"/> Generate Module</>}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-top-4">
                    {/* SECTION 1: INPUT CONTROLS */}
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                1. Module Specifications
                            </span>
                            <span className="text-[11px] text-slate-400">Manual taxonomy and lesson data for {activeSubject === 'math' ? 'Mathematics' : activeSubject === 'english' ? 'English' : 'Science'}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Category (Main Folder)</Label>
                                <Input placeholder={activeSubject === 'math' ? 'e.g. Algebra' : activeSubject === 'english' ? 'e.g. Narrative' : 'e.g. Life Science'} value={manualData.category} onChange={e => setManualData({...manualData, category: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-9 rounded-lg focus:border-indigo-500 focus:ring-0 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Sub-Topic (Sub Folder)</Label>
                                <Input placeholder={activeSubject === 'math' ? 'e.g. Differentiation' : activeSubject === 'english' ? 'e.g. Short Stories' : 'e.g. Plant Biology'} value={manualData.subTopic} onChange={e => setManualData({...manualData, subTopic: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-9 rounded-lg focus:border-indigo-500 focus:ring-0 text-xs" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Module Title</Label>
                            <Input placeholder="Problem/Passage Title" value={manualData.title} onChange={e => setManualData({...manualData, title: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-9 rounded-lg text-xs font-bold focus:border-indigo-500 focus:ring-0" />
                        </div>

                        {activeSubject === 'math' && (
                            <div className="grid md:grid-cols-2 gap-3 pt-1">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-[10px] font-bold uppercase">Formula & Instructions</Label>
                                    <Textarea placeholder="LaTeX Formula (e.g. \frac{x}{y})" value={manualData.latexFormula} onChange={e => setManualData({...manualData, latexFormula: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-20 rounded-lg font-mono focus:border-indigo-500 focus:ring-0 text-xs" />
                                    <Input placeholder="Instruction (e.g. Solve for x)" value={manualData.instruction} onChange={e => setManualData({...manualData, instruction: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-9 rounded-lg text-xs" />
                                    <Input placeholder="Final Answer" value={manualData.answer} onChange={e => setManualData({...manualData, answer: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-9 rounded-lg text-xs" />
                                </div>
                                <div className="bg-slate-900 p-3 rounded-xl flex flex-col justify-center items-center border border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Live Math Preview</p>
                                    <div className="text-lg text-indigo-300">
                                        {manualData.latexFormula ? <SafeMath formula={manualData.latexFormula} /> : <span className="opacity-30 italic text-xs text-slate-500">Formula preview renders here</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSubject === 'english' && (
                            <div className="space-y-2.5 pt-1">
                                <Label className="text-slate-400 text-[10px] font-bold uppercase">Literary Passage Content</Label>
                                <Textarea placeholder="Full Literary Passage Content..." value={manualData.content} onChange={e => setManualData({...manualData, content: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-24 rounded-lg focus:border-indigo-500 focus:ring-0 text-xs" />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                    {[0,1,2].map(i => (
                                        <div key={i} className="p-2 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                                            <Label className="text-[9px] text-indigo-400 font-bold uppercase">Quiz Q{i+1}</Label>
                                            <Input placeholder="Question" className="h-7 text-xs bg-slate-950 border-slate-800 text-white focus:ring-0" value={manualData.quiz[i].question} onChange={e => {const n = [...manualData.quiz]; n[i] = {...n[i], question: e.target.value}; setManualData({...manualData, quiz: n});}} />
                                            <Input placeholder="Answer" className="h-7 text-xs bg-slate-950 border-slate-800 text-white focus:ring-0" value={manualData.quiz[i].answer} onChange={e => {const n = [...manualData.quiz]; n[i] = {...n[i], answer: e.target.value}; setManualData({...manualData, quiz: n});}} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSubject === 'science' && (
                            <div className="grid md:grid-cols-2 gap-2.5 pt-1">
                                <Textarea placeholder="Experiment Background" value={manualData.background} onChange={e => setManualData({...manualData, background: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-20 rounded-lg focus:border-indigo-500 focus:ring-0 text-xs" />
                                <Textarea placeholder="Hypothesis Prompt" value={manualData.hypothesisPrompt} onChange={e => setManualData({...manualData, hypothesisPrompt: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-20 rounded-lg focus:border-indigo-500 focus:ring-0 text-xs" />
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {manualData.hypothesisOptions.map((opt: string, i: number) => (
                                        <Input key={i} placeholder={`Hypothesis Option ${i+1}`} value={opt} onChange={e => {const n = [...manualData.hypothesisOptions]; n[i] = e.target.value; setManualData({...manualData, hypothesisOptions: n});}} className="bg-slate-900 border-slate-800 text-white h-8 rounded-lg text-xs" />
                                    ))}
                                </div>
                                <Input placeholder="Conclusion" value={manualData.conclusion} onChange={e => setManualData({...manualData, conclusion: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-8 rounded-lg text-xs" />
                                <Textarea placeholder="Explanation" value={manualData.explanation} onChange={e => setManualData({...manualData, explanation: e.target.value})} className="bg-slate-900 border-slate-800 text-white h-14 rounded-lg focus:border-indigo-500 focus:ring-0 text-xs" />
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: ACTION BUTTON */}
                    <div className="flex justify-end pt-1">
                        <Button 
                            onClick={handleManualSave} 
                            disabled={loading} 
                            className="w-full sm:w-auto h-9 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <><Save className="h-3.5 w-3.5" /> Publish Manual Module</>}
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}


// --- MAIN PAGE ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();

    const [activeGradeTier, setActiveGradeTier] = useState<SecondaryGradeTier>('Senior Secondary (SHS)');
    const [activeSubject, setActiveSubject] = useState<'math' | 'english' | 'science'>('math');

    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolData } = useDoc<any>(schoolRef);
    const aiCredits = schoolData?.aiCredits ?? 810;
    
    // Memoize forceRefetch to prevent re-creation on every render
    const { forceRefetch: forceMath } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'senior_math') : null, [firestore]));
    const { forceRefetch: forceEnglish } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'senior_stories') : null, [firestore]));
    const { forceRefetch: forceScience } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'senior_labs') : null, [firestore]));

    const handleContentUpdate = useCallback(() => {
        forceMath();
        forceEnglish();
        forceScience();
    }, [forceMath, forceEnglish, forceScience]);
    
    return (
        <div className="p-4 sm:p-6 bg-slate-950 text-slate-100 rounded-3xl min-h-screen relative overflow-hidden border border-slate-900 shadow-2xl">
            {/* Ambient background glows */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            <SectionHeroBanner
                title="Senior Academy"
                subtitle="Advanced subject modules, curriculum labs, and scientific discoveries across secondary tiers."
                eyebrow="SUNNY SIDE ACADEMY • ACADEMICS"
                badge={{
                    label: "LIVE MODULES",
                    variant: "success",
                }}
                icon={Rocket}
                className="mb-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
                actions={
                    <div className="flex flex-wrap items-center gap-3">
                        {/* SEGMENTED CONTROL FOR JHS / SHS */}
                        <div className="bg-slate-950/90 border border-slate-800/90 p-1 rounded-xl flex items-center shadow-lg">
                            <button
                                type="button"
                                onClick={() => setActiveGradeTier('Senior Secondary (SHS)')}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer",
                                    activeGradeTier === 'Senior Secondary (SHS)'
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                )}
                            >
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>Senior Secondary (SHS)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveGradeTier('Junior Secondary (JHS)')}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer",
                                    activeGradeTier === 'Junior Secondary (JHS)'
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                )}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Junior Secondary (JHS)</span>
                            </button>
                        </div>

                        {/* STATUS BADGE */}
                        <div className="hidden sm:flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-xl shadow-inner text-xs">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-bold text-slate-300">Curriculum Synced</span>
                        </div>
                    </div>
                }
            />

            {canEdit && (
                <div className="mb-4">
                    <AdminConsole 
                        onContentAdded={handleContentUpdate} 
                        activeGrade={activeGradeTier} 
                        activeSubject={activeSubject}
                        onSubjectChange={setActiveSubject}
                    />
                </div>
            )}

            {/* SUBJECT NAVIGATION FOR STUDENTS (when canEdit is false) */}
            {!canEdit && (
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6 w-fit">
                    <button
                        type="button"
                        onClick={() => setActiveSubject('math')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer",
                            activeSubject === 'math'
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                        )}
                    >
                        <SigmaIcon className="w-4 h-4" />
                        <span>Advanced Math Lab</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSubject('english')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer",
                            activeSubject === 'english'
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                        )}
                    >
                        <LanguagesIcon className="w-4 h-4" />
                        <span>English Mastery</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSubject('science')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer",
                            activeSubject === 'science'
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                        )}
                    >
                        <AtomIcon className="w-4 h-4" />
                        <span>Discovery Lab</span>
                    </button>
                </div>
            )}

            {/* DIRECT FULL-WIDTH ACTIVE LAB RENDERING */}
            <div className="space-y-4 sm:space-y-5">
                {activeSubject === 'math' && <MathLab canEdit={canEdit} activeGrade={activeGradeTier} />}
                {activeSubject === 'english' && <EnglishMastery canEdit={canEdit} activeGrade={activeGradeTier} />}
                {activeSubject === 'science' && <DiscoveryLab canEdit={canEdit} activeGrade={activeGradeTier} />}
            </div>

            <style jsx global>{`
                .math-container { max-width: 100%; overflow-x: auto; overflow-y: hidden; }
                .katex-display { margin: 0 !important; }
            `}</style>
        </div>
    );
}

