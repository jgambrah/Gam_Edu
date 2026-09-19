

'use client';

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';
import { collection, query, where, orderBy, serverTimestamp, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { 
  Sigma, Languages, Microscope, BookOpen, 
  Rocket, Wand2, PenTool, Loader2, Save, Trash2, Library, Brain, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Atom as AtomIcon, Languages as LanguagesIcon, Sigma as SigmaIcon,
  Folder, FileText, ChevronRight, ChevronLeft, GraduationCap, Lock, Star,
  Search, Filter, Compass, Award, FileSpreadsheet, Layers, SlidersHorizontal, RotateCcw, Clock, Bookmark, ListChecks, Send, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { QuestionRunner } from '@/components/curriculum/QuestionRunner';
import { DispatchAssignmentModal } from '@/components/academy/director/DispatchAssignmentModal';
import { AssignmentMonitorView } from '@/components/academy/director/AssignmentMonitorView';
import { ExamDisclaimerTooltip, PlatformExamFooterNotice } from '@/components/exam/ExamDisclaimerNotice';
import { getTopicQuestionSets, getQuestionSetById, invalidateCurriculumCache } from '@/lib/services/curriculumService';
import { isValidCurriculumLevelId, SAMPLE_GLOBAL_QUESTION_SETS } from '@/lib/global-curriculum-service';
import { TopicalLabRunner } from '@/components/curriculum/TopicalLabRunner';
import { getSubjectTopicsManifest, getTopicalLabDoc, invalidateTopicalLabCache } from '@/lib/services/topicalLabService';
import { TopicalLabDocument } from '@/lib/topical-lab-types';
import { GlobalCurriculumLevelId, CurriculumQuestionSet } from '@/lib/global-curriculum-types';
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
    grade === 'Early Childhood' || grade === 'Lower Primary' || grade === 'Lower Primary (BS 1 - 3)';

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

type SecondaryGradeTier = 
    | 'Lower Primary (BS 1 - 3)'
    | 'Upper Primary (BS 4 - 6)'
    | 'Junior Secondary (JHS)'
    | 'Senior Secondary (SHS)';

function mapGradeTierToLevelId(tier: SecondaryGradeTier): GlobalCurriculumLevelId {
    switch (tier) {
        case 'Lower Primary (BS 1 - 3)':
            return 'lower_primary';
        case 'Upper Primary (BS 4 - 6)':
            return 'upper_primary';
        case 'Junior Secondary (JHS)':
            return 'jhs';
        case 'Senior Secondary (SHS)':
        default:
            return 'shs';
    }
}

interface SuggestedModuleCard {
    title: string;
    domain: string;
    strandName?: string;
    strandCode?: string;
    subStrand?: string;
    levelsAvailable?: string[];
    gradeTier: SecondaryGradeTier;
    meta: string;
    description: string;
    difficulty?: 'Foundation' | 'Intermediate' | 'Advanced' | 'Core' | string;
    name?: string;
    type?: string;
    paperType?: 1 | 2;
    year?: number | string;
    setNumber?: number | string;
    era?: string;
    sampleInstruction?: string;
    sampleFormula?: string;
    sampleAnswer?: string;
    content?: string;
    background?: string;
    hypothesisPrompt?: string;
    hypothesisOptions?: string[];
    conclusion?: string;
    explanation?: string;
    topicId?: string;
    setId?: string;
    kind?: 'topical' | 'exam_series';
    format?: 'objective' | 'structured_essay' | 'standard' | 'multiple_choice' | 'topical_lab';
    questionCount?: number;
    examTag?: string;
    subject?: 'Mathematics' | 'English' | 'Integrated Science' | 'Computing';
    status?: 'ready' | 'pending_content' | string;
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
        title: "WASSCE Elective Math • Paper 1 (Calculus & Core Analysis)",
        domain: "ALGEBRA",
        gradeTier: "Senior Secondary (SHS)",
        meta: "40 Questions • 60 mins • Objective Examination",
        description: "Official-standard SHS WASSCE examination series variant covering differential calculus, polynomials, matrices, and vectors.",
        difficulty: "Advanced",
        topicId: "calculus-differentiation",
        setId: "shs-math-calc-01",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • Automated Stepper",
        subject: "Mathematics",
        sampleInstruction: "Evaluate derivative f'(x) for f(x) = 2x^3 - 4x at x = 2:",
        sampleFormula: "f'(x) = 6x^2 - 4",
        sampleAnswer: "20"
    },

    // Junior Secondary (JHS) Exam Series (Standardized Past Papers & Mastery Sets)
    {
        title: "Junior Core Mathematics • Paper 1 (Objective Mastery)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Test",
        description: "Standardized 40-question objective examination variant with step-by-step worked solutions and hints.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-01",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • Automated Stepper",
        subject: "Mathematics",
        sampleInstruction: "If set A = {3, 5, 7, 11} and set B = {3, 6, 9, 12}, find A ∩ B.",
        sampleFormula: "A \\cap B = \\{3\\}",
        sampleAnswer: "{3}"
    },
    {
        title: "Junior Core Mathematics • Paper 2 (Structured Problem-Solving)",
        domain: "ALGEBRA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Essay",
        description: "Comprehensive multi-part mathematical modeling and structured essay problems with detailed worked derivations.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-02",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Essay Modules • Step-by-Step Marking Guide",
        subject: "Mathematics",
        sampleInstruction: "Evaluate (0.048 × 1.05) / 0.00012, leaving your final answer in standard form:",
        sampleFormula: "\\frac{0.048 \\times 1.05}{0.00012} = 4.2 \\times 10^2",
        sampleAnswer: "4.2 × 10²"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 3)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 3 / 2011 Variant)",
        description: "Official-standard 40-question objective examination variant (Set 3 / 2011 past paper variant) covering prime factors, base-two conversions, sets, algebraic simplification, and plane geometry with complete worked solutions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-03",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2011 Variant",
        subject: "Mathematics",
        sampleInstruction: "Which of the following represents the set of prime factors of 18?",
        sampleFormula: "18 = 2 \\times 3^2 \\implies \\{2, 3\\}",
        sampleAnswer: "{2, 3}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 4)",
        domain: "ALGEBRA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 4 / 2011 Variant)",
        description: "Official-standard 6-question structured theory examination variant (Set 4 / 2011 past paper variant) featuring SVG geometry diagrams, coordinate reflections & translations, algebraic fractions, and frequency distributions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-04",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "Solve for x in: (x + 2)/3 - (2x - 1)/4 = 1",
        sampleFormula: "\\frac{x + 2}{3} - \\frac{2x - 1}{4} = 1 \\implies 4(x + 2) - 3(2x - 1) = 12",
        sampleAnswer: "x = -0.5"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 5)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 5 / 2010 Variant)",
        description: "Standardized 40-question objective examination variant (Set 5 / 2010 past paper variant) covering well-defined sets, base-five sequences, ratio, inverse proportion, plane transformations, and probability.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-05",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2010 Variant",
        subject: "Mathematics",
        sampleInstruction: "Which of the following collections represents a well-defined set in mathematics?",
        sampleFormula: "\\{Kwame, Ama, Kofi, Abena\\}",
        sampleAnswer: "{Kwame, Ama, Kofi, Abena}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 6)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 6)",
        description: "Standardized 6-question structured theory examination variant (Set 6) featuring embedded SVG diagrams for Venn partitions, right-angled composite geometry, cuboid-to-cylinder liquid volumes, trapeziums, intersecting straight lines, and frequency distributions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-06",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "Factorize completely: (p + q)(3x - 2y) - x(p + q)",
        sampleFormula: "(p + q)(3x - 2y) - x(p + q) = 2(p + q)(x - y)",
        sampleAnswer: "2(p + q)(x - y)"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 7)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 7 / 2009 Variant)",
        description: "Standardized 40-question objective examination variant (Set 7 / 2009 past paper adaptation) with balanced option randomization covering sets, standard form, angles, linear equations, vectors, probability, and percentages.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-07",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2009 Variant",
        subject: "Mathematics",
        sampleInstruction: "Given the sets P = {2, 4, 6, 8, 10} and Q = {4, 8, 12, 16}, find P ∪ Q:",
        sampleFormula: "P \\cup Q = \\{2, 4, 6, 8, 10, 12, 16\\}",
        sampleAnswer: "{2, 4, 6, 8, 10, 12, 16}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 8)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 8 / 2009 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 8 / 2009 past paper adaptation) with embedded SVG diagrams covering standard form, composite land area, pie chart sector angles, frequency distribution statistics, coordinate plane transformations, column vectors, angle bisector theorem, and currency proportionality.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-08",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "Simplify and express in standard form: (1,400 × 1,350) / 700",
        sampleFormula: "\\frac{1,400 \\times 1,350}{700} = 2.7 \\times 10^3",
        sampleAnswer: "2.7 × 10³"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 9)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 9 / 2008 Variant)",
        description: "Standardized 40-question objective examination variant (Set 9 / 2008 past paper adaptation) with balanced option randomization covering prime factors, binary numeral conversions, linear inequalities, vectors, and plane geometry.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-09",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2008 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set P = {multiples of 3 less than 15} and Q = {even numbers less than 12}, find P ∩ Q:",
        sampleFormula: "P \\cap Q = \\{6\\}",
        sampleAnswer: "{6}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 10)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 10 / 2008 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 10 / 2008 past paper adaptation) with embedded SVG diagrams covering set operations, composite garden geometry, pie chart sector proportions, simultaneous graphs, and circumcircles.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-10",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "Calculate the total land area of agricultural station AEBCD composed of rectangle ABCD and roof triangle AEB:",
        sampleFormula: "\\text{Total Area} = 4,800\\text{ m}^2 + 960\\text{ m}^2 = 5,760\\text{ m}^2",
        sampleAnswer: "5,760 m²"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 11)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 11 / 2007 Variant)",
        description: "Standardized 40-question objective examination variant (Set 11 / 2007 past paper adaptation) with balanced option randomization covering odd factors, union of sets, terminating decimals, angles, bearings, and column vectors.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-11",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2007 Variant",
        subject: "Mathematics",
        sampleInstruction: "List the members of the set S = {x : x is an odd factor of 42}:",
        sampleFormula: "S = \\{1, 3, 7, 21\\}",
        sampleAnswer: "{1, 3, 7, 21}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 12)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 12 / 2007 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 12 / 2007 past paper adaptation) with embedded SVG diagrams covering set complements, parallel line transversals, 3D liquid cuboid-to-cylinder transfer, test mark distributions, and Cartesian transformations.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-12",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "Calculate the height h of water when a full cuboid container (8 cm × 7 cm × 22 cm) is poured into a cylinder of diameter 14 cm:",
        sampleFormula: "154h = 1,232 \\implies h = 8\\text{ cm}",
        sampleAnswer: "8 cm"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 13)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 13 / 2006 Variant)",
        description: "Standardized 40-question objective examination variant (Set 13 / 2006 past paper adaptation) with balanced option randomization covering set intersections, integer intervals, algebraic fractions, circle circumferences, prime factors, and bearings.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-13",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2006 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set A = {2, 4, 6, 8, 10, 12, 14} and set B = {2, 3, 5, 7, 11, 13}, find A ∩ B:",
        sampleFormula: "A \\cap B = \\{2\\}",
        sampleAnswer: "{2}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 14)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 14 / 2006 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 14 / 2006 past paper adaptation) with embedded SVG diagrams covering commercial profit markup, ratio demographics, right-angled triangles with trigonometry, linear mapping graphs, family age averages, and grade distribution pie charts.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-14",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "In right-angled triangle XYZ with hypotenuse 13 cm and base 12 cm, calculate height |YZ| and area:",
        sampleFormula: "|YZ| = \\sqrt{13^2 - 12^2} = 5\\text{ cm}, \\quad \\text{Area} = 30\\text{ cm}^2",
        sampleAnswer: "5 cm, 30 cm²"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 15)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 15 / 2005 Variant)",
        description: "Standardized 40-question objective examination variant (Set 15 / 2005 past paper adaptation) with balanced option randomization covering Venn set elements, decimal arithmetic, factors, exponents, linear mappings, circle area, and vector operations.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-15",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2005 Variant",
        subject: "Mathematics",
        sampleInstruction: "In a Venn diagram, Q only has 4 elements and P ∩ Q has 2 elements. Find n(Q):",
        sampleFormula: "n(Q) = 4 + 2 = 6",
        sampleAnswer: "6"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 16)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 16 / 2005 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 16 / 2005 past paper adaptation) with embedded SVG diagrams covering proportional purchasing, circle radii, linear supplementary relations, sports Venn diagrams, geometric rhombus/kite diagonals, and discrete frequency distributions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-16",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "In rhombus ACBD with base AB = 12 cm and perpendicular diagonals bisecting at P (CP = PD = 8 cm), calculate side |AC| and total area:",
        sampleFormula: "|AC| = \\sqrt{6^2 + 8^2} = 10\\text{ cm}, \\quad \\text{Area} = 96\\text{ cm}^2",
        sampleAnswer: "10 cm, 96 cm²"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 17)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 17 / 2004 Variant)",
        description: "Standardized 40-question objective examination variant (Set 17 / 2004 past paper adaptation) with balanced option randomization covering set unions, cuboid geometry, decimal division, angles of revolution, prime sequences, and linear inequalities.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-17",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2004 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set P = {1, 3, 5, 7, 9} and set Q = {3, 6, 9}, find n(P ∪ Q):",
        sampleFormula: "P \\cup Q = \\{1, 3, 5, 6, 7, 9\\} \\implies n(P \\cup Q) = 6",
        sampleAnswer: "6"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 18)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 18 / 2004 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 18 / 2004 past paper adaptation) with embedded SVG diagrams covering algebraic factorization, rational formula inversion, 3D closed liquid tanks, linear inequalities, vector parallelogram translations, and discrete bar chart statistics.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-18",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "A closed rectangular tank (70 cm × 40 cm × 50 cm) has 84,000 cm³ of water poured in. Calculate total surface area and depth d:",
        sampleFormula: "\\text{TSA} = 2(lw + lh + wh) = 16,600\\text{ cm}^2, \\quad d = \\frac{84,000}{2,800} = 30\\text{ cm}",
        sampleAnswer: "16,600 cm², 30 cm"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 19)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 19 / 2003 Variant)",
        description: "Standardized 40-question objective examination variant (Set 19 / 2003 past paper adaptation) with balanced option randomization covering set descriptions, integer midpoints, prime factor products, commission and profit, right-angled triangles, and geometric loci.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-19",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2003 Variant",
        subject: "Mathematics",
        sampleInstruction: "Which of the following descriptions best defines the set S = {4, 8, 12, 16, 20}?",
        sampleFormula: "S = \\{x : x \\text{ is a multiple of } 4 \\text{ less than } 24\\}",
        sampleAnswer: "The set of multiples of 4 less than 24"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 20)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "5 Multi-Part Problems • 60 mins • Structured Theory (Set 20 / 2003 Variant)",
        description: "Standardized 5-question structured theory examination variant (Set 20 / 2003 past paper adaptation) with embedded SVG diagrams covering Venn diagram partitions, standard form division, inverse sharing, nursery age frequency statistics, sheet-metal cylinder volumes, and isosceles/rhombus constructions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-20",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 5,
        examTag: "5 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "A rectangular sheet of metal (44 cm × 14 cm) is rolled into a cylinder of height 14 cm. Calculate base radius r and volume V:",
        sampleFormula: "2\\pi r = 44 \\implies r = 7\\text{ cm}, \\quad V = \\pi r^2 h = 2,156\\text{ cm}^3",
        sampleAnswer: "7 cm, 2,156 cm³"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 21)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 21 / 2002 Variant)",
        description: "Standardized 40-question objective examination variant (Set 21 / 2002 past paper adaptation) with balanced option randomization covering base number addition, fraction comparisons, sequence patterns, speed conversion, enlargements, and geometric perimeter & volume.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-21",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2002 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set S = {multiples of 5 less than 25}, find set S:",
        sampleFormula: "S = \\{5, 10, 15, 20\\}",
        sampleAnswer: "{5, 10, 15, 20}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 22)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 22 / 2002 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 22 / 2002 past paper adaptation) with embedded SVG diagrams covering Venn diagram set modeling, right-angled shadow trigonometry, Cartesian reflections & translations, discrete frequency distributions, and linear relation tables.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-22",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "A vertical tower BT (height 8 m) casts a horizontal shadow AB of length 15 m. Calculate straight-line distance L and tan θ:",
        sampleFormula: "L = \\sqrt{15^2 + 8^2} = 17\\text{ m}, \\quad \\tan \\theta = \\frac{8}{15}",
        sampleAnswer: "17 m, 8/15"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 23)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 23 / 2001 Variant)",
        description: "Standardized 40-question objective examination variant (Set 23 / 2001 past paper adaptation) with balanced option randomization covering set intersections, decimal multiplication, base five conversions, algebraic factorizations, and linear mappings.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-23",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2001 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set P = {2, 3, 5, 7, 11, 13} and set Q = {1, 3, 5, 7, 9, 11, 13}, find the number of elements in P ∩ Q:",
        sampleFormula: "P \\cap Q = \\{3, 5, 7, 11, 13\\} \\implies n(P \\cap Q) = 5",
        sampleAnswer: "5"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 24)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 24 / 2001 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 24 / 2001 past paper adaptation) with embedded SVG diagrams covering dual-subject examination Venn sets, linear simultaneous relations, commercial sales profit & daily wage rates, vector operations & translations, triangle constructions, and discrete frequency distributions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-24",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "From the simultaneous relation graph for y₁ = 2x + 1 and y₂ = 1 - x, determine the point of intersection and gradient:",
        sampleFormula: "2x + 1 = 1 - x \\implies x = 0, y = 1, \\quad m = 2",
        sampleAnswer: "(0, 1), 2"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 25)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 25 / 2000 Variant)",
        description: "Standardized 40-question objective examination variant (Set 25 / 2000 past paper adaptation) with balanced option randomization covering set intersections, decimal multiplication, prime factor index notation, base five conversions, algebraic equations, and geometric symmetries.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-25",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 2000 Variant",
        subject: "Mathematics",
        sampleInstruction: "Given sets P = {2, 3, 5, 7} and Q = {1, 3, 5, 7, 9}, find P ∩ Q:",
        sampleFormula: "P \\cap Q = \\{3, 5, 7\\}",
        sampleAnswer: "{3, 5, 7}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 26)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 26 / 2000 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 26 / 2000 past paper adaptation) with embedded SVG diagrams covering crop harvest sector pie charts, linear functional coordinate graphing, open rectangular storage bin surface areas & liquid capacity, trapezoidal farmland boundary surveying, and Cartesian reflection planes.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-26",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "An open rectangular storage bin (60 cm × 35 cm × 40 cm) has no lid. Calculate the total surface area and capacity in litres:",
        sampleFormula: "\\text{TSA} = lw + 2(lh + wh) = 9,700\\text{ cm}^2, \\quad V = \\frac{84,000}{1,000} = 84\\text{ litres}",
        sampleAnswer: "9,700 cm², 84 litres"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 27)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 27 / 1999 Variant)",
        description: "Standardized 40-question objective examination variant (Set 27 / 1999 past paper adaptation) with balanced option randomization covering set operations, decimal division, LCM/indices, linear equations, percentages, geometry, and vector algebra.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-27",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1999 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set A = {factors of 18} and set B = {multiples of 3 less than 15}, find A ∩ B:",
        sampleFormula: "A \\cap B = \\{3, 6, 9\\}",
        sampleAnswer: "{3, 6, 9}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 28)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 28 / 1999 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 28 / 1999 past paper adaptation) with embedded SVG diagrams covering cliff elevation survey trigonometry, simultaneous graphing intersections, Cartesian reflection & vector translation planes, and discrete test mark frequency bar charts.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-28",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "From an observation post P on horizontal ground 24 m from a 10 m cliff QR, find the distance PR and tan θ:",
        sampleFormula: "|PR|^2 = 24^2 + 10^2 = 676 \\implies |PR| = 26\\text{ m}, \\quad \\tan \\theta = \\frac{5}{12}",
        sampleAnswer: "26 m, 5/12"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 29)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 29 / 1998 Variant)",
        description: "Standardized 40-question objective examination variant (Set 29 / 1998 past paper adaptation) with balanced option randomization covering set operations, decimals, LCM & prime factors, linear equations, percentages, geometry, and column vectors.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-29",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1998 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set P = {multiples of 4, 1 < x < 25} and set Q = {factors of 24}, find P ∩ Q:",
        sampleFormula: "P \\cap Q = \\{4, 8, 12, 24\\}",
        sampleAnswer: "{4, 8, 12, 24}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 30)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 30 / 1998 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 30 / 1998 past paper adaptation) with embedded SVG diagrams covering Venn diagram modeling, commercial discount & simple interest, utility shadow trigonometry, simultaneous linear intersections, cylindrical capacity, and quiz score frequency bar charts.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-30",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "In a class of 50 students, 32 passed English, 28 passed Math, and 6 failed both. Find the number who passed both:",
        sampleFormula: "(32 - x) + x + (28 - x) + 6 = 50 \\implies 66 - x = 50 \\implies x = 16",
        sampleAnswer: "16 students"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 31)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 31 / 1997 Variant)",
        description: "Standardized 40-question objective examination variant (Set 31 / 1997 past paper adaptation) with balanced option randomization covering set operations, fractions, LCM & prime factors, binary conversion, linear equations, percentages, circle area, and column vectors.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-31",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1997 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set M = {multiples of 3, 1 ≤ x ≤ 18} and set N = {even factors of 24}, find M ∩ N:",
        sampleFormula: "M \\cap N = \\{6, 12\\}",
        sampleAnswer: "{6, 12}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 32)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 32 / 1997 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 32 / 1997 past paper adaptation) with embedded SVG diagrams covering Biology/Chemistry Venn modeling, ratio profit sharing & simple interest, radio mast elevation Pythagoras, simultaneous linear intersection graphs, rectangular reservoir water volume, and discrete frequency test bar charts.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-32",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "In a cohort of 48 senior science students, 30 offer Biology, 26 offer Chemistry, and 4 offer neither. Find the number who offer both:",
        sampleFormula: "(30 - x) + x + (26 - x) + 4 = 48 \\implies 60 - x = 48 \\implies x = 12",
        sampleAnswer: "12 students"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 33)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 33 / 1996 Variant)",
        description: "Standardized 40-question objective examination variant (Set 33 / 1996 past paper adaptation) with balanced option randomization covering prime factor intersections, decimal operations, LCM & index notation, base five conversions, percentage profit, circle circumference, and vector operations.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-33",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1996 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set P = {x : x is a prime factor of 30} and set Q = {x : x is an odd number, 1 ≤ x ≤ 9}, find P ∩ Q:",
        sampleFormula: "P \\cap Q = \\{3, 5\\}",
        sampleAnswer: "{3, 5}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 34)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 34 / 1996 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 34 / 1996 past paper adaptation) with embedded SVG diagrams covering French/Music Venn modeling, partnership dividend ratio sharing & simple interest, street lighting pole shadow Pythagoras, simultaneous linear intersection graphs, rectangular reservoir water capacity, and discrete science test mark bar charts.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-34",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "In a class of 40 students, 25 study French, 22 study Music, and 3 study neither subject. Find the number of students who study both:",
        sampleFormula: "(25 - x) + x + (22 - x) + 3 = 40 \\implies 50 - x = 40 \\implies x = 10",
        sampleAnswer: "10 students"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 35)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 35 / 1995 Variant)",
        description: "Standardized 40-question objective examination variant (Set 35 / 1995 past paper adaptation) with balanced option randomization covering set intersections, decimal division, LCM & index notation, base five conversions, percentage loss, circular perimeter, and regular polygon angles.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-35",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1995 Variant",
        subject: "Mathematics",
        sampleInstruction: "If set P = {x : x is a factor of 36} and set Q = {x : x is a multiple of 4, 1 ≤ x ≤ 36}, find n(P ∩ Q):",
        sampleFormula: "P \\cap Q = \\{4, 12, 36\\} \\implies n(P \\cap Q) = 3",
        sampleAnswer: "3"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 36)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Multi-Part Problems • 60 mins • Structured Theory (Set 36 / 1995 Variant)",
        description: "Standardized 6-question structured theory examination variant (Set 36 / 1995 past paper adaptation) with embedded SVG diagrams covering History/Geography Venn modeling, investment return ratio sharing & total amount simple interest, telecommunication mast shadow Pythagoras, simultaneous linear intersection graphs, rectangular reservoir water capacity, and discrete mathematics quiz frequency bar charts.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-36",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "In a class of 42 students, 26 study History, 22 study Geography, and 4 study neither subject. Find the number of students who study both:",
        sampleFormula: "(26 - x) + x + (22 - x) + 4 = 42 \\implies 52 - x = 42 \\implies x = 10",
        sampleAnswer: "10 students"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 37)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 37 / 1994 Variant)",
        description: "Standardized 40-question objective examination variant (Set 37 / 1994 past paper adaptation) with balanced option randomization covering factors of whole numbers, disjoint set relations, age word problems, line symmetry, primes, inequalities, simple interest, variable subject change, difference of two squares, and probability.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-37",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1994 Variant",
        subject: "Mathematics",
        sampleInstruction: "Which of the following represents the complete set of factors of 18?",
        sampleFormula: "\\{1, 2, 3, 6, 9, 18\\}",
        sampleAnswer: "{1, 2, 3, 6, 9, 18}"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 38)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "5 Multi-Part Problems • 60 mins • Structured Theory (Set 38 / 1994 Variant)",
        description: "Standardized 5-question structured theory examination variant (Set 38 / 1994 past paper adaptation) with embedded SVG diagrams covering binomial expansions, inequality modeling & vectors, ladder incline trigonometry & constant evaluation, compass right-angled isosceles triangle construction, Cartesian square transformations, and commercial canteen soft drink sales pie charting.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-38",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 5,
        examTag: "5 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "A ladder of length L touches a wall at height 16 m while resting 12 m away from the wall base. Calculate L:",
        sampleFormula: "L^2 = 12^2 + 16^2 = 144 + 256 = 400 \\implies L = 20\\text{ m}",
        sampleAnswer: "20 m"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 39)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 39 / 1993 Variant)",
        description: "Standardized 40-question objective examination variant (Set 39 / 1993 past paper adaptation) with balanced option randomization covering binomial expansion, binary subtraction, inequalities on finite sets, lines of symmetry, HCF/LCM, rational formula subject change, simple interest, goals distribution tables, and Pythagorean triples.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-39",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1993 Variant",
        subject: "Mathematics",
        sampleInstruction: "Expand and simplify completely: (3x + 2y)(2x + y)",
        sampleFormula: "(3x + 2y)(2x + y) = 6x^2 + 7xy + 2y^2",
        sampleAnswer: "6x^2 + 7xy + 2y^2"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 40)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "5 Multi-Part Problems • 60 mins • Structured Theory (Set 40 / 1993 Variant)",
        description: "Standardized 5-question structured theory examination variant (Set 40 / 1993 past paper adaptation) with embedded SVG diagrams covering rational fraction simplification & linear equations, geometric compass triangle construction & angle bisectors, commercial equipment depreciation & percentage profit, Cartesian coordinate slope & intersection graphing, and discrete frequency age distribution bar charting.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-40",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 5,
        examTag: "5 Structured Problems • Step-by-Step Marking Rubric",
        subject: "Mathematics",
        sampleInstruction: "Points A(-2, 3) and B(4, -3) lie on the Cartesian plane. Calculate the gradient m of AB:",
        sampleFormula: "m = \\frac{-3 - 3}{4 - (-2)} = \\frac{-6}{6} = -1",
        sampleAnswer: "-1"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 41)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Objective Examination (Set 41 / 1992 Variant)",
        description: "Standardized 40-question objective examination variant (Set 41 / 1992 past paper adaptation) with balanced option randomization covering prime factors, two-set Venn cardinalities, square root of decimals, base ten to five conversions, simple interest, displacement vectors & magnitudes, right-angled trigonometry (tanθ), and pie chart sector angles.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-41",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • BECE 1992 Variant",
        subject: "Mathematics",
        sampleInstruction: "Find the displacement vector PQ from point P(1, 4) to point Q(5, -2):",
        sampleFormula: "\\vec{PQ} = \\begin{pmatrix} 5 - 1 \\\\ -2 - 4 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -6 \\end{pmatrix}",
        sampleAnswer: "(4, -6)ᵀ"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 42)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "5 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-42",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 5,
        examTag: "5 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 43)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-43",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 44)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-44",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 4,
        examTag: "4 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 45)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-45",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 46)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "4 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-46",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 4,
        examTag: "4 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 47)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-47",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 48)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-48",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 49)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-49",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 50)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-50",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 51)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-51",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 52)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-52",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 53)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-53",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 54)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-54",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 55)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Comprehensive Objective Exam Series",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-55",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 56)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-56",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 57)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Structured Theory, Geometry & Data Modeling",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-57",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Objective Mastery Series (Set 58)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Standardized 40-question objective examination variant (Set 58 / 2024 past paper variant) covering real numbers, ratios, sets, quantitative data, linear equations, loci, and plane trigonometry.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-58",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 59)",
        domain: "GEOMETRY & DATA",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions • 60 mins • Mastery Series",
        description: "Standardized 6-question structured theory examination variant (Set 59 / 2024 past paper variant) featuring 3x3 magic squares, compass geometric constructions, triangle similarity enlargements, and Fahrenheit-Celsius temperature conversion graphs with step-by-step marking rubrics.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-59",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics — Objective Mastery Series (Set 60)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Mastery Series",
        description: "Standardized 40-question objective examination variant (Set 60 / 2020 BECE variant) featuring fraction simplification, set intersections, number line inequalities, isosceles triangles, expenditure pie charts, and quadratic mappings with full solutions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-60",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions • Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Structured Problem-Solving Series (Set 61)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions - 60 mins - Mastery Series",
        description: "Official 6-question structured theory examination variant (Set 61 / 2020 BECE variant) featuring set operations, BODMAS, straight-line angles, gradient/intercept from linear forms, textbook commission arithmetic, cylinder-to-rectangular tank water volume transfer, difference of two squares, and linear coordinate graph plotting with step-by-step marking rubrics.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-61",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions - Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Objective Mastery Series (Set 62)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions - 60 mins - Mastery Series",
        description: "Official 40-question objective examination variant (Set 62 / 2021 BECE variant) featuring set cardinality intersections, equal sets, significant figures, rotation transformations, quadratic sequences, scale map conversions, parallel lines with transversals, and probability with full step-by-step solutions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-62",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions - Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Structured Problem-Solving Series (Set 63)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions - 60 mins - Mastery Series",
        description: "Official 6-question structured theory examination variant (Set 63 / 2021 BECE variant) featuring intersecting Venn diagrams, index laws, grouping factorization, rational cross-multiplication, column vector subtraction, conference hall floor tiling, linear mappings, travel time/distance, circle center angles, brochure cost functions, and complete frequency tables with mode and mean.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-63",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions - Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Objective Mastery Series (Set 64)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions - 60 mins - Mastery Series",
        description: "Official 40-question objective examination variant (Set 64 / 2025 BECE variant) featuring simple interest time periods, binomial expansion, area enlargement factors, grouping factorization, percentage savings and storage, linear inequalities with responsive SVG number lines, cuboid liquid volumes, and composite means with complete step-by-step solutions.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-64",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions - Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Structured Problem-Solving Series (Set 65)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions - 60 mins - Mastery Series",
        description: "Official 6-question structured theory examination variant (Set 65 / 2025 BECE variant) featuring universal set subsets, subject change relations, standard form quotients, residential and commercial commission, column vector linear combinations and magnitude, reservoir water usage percentages, 9-month simple interest loans, cocoa farmland division, provisions pie chart analysis, and complete distance-time graph interpretation with rest periods.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-65",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions - Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Standard Objective Series (Set 66)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions - 60 mins - Mastery Series",
        description: "Official 40-question objective examination variant (Set 66 / 2019 BECE variant) featuring set unions, standard form exponents, integer ordering, significant figures, index laws, lines of symmetry, linear equations, 4-term grouping, fraction of subgroup, percentages to fractions, subject change, dataset means, linear mapping rules, parallelogram perimeters, cuboid tank volume, back bearings, linear inequalities, line gradients, ratio proportions, isosceles triangles, direct speed calculations, prime probabilities, fraction to decimal conversions, circle circumference and diameter, word problems, transversal alternate angles, column vector addition, unit rate arithmetic, prime factorizations, monomial expansions, integer multiplication, scientific decimal operations, population differences, time percentages, LCM, simple interest rate, medians, and Venn diagrams.",
        difficulty: "Core",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-66",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Questions - Timed CBT",
        subject: "Mathematics"
    },
    {
        title: "Junior Core Mathematics - Structured Problem-Solving Series (Set 67)",
        domain: "CORE CURRICULUM",
        gradeTier: "Junior Secondary (JHS)",
        meta: "6 Questions - 60 mins - Mastery Series",
        description: "Official 6-question structured theory examination variant (Set 67 / 2019 BECE variant) featuring finite set intersection, LCM prime decomposition, rational algebraic ratio evaluation, linear fraction equations, school enrolment ratios, monomial product simplification, Venn diagram examination passes, 4-term grouping factorization, percentage conversion to mixed fractions, triangle exterior base angles, multi-step fraction division, column vector addition, Cartesian graph plotting (scale 2 cm to 1 unit and 2 cm to 2 units), line equation derivation, product of powers of 2, and ungrouped frequency distribution tables with mode, median, and mean.",
        difficulty: "Advanced",
        topicId: "core_curriculum_mastery",
        setId: "jhs-math-mastery-series-67",
        kind: "exam_series",
        format: "structured_essay",
        questionCount: 6,
        examTag: "6 Questions - Live Stepper",
        subject: "Mathematics"
    },
    {
        title: "BECE 2012 Mathematics Paper 1 (Exam Variant Mastery)",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 60 mins • Past Paper Variant",
        description: "Full BECE standard past paper variant with 40 syllabus-aligned objective questions and instant step-by-step verification.",
        difficulty: "Advanced",
        topicId: "bece_past_papers",
        setId: "jhs-math-2012-paper1",
        kind: "exam_series",
        format: "objective",
        questionCount: 40,
        examTag: "40 Objective Questions • Automated Stepper",
        subject: "Mathematics",
        sampleInstruction: "If set A = {3, 5, 7, 11} and set B = {3, 6, 9, 12}, find A ∩ B.",
        sampleFormula: "A \\cap B = \\{3\\}",
        sampleAnswer: "{3}"
    },

    // Upper Primary (BS 4 - 6)
    {
        title: "Fractions, Decimals & Percentages",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "5 Units • 40 mins",
        description: "Equivalence between fractions, decimal place values, and percentage conversions with visual models.",
        difficulty: "Intermediate",
        sampleInstruction: "Convert the fraction to a percentage value (%):",
        sampleFormula: "\\frac{3}{4} \\times 100",
        sampleAnswer: "75"
    },
    {
        title: "Perimeter, Area & 2D Shapes",
        domain: "GEOMETRY & TRIGONOMETRY",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "4 Units • 35 mins",
        description: "Calculate area and perimeter of composite rectangles, triangles, and parallelograms.",
        difficulty: "Intermediate",
        sampleInstruction: "Calculate the area of a rectangle with length 8cm and width 5cm:",
        sampleFormula: "A = 8 \\times 5",
        sampleAnswer: "40"
    },
    {
        title: "Factors, Multiples & Prime Numbers",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "4 Units • 35 mins",
        description: "Prime factorization trees, Greatest Common Factor (GCF), and Least Common Multiple (LCM).",
        difficulty: "Intermediate",
        sampleInstruction: "Find the Least Common Multiple (LCM) of 4 and 6:",
        sampleFormula: "\\text{LCM}(4, 6) = 12",
        sampleAnswer: "12"
    },
    {
        title: "Coordinate Grids & Basic Linear Patterns",
        domain: "ALGEBRA",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "3 Units • 30 mins",
        description: "Plot (x, y) coordinates in Quadrant 1, identify horizontal and vertical line patterns, and input-output rules.",
        difficulty: "Foundation",
        sampleInstruction: "Find the missing term in the sequence: 3, 7, 11, __:",
        sampleFormula: "11 + 4 = ?",
        sampleAnswer: "15"
    },

    // Lower Primary (BS 1 - 3)
    {
        title: "Visual Number Blocks & Addition Facts",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "4 Units • 25 mins",
        description: "Base-10 block counting, number bonds up to 20, and single-digit addition jumps.",
        difficulty: "Foundation",
        sampleInstruction: "Count and add the visual blocks:",
        sampleFormula: "7 + 5 = ?",
        sampleAnswer: "12"
    },
    {
        title: "2D Shapes, Patterns & Symmetry",
        domain: "GEOMETRY & TRIGONOMETRY",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "3 Units • 20 mins",
        description: "Identify circles, squares, triangles, line symmetry, and repeating color/shape sequences.",
        difficulty: "Foundation",
        sampleInstruction: "How many corners (vertices) does a triangle have?",
        sampleFormula: "\\text{Vertices of } \\Delta = ?",
        sampleAnswer: "3"
    },
    {
        title: "Money, Coins & Basic Change",
        domain: "ARITHMETIC & NUMERACY",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "3 Units • 25 mins",
        description: "Recognize currency denominations, tally coin amounts, and calculate simple market change.",
        difficulty: "Foundation",
        sampleInstruction: "You buy an apple for $3 with a $10 bill. How much change do you receive?",
        sampleFormula: "10 - 3 = ?",
        sampleAnswer: "7"
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
    },

    // Upper Primary (BS 4 - 6)
    {
        title: "Reading Comprehension & Context Clues",
        domain: "NARRATIVE & COMPREHENSION",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "4 Modules • 35 mins",
        description: "Decipher unfamiliar vocabulary using surrounding context clues, summary statements, and main idea deductions.",
        difficulty: "Intermediate",
        sampleInstruction: "Determine the meaning of 'tenacious' from the context provided.",
        sampleAnswer: "Determined",
        content: "Despite the howling blizzard and steep cliffs, the tenacious mountaineer refused to turn back before reaching the summit."
    },
    {
        title: "Persuasive Writing & Opinion Speeches",
        domain: "RHETORIC & ESSAYS",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "3 Modules • 30 mins",
        description: "Draft clear thesis statements, structure reason paragraphs, and conclude with powerful calls to action.",
        difficulty: "Intermediate",
        sampleInstruction: "Identify the supporting reason given in the passage.",
        sampleAnswer: "Environmental protection",
        content: "Trees in our schoolyard provide shade and clean air for everyone. Therefore, every student should participate in planting a sapling this term."
    },
    {
        title: "Figurative Language, Similes & Metaphors",
        domain: "LITERATURE & POETRY",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "3 Modules • 30 mins",
        description: "Recognize similes, metaphors, hyperbole, and idioms in poems and descriptive story writing.",
        difficulty: "Foundation",
        sampleInstruction: "Identify whether the phrase 'as quiet as a whisper' is a simile or metaphor.",
        sampleAnswer: "Simile",
        content: "The library was as quiet as a whisper, with only the gentle rustling of pages turning in the afternoon light."
    },

    // Lower Primary (BS 1 - 3)
    {
        title: "Phonics, Vowel Blends & Rhyming Pairs",
        domain: "NARRATIVE & COMPREHENSION",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "3 Modules • 20 mins",
        description: "Listen for vowel digraphs (ee, oa, ai), identify rhyming pairs, and match sound patterns.",
        difficulty: "Foundation",
        sampleInstruction: "Which word rhymes with 'bright' in the story sentence?",
        sampleAnswer: "Night",
        content: "The stars shone bright through the dark of night, guiding the little owl safely to its nest."
    },
    {
        title: "Sight Words & Expressive Story Sentences",
        domain: "LITERATURE & POETRY",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "3 Modules • 20 mins",
        description: "High-frequency sight words, capitalization, punctuation, and expressive character dialogue.",
        difficulty: "Foundation",
        sampleInstruction: "Find the high-frequency sight word connecting the characters.",
        sampleAnswer: "Together",
        content: "Sam and Leo walked together to the playground, smiling as they saw their friends waving."
    }
];

const SUGGESTED_SCIENCE_MODULES: SuggestedModuleCard[] = [
    // NaCCA CCP Integrated Science Discovery Assessment Series (B7 - B9)
    {
        title: "NaCCA Integrated Science CCP Preparatory CBT Exam (Set 70)",
        domain: "DIVERSITY OF MATTER & CYCLES",
        strandName: "STRAND 1 & STRAND 2",
        strandCode: "S1/S2",
        subStrand: "50-Item Preparatory Assessment Blueprint",
        gradeTier: "Junior Secondary (JHS)",
        meta: "50 CBT Questions • 60 mins • Live Stepper",
        description: "Official 50-item balanced preparatory examination covering all 5 NaCCA strands with instant grading, vector SVG diagrams, and KaTeX equations.",
        difficulty: "Core",
        kind: "exam_series",
        setId: "paper_nacca_sample_variant_p1",
        topicId: "nacca_preparatory_blueprint",
        format: "objective",
        paperType: 1,
        year: 2024,
        setNumber: 70,
        era: "NaCCA Common Core Programme (CCP)",
        questionCount: 50,
        examTag: "50 CBT Questions • Official Blueprint",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "NaCCA Integrated Science CCP Practical & Theory Exam (Set 71)",
        domain: "SYSTEMS & FORCES AND ENERGY",
        strandName: "STRAND 3 & STRAND 4",
        strandCode: "S3/S4",
        subStrand: "Practical Science Labs & Core Theory",
        gradeTier: "Junior Secondary (JHS)",
        meta: "5 Structured Questions • 105 mins • Full Rubrics",
        description: "Section A compulsory practical tests (cells, levers, soil permeability, diode circuits) + Section B theory essay questions with AI rubrics.",
        difficulty: "Advanced",
        kind: "exam_series",
        setId: "paper_nacca_sample_variant_p2",
        topicId: "nacca_preparatory_blueprint",
        format: "structured_essay",
        paperType: 2,
        year: 2024,
        setNumber: 71,
        era: "NaCCA Common Core Programme (CCP)",
        questionCount: 5,
        examTag: "Practical & Theory • Section A Compulsory",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "2026 BECE Integrated Science Paper 1 (Set 72 Objective)",
        domain: "DIVERSITY OF MATTER & CYCLES",
        strandName: "STRAND 1 TO STRAND 5",
        strandCode: "S1-S5",
        subStrand: "2026 BECE Integrated Science Blueprint & Standardized CBT",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 45 mins • Objective Test",
        description: "Standardized 40-question objective examination variant with KaTeX equations, vector SVGs, and step-by-step worked solutions for 2026 BECE candidates.",
        difficulty: "Advanced",
        kind: "exam_series",
        setId: "paper_2026_variant",
        topicId: "bece_past_papers",
        format: "objective",
        paperType: 1,
        year: 2026,
        setNumber: 72,
        era: "modern",
        questionCount: 40,
        examTag: "40 Objective Questions • Balanced Key Distribution",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "2026 BECE Integrated Science Paper 2 (Set 73 Practical & Theory)",
        domain: "SCIENTIFIC INQUIRY & PRACTICAL LABS",
        strandName: "STRAND 1 TO STRAND 5",
        strandCode: "S1-S5",
        subStrand: "2026 BECE Practical & Theory Essay Examination",
        gradeTier: "Junior Secondary (JHS)",
        meta: "Section A + Section B • 105 mins • 100 Marks",
        description: "Standardized 5-question practical and theory essay examination variant featuring Section A compulsory laboratory tests (farm animals, respiratory system, Ohm's law, pH colorimetric analysis) and Section B theory essays.",
        difficulty: "Advanced",
        kind: "exam_series",
        setId: "paper_2026_variant_p2",
        topicId: "bece_past_papers",
        format: "structured_essay",
        paperType: 2,
        year: 2026,
        setNumber: 73,
        era: "modern",
        questionCount: 5,
        examTag: "Practical & Theory • Section A Compulsory",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "2014 BECE Integrated Science Paper 1 (Set 74 Objective)",
        domain: "DIVERSITY OF MATTER & CYCLES",
        strandName: "STRAND 1 TO STRAND 5",
        strandCode: "S1-S5",
        subStrand: "2014 BECE Integrated Science Standardized CBT",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 45 mins • Objective Test",
        description: "Standardized 40-question objective examination variant with KaTeX equations, vector SVGs, and step-by-step worked solutions for 2014 BECE candidates.",
        difficulty: "Intermediate",
        kind: "exam_series",
        setId: "paper_2014_variant",
        topicId: "bece_past_papers",
        format: "objective",
        paperType: 1,
        year: 2014,
        setNumber: 74,
        era: "legacy",
        questionCount: 40,
        examTag: "40 Objective Questions • Balanced Key Distribution",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "2014 BECE Integrated Science Paper 2 (Set 75 Practical & Theory)",
        domain: "SCIENTIFIC INQUIRY & PRACTICAL LABS",
        strandName: "STRAND 1 TO STRAND 5",
        strandCode: "S1-S5",
        subStrand: "2014 BECE Practical & Theory Essay Examination",
        gradeTier: "Junior Secondary (JHS)",
        meta: "Section A + Section B • 75 mins • 100 Marks",
        description: "Standardized 6-question practical and theory essay examination variant featuring Section A compulsory laboratory tests (mosquito life cycle, separation setups, measuring instruments, avian digestive tract) and Section B theory essays.",
        difficulty: "Advanced",
        kind: "exam_series",
        setId: "paper_2014_variant_p2",
        topicId: "bece_past_papers",
        format: "structured_essay",
        paperType: 2,
        year: 2014,
        setNumber: 75,
        era: "legacy",
        questionCount: 6,
        examTag: "Practical & Theory • Section A Compulsory",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "2015 BECE Integrated Science Paper 1 (Set 76 Objective)",
        domain: "DIVERSITY OF MATTER & CYCLES",
        strandName: "STRAND 1 TO STRAND 5",
        strandCode: "S1-S5",
        subStrand: "2015 BECE Integrated Science Standardized CBT",
        gradeTier: "Junior Secondary (JHS)",
        meta: "40 Questions • 45 mins • Objective Test",
        description: "Standardized 40-question objective examination variant with KaTeX equations, vector SVGs, and step-by-step worked solutions for 2015 BECE candidates.",
        difficulty: "Intermediate",
        kind: "exam_series",
        setId: "paper_2015_variant",
        topicId: "bece_past_papers",
        format: "objective",
        paperType: 1,
        year: 2015,
        setNumber: 76,
        era: "legacy",
        questionCount: 40,
        examTag: "40 Objective Questions • Balanced Key Distribution",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "2015 BECE Integrated Science Paper 2 (Set 77 Practical & Theory)",
        domain: "SCIENTIFIC INQUIRY & PRACTICAL LABS",
        strandName: "STRAND 1 TO STRAND 5",
        strandCode: "S1-S5",
        subStrand: "2015 BECE Practical & Theory Essay Examination",
        gradeTier: "Junior Secondary (JHS)",
        meta: "Section A + Section B • 75 mins • 100 Marks",
        description: "Standardized 6-question practical and theory essay examination variant featuring Section A compulsory laboratory tests (animal parasites, optical reflection, sodium water reactivity, seed germination physiology) and Section B theory essays.",
        difficulty: "Advanced",
        kind: "exam_series",
        setId: "paper_2015_variant_p2",
        topicId: "bece_past_papers",
        format: "structured_essay",
        paperType: 2,
        year: 2015,
        setNumber: 77,
        era: "legacy",
        questionCount: 6,
        examTag: "Practical & Theory • Section A Compulsory",
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "Living Cells & Cell Ultrastructure",
        domain: "DIVERSITY OF MATTER",
        strandName: "STRAND 1: DIVERSITY OF MATTER",
        strandCode: "S1",
        subStrand: "Living Cells",
        levelsAvailable: ["B7", "B8"],
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Labs • 40 mins • Microscopic Ultrastructure",
        description: "Investigate plant vs animal cells, organelles, prokaryotes vs eukaryotes, and cell division.",
        difficulty: "Foundation",
        kind: "topical",
        setId: "b7_strand1_cells",
        topicId: "b7_strand1_cells",
        format: "topical_lab",
        questionCount: 3,
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "Simple Machines, Levers & Mechanical Advantage",
        domain: "FORCES AND ENERGY",
        strandName: "STRAND 4: FORCES AND ENERGY",
        strandCode: "S4",
        subStrand: "Simple Machines & Levers",
        levelsAvailable: ["B7", "B8", "B9"],
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Labs • 45 mins • Vector Statics",
        description: "Calculate mechanical advantage, velocity ratio, efficiency, and classes of levers.",
        difficulty: "Intermediate",
        kind: "topical",
        setId: "b8_strand4_simple_machines",
        topicId: "b8_strand4_simple_machines",
        format: "topical_lab",
        questionCount: 3,
        subject: "Integrated Science",
        status: "ready"
    },
    {
        title: "Biogeochemical Cycles & Crop Nutrition",
        domain: "CYCLES & THE ENVIRONMENT",
        strandName: "STRAND 2: CYCLES",
        strandCode: "S2",
        subStrand: "Earth Science & Crop Production",
        levelsAvailable: ["B7", "B8", "B9"],
        gradeTier: "Junior Secondary (JHS)",
        meta: "3 Labs • 40 mins • Ecological Nitrogen Pathways",
        description: "Master the nitrogen cycle, Rhizobium symbiosis, crop rotation soil fertility, and NPK fertilizer roles.",
        difficulty: "Intermediate",
        kind: "topical",
        setId: "b9_strand2_cycles_crop_production",
        topicId: "b9_strand2_cycles_crop_production",
        format: "topical_lab",
        questionCount: 3,
        subject: "Integrated Science",
        status: "ready"
    },

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
    },

    // Upper Primary (BS 4 - 6)
    {
        title: "States of Matter & Phase Changes",
        domain: "CHEMICAL REACTIONS & MATTER",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "3 Labs • 35 mins",
        description: "Explore particle movement in solids, liquids, and gases during evaporation, condensation, and melting.",
        difficulty: "Intermediate",
        sampleInstruction: "Identify the temperature at which pure water boils under standard atmospheric pressure.",
        sampleAnswer: "100°C",
        background: "Heating particles causes them to gain thermal energy and vibrate faster, breaking intermolecular bonds.",
        hypothesisPrompt: "What happens to water particles when temperature reaches 100°C?",
        hypothesisOptions: ["They transition from liquid to gas vapor", "They freeze solid into ice", "They turn into stone"],
        conclusion: "At boiling point, thermal energy overcomes liquid cohesion, generating water vapor steam.",
        explanation: "Latent heat of vaporization separates water molecules into a gaseous phase."
    },
    {
        title: "Simple Machines, Levers & Pulleys",
        domain: "PHYSICAL SCIENCES & PHYSICS",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "4 Labs • 40 mins",
        description: "Test mechanical advantage using first, second, and third-class levers, inclined planes, and pulley wheels.",
        difficulty: "Intermediate",
        sampleInstruction: "Identify which machine reduces the effort needed to lift heavy crates vertically.",
        sampleAnswer: "Pulley",
        background: "Simple machines redistribute applied forces over greater distances to make work easier.",
        hypothesisPrompt: "How does moving the fulcrum closer to a heavy load affect the required effort?",
        hypothesisOptions: ["Effort required decreases", "Effort required increases", "No change occurs"],
        conclusion: "Shortening the load arm relative to the effort arm multiplies output mechanical advantage.",
        explanation: "Torque equilibrium (Force x Distance) ensures a smaller effort applied over a longer arm balances a heavy load."
    },
    {
        title: "Ecosystems, Food Chains & Energy Flow",
        domain: "LIFE SCIENCES & BIOLOGY",
        gradeTier: "Upper Primary (BS 4 - 6)",
        meta: "3 Labs • 35 mins",
        description: "Map primary producers, herbivores, carnivores, and apex predators across savannah and forest biomes.",
        difficulty: "Foundation",
        sampleInstruction: "Identify the primary energy source powering all photosynthetic food chains.",
        sampleAnswer: "The Sun",
        background: "Energy enters ecosystems through solar radiation and flows through successive trophic levels.",
        hypothesisPrompt: "What role do green plants play in a terrestrial food chain?",
        hypothesisOptions: ["Primary producers synthesizing glucose", "Secondary consumers hunting herbivores", "Decomposers breaking down soil"],
        conclusion: "Producers capture sunlight through photosynthesis to form the base of ecological food webs.",
        explanation: "Solar energy is converted into chemical bond energy in glucose for all downstream consumers."
    },

    // Lower Primary (BS 1 - 3)
    {
        title: "Living Things & The Five Senses",
        domain: "LIFE SCIENCES & BIOLOGY",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "3 Labs • 25 mins",
        description: "Discover how animals and humans use sight, hearing, smell, taste, and touch to explore their environment.",
        difficulty: "Foundation",
        sampleInstruction: "Which human sense organ is responsible for detecting musical sounds?",
        sampleAnswer: "Ears",
        background: "Our sense organs send signals to the brain to help us understand and safely navigate our surroundings.",
        hypothesisPrompt: "Which sense helps us identify the sweet scent of a flowering garden?",
        hypothesisOptions: ["Sense of smell (nose)", "Sense of sight (eyes)", "Sense of touch (hands)"],
        conclusion: "Olfactory receptors in the nose detect airborne scent molecules.",
        explanation: "Sensory nerves transmit fragrance signals directly to the brain."
    },
    {
        title: "Weather, Seasons & Day-Night Cycles",
        domain: "PHYSICAL SCIENCES & PHYSICS",
        gradeTier: "Lower Primary (BS 1 - 3)",
        meta: "3 Labs • 25 mins",
        description: "Observe sunny, rainy, windy, and cloudy days, and learn how Earth's rotation creates sunrise and sunset.",
        difficulty: "Foundation",
        sampleInstruction: "What celestial body illuminates our skies and brings warmth during the daytime?",
        sampleAnswer: "The Sun",
        background: "Earth's rotation on its axis causes day and night as different parts face toward or away from the Sun.",
        hypothesisPrompt: "Why does the sun appear to rise in the morning and set in the evening?",
        hypothesisOptions: ["The Earth is spinning on its axis", "The Sun is orbiting around a flat Earth", "The clouds pull the Sun down"],
        conclusion: "Planetary rotation toward the Sun creates the perception of sunrise and daylight.",
        explanation: "As Earth spins from west to east, the horizon turns into sunlight, creating the diurnal cycle."
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

function EnglishMastery({ 
    canEdit, 
    activeGrade = 'Senior Secondary (SHS)',
    tenantId,
    studentId
}: { 
    canEdit: boolean; 
    activeGrade?: SecondaryGradeTier;
    tenantId?: string;
    studentId?: string;
}) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string>('ALL DOMAINS');
    const [activeQuestionSet, setActiveQuestionSet] = useState<CurriculumQuestionSet | null>(null);
    const [activeTopicMeta, setActiveTopicMeta] = useState<{ title: string; topicId: string } | null>(null);
    const [isLoadingSet, setIsLoadingSet] = useState(false);

    const isJunior = isJuniorLevel(activeGrade);
    const isPrimary = (activeGrade as string) === 'Early Childhood' || (activeGrade as string) === 'Lower Primary' || (activeGrade as string) === 'Upper Primary';

    const handleLaunchModule = async (mod: any) => {
        const levelId = mapGradeTierToLevelId(activeGrade);
        const subjectId = 'english';
        
        let topicId = 'phonics-blends';
        const titleLower = (mod.title || '').toLowerCase();
        if (titleLower.includes('phonic') || titleLower.includes('blend') || titleLower.includes('rhym')) {
            topicId = 'phonics-blends';
        } else {
            topicId = titleLower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        setActiveTopicMeta({ title: mod.title, topicId });
        setIsLoadingSet(true);

        try {
            const sets = await getTopicQuestionSets(levelId, subjectId, topicId);
            if (sets && sets.length > 0) {
                setActiveQuestionSet(sets[0]);
            } else {
                setActiveQuestionSet(null);
            }
        } catch (e) {
            console.warn('Error loading english question set:', e);
            setActiveQuestionSet(null);
        } finally {
            setIsLoadingSet(false);
        }
    };

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
            {activeTopicMeta ? (
                isLoadingSet ? (
                    <div className="flex flex-col items-center justify-center p-16 space-y-4 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <p className="text-xs text-slate-400 font-medium">Synchronizing curriculum practice sets...</p>
                    </div>
                ) : (
                    <QuestionRunner
                        questionSet={activeQuestionSet}
                        topicTitle={activeTopicMeta.title}
                        gradeTier={activeGrade}
                        levelId={mapGradeTierToLevelId(activeGrade)}
                        subjectId="english"
                        topicId={activeTopicMeta.topicId}
                        tenantId={tenantId}
                        studentId={studentId}
                        onBack={() => {
                            setActiveTopicMeta(null);
                            setActiveQuestionSet(null);
                        }}
                    />
                )
            ) : activeStory ? (
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
                                    Curriculum Labs & Recommended Modules • {activeGrade}
                                </h3>
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
                                        onClick={() => handleLaunchModule(mod)}
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
                                                                    onClick={() => handleLaunchModule({ title: item.title || item.subTopic })}
                                                                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 text-xs text-slate-400 hover:text-indigo-300 transition-all flex items-center justify-between group cursor-pointer"
                                                                >
                                                                    <span className="truncate">{item.title}</span>
                                                                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    'ALL STRANDS',
    'STRAND 1: NUMBER',
    'STRAND 2: ALGEBRA',
    'STRAND 3: GEOMETRY & MEASUREMENT',
    'STRAND 4: HANDLING DATA'
];


interface ResolvedExamMeta {
  year: number | null;
  paperType: 1 | 2;
  era: 'modern' | 'legacy' | 'classic' | 'other';
}

function resolveExamMetadata(exam: any): ResolvedExamMeta {
  // 1. Detect Paper Type: Paper 1 (Objective/CBT) vs Paper 2 (Theory/Essay)
  let paperType: 1 | 2 = 1;
  const rawTitle = (exam.title || exam.name || '').toLowerCase();
  const format = (exam.format || exam.type || '').toLowerCase();
  const meta = (exam.meta || '').toLowerCase();
  const desc = (exam.description || '').toLowerCase();
  
  if (
    exam.paperType === 2 || 
    format.includes('essay') || 
    format.includes('theory') || 
    rawTitle.includes('paper 2') || 
    rawTitle.includes('structured') || 
    rawTitle.includes('problem-solving') ||
    meta.includes('essay') ||
    meta.includes('paper 2') ||
    desc.includes('structured essay')
  ) {
    paperType = 2;
  }

  // 2. Extract or Map Year
  let year: number | null = exam.year ? Number(exam.year) : null;

  if (!year) {
    const yearMatch = (rawTitle + ' ' + meta + ' ' + desc).match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }
  }

  // Fallback via Set Number (e.g. "Set 56" or exam.setNumber)
  let setNum: number | null = null;
  if (exam.setNumber) {
    setNum = Number(exam.setNumber);
  }
  if (!setNum) {
    const setMatch = (exam.setId || '' + ' ' + rawTitle).match(/set\s*(\d+)/i) || 
                     (exam.setId || '').match(/(?:series|set)-?(\d+)/i);
    if (setMatch) {
      setNum = parseInt(setMatch[1], 10);
    }
  }

  const setYearMap: Record<number, { year: number; paper: 1 | 2 }> = {
    // Modern Era (2019 - 2026)
    77: { year: 2015, paper: 2 },
    76: { year: 2015, paper: 1 },
    75: { year: 2014, paper: 2 },
    74: { year: 2014, paper: 1 },
    73: { year: 2026, paper: 2 },
    72: { year: 2026, paper: 1 },
    71: { year: 2024, paper: 2 },
    70: { year: 2024, paper: 1 },
    67: { year: 2019, paper: 2 },
    66: { year: 2019, paper: 1 },
    65: { year: 2025, paper: 2 },
    64: { year: 2025, paper: 1 },
    63: { year: 2021, paper: 2 },
    62: { year: 2021, paper: 1 },
    61: { year: 2020, paper: 2 },
    60: { year: 2020, paper: 1 },
    59: { year: 2024, paper: 2 },
    58: { year: 2024, paper: 1 },
    57: { year: 2022, paper: 2 },
    56: { year: 2022, paper: 1 },
    55: { year: 2023, paper: 2 },
    54: { year: 2023, paper: 1 },
    // Legacy Era 2 (2000 - 2012)
    1: { year: 2012, paper: 1 },
    2: { year: 2012, paper: 2 },
    3: { year: 2011, paper: 1 },
    4: { year: 2011, paper: 2 },
    5: { year: 2010, paper: 1 },
    6: { year: 2010, paper: 2 },
    7: { year: 2009, paper: 1 },
    8: { year: 2009, paper: 2 },
    9: { year: 2008, paper: 1 },
    10: { year: 2008, paper: 2 },
    11: { year: 2007, paper: 1 },
    12: { year: 2007, paper: 2 },
    13: { year: 2006, paper: 1 },
    14: { year: 2006, paper: 2 },
    15: { year: 2005, paper: 1 },
    16: { year: 2005, paper: 2 },
    17: { year: 2004, paper: 1 },
    18: { year: 2004, paper: 2 },
    19: { year: 2003, paper: 1 },
    20: { year: 2003, paper: 2 },
    21: { year: 2002, paper: 1 },
    22: { year: 2002, paper: 2 },
    23: { year: 2001, paper: 1 },
    24: { year: 2001, paper: 2 },
    25: { year: 2000, paper: 1 },
    26: { year: 2000, paper: 2 },
    // Classic Era (1992 - 1999)
    27: { year: 1999, paper: 1 },
    28: { year: 1999, paper: 2 },
    29: { year: 1998, paper: 1 },
    30: { year: 1998, paper: 2 },
    31: { year: 1997, paper: 1 },
    32: { year: 1997, paper: 2 },
    33: { year: 1996, paper: 1 },
    34: { year: 1996, paper: 2 },
    35: { year: 1995, paper: 1 },
    36: { year: 1995, paper: 2 },
    37: { year: 1994, paper: 1 },
    38: { year: 1994, paper: 2 },
    39: { year: 1993, paper: 1 },
    40: { year: 1993, paper: 2 },
    41: { year: 1992, paper: 1 },
    42: { year: 1992, paper: 2 }
  };

  if (setNum && setYearMap[setNum]) {
    if (!year) {
      year = setYearMap[setNum].year;
    }
    if (exam.paperType === undefined && !format.includes('essay') && !rawTitle.includes('paper 1') && !rawTitle.includes('paper 2')) {
      paperType = setYearMap[setNum].paper;
    }
  }

  // 3. Classify Era
  let era: 'modern' | 'legacy' | 'classic' | 'other' = 'other';
  if (year) {
    if (year >= 2019 && year <= 2026) era = 'modern';
    else if (year >= 2000 && year <= 2018) era = 'legacy';
    else if (year >= 1992 && year <= 1999) era = 'classic';
  } else if (setNum) {
    if (setNum >= 54) era = 'modern';
    else if (setNum >= 1 && setNum <= 26) era = 'legacy';
    else if (setNum >= 27 && setNum <= 42) era = 'classic';
  }

  return { year, paperType, era };
}
function findModuleForExam(modules: SuggestedModuleCard[], examId?: string, paperType?: string | number): SuggestedModuleCard | null {
    if (!examId) return null;
    const cleanId = examId.toLowerCase().trim();

    // 1. Exact setId match
    let match = modules.find(m => (m.setId || '').toLowerCase() === cleanId);
    if (match) return match;

    // 2. Known Catalog mapping
    const catalogMap: Record<string, { setNum: number; paper?: number; year?: number }> = {
        'paper_nacca_sample_variant_p1': { setNum: 70, paper: 1, year: 2024 },
        'paper_nacca_sample_variant_p2': { setNum: 71, paper: 2, year: 2024 },
        'paper_2026_variant': { setNum: 72, paper: 1, year: 2026 },
        'paper_2026_variant_p2': { setNum: 73, paper: 2, year: 2026 },
        'paper_2014_variant': { setNum: 74, paper: 1, year: 2014 },
        'paper_2014_variant_p2': { setNum: 75, paper: 2, year: 2014 },
        'paper_2015_variant': { setNum: 76, paper: 1, year: 2015 },
        'paper_2015_variant_p2': { setNum: 77, paper: 2, year: 2015 },
        'paper_2025_variant': { setNum: 65, paper: 2, year: 2025 },
        'paper_2025_p1_variant': { setNum: 65, paper: 1, year: 2025 },
        'paper_2024_variant': { setNum: 60, paper: 2, year: 2024 },
        'paper_2024_p1_variant': { setNum: 60, paper: 1, year: 2024 },
        'paper_2023_variant': { setNum: 59, paper: 2, year: 2023 },
        'paper_2023_p1_variant': { setNum: 59, paper: 1, year: 2023 },
        'paper_2022_variant': { setNum: 58, paper: 2, year: 2022 },
        'paper_2022_p1_variant': { setNum: 58, paper: 1, year: 2022 },
        'paper_2021_variant': { setNum: 57, paper: 2, year: 2021 },
        'paper_2021_p1_variant': { setNum: 57, paper: 1, year: 2021 },
        'paper_2020_variant': { setNum: 56, paper: 2, year: 2020 },
        'paper_2020_p1_variant': { setNum: 56, paper: 1, year: 2020 },
        'paper_2019_variant': { setNum: 55, paper: 2, year: 2019 },
        'paper_2019_p1_variant': { setNum: 55, paper: 1, year: 2019 },
        'paper_2018_variant': { setNum: 54, paper: 2, year: 2018 },
        'paper_2018_p1_variant': { setNum: 54, paper: 1, year: 2018 },
    };

    const targetPaperNum = paperType ? Number(paperType) : undefined;
    const mapped = catalogMap[cleanId];

    if (mapped) {
        match = modules.find(m => {
            const meta = resolveExamMetadata(m);
            const sId = (m.setId || '').toLowerCase();
            const t = (m.title || '').toLowerCase();
            const isSetMatch = sId.includes('-' + mapped.setNum) || t.includes('set ' + mapped.setNum) || t.includes('(set ' + mapped.setNum + ')');
            if (!isSetMatch) return false;
            if (targetPaperNum && meta.paperType && meta.paperType !== targetPaperNum) {
                return false;
            }
            return true;
        });
        if (match) return match;
    }

    // 3. Extract numeric hints (e.g. "65" or "2025")
    const numbers = cleanId.match(/\d+/g);
    if (numbers) {
        for (const nStr of numbers) {
            const n = parseInt(nStr, 10);
            match = modules.find(m => {
                const sId = (m.setId || '').toLowerCase();
                const t = (m.title || '').toLowerCase();
                const d = (m.description || '').toLowerCase();
                if (n >= 1990 && n <= 2030) {
                    return t.includes('' + n) || d.includes('' + n);
                }
                return sId.includes('-' + n) || t.includes('set ' + n) || t.includes('(set ' + n + ')');
            });
            if (match) return match;
        }
    }

    return null;
}

function MathLab({ 
    canEdit, 
    activeGrade = 'Senior Secondary (SHS)',
    tenantId,
    studentId,
    viewMode = 'topical',
    onViewModeChange,
    searchQuery = '',
    filterSubject = 'ALL',
    filterFormat = 'ALL',
    targetExamId,
    targetPaperType,
    assignmentId,
    initialSubject = 'math',
    onOpenDispatch
}: { 
    canEdit: boolean; 
    activeGrade?: SecondaryGradeTier;
    tenantId?: string;
    studentId?: string;
    viewMode?: 'topical' | 'exam_series';
    onViewModeChange?: (mode: 'topical' | 'exam_series') => void;
    searchQuery?: string;
    filterSubject?: string;
    filterFormat?: string;
    targetExamId?: string;
    targetPaperType?: string | number;
    assignmentId?: string;
    initialSubject?: 'math' | 'science';
    onOpenDispatch?: (examId?: string, paperType?: 1 | 2) => void;
}) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<any>(null);
    const [selectedDomain, setSelectedDomain] = useState<string>('ALL STRANDS');
    const [activeQuestionSet, setActiveQuestionSet] = useState<CurriculumQuestionSet | null>(null);
    const [activeTopicMeta, setActiveTopicMeta] = useState<{ title: string; topicId: string } | null>(null);
    const [activeTopicalLab, setActiveTopicalLab] = useState<TopicalLabDocument | null>(null);
    const [isLoadingSet, setIsLoadingSet] = useState(false);
    const [dynamicSets, setDynamicSets] = useState<SuggestedModuleCard[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [subject, setSubject] = useState<'math' | 'science'>(
        initialSubject || (filterSubject === 'science' ? 'science' : 'math')
    );

    useEffect(() => {
        if (filterSubject === 'science' && subject !== 'science') {
            setSubject('science');
            setSelectedDomain('ALL STRANDS');
        } else if (filterSubject === 'math' && subject !== 'math') {
            setSubject('math');
            setSelectedDomain('ALL STRANDS');
        }
    }, [filterSubject]);
    // Direct Task Dispatch Auto-Launcher
    const [autoLaunchedExamId, setAutoLaunchedExamId] = useState<string | null>(null);

    useEffect(() => {
        if (!targetExamId || autoLaunchedExamId === targetExamId || activeQuestionSet || activeTopicMeta || isLoadingSet) {
            return;
        }

        const combined = [
            ...SUGGESTED_MATH_MODULES.filter(m => m.kind === 'exam_series'),
            ...dynamicSets.filter(d => d.kind === 'exam_series')
        ];

        const match = findModuleForExam(combined, targetExamId, targetPaperType);
        if (match) {
            console.log('[MathLab] Direct auto-launch of assigned exam module:', match.title, match.setId);
            setAutoLaunchedExamId(targetExamId);
            handleLaunchModule(match);
        }
    }, [targetExamId, targetPaperType, autoLaunchedExamId, dynamicSets, activeQuestionSet, activeTopicMeta, isLoadingSet]);


    const [selectedEra, setSelectedEra] = useState<'all' | 'modern' | 'prep' | 'legacy' | 'classic'>('all');
    const [examPaperType, setExamPaperType] = useState<'all' | 'paper1' | 'paper2'>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedEra, examPaperType, searchQuery, activeGrade, selectedDomain, filterSubject, filterFormat]);


    // Dynamic scanning of seeded question sets & topical labs across topics for JHS/SHS
    const refreshCurriculumSets = useCallback(async (manual = false) => {
        setIsRefreshing(true);
        const levelId = mapGradeTierToLevelId(activeGrade);
        invalidateCurriculumCache(levelId, subject);
        invalidateTopicalLabCache();

        try {
            const scanned: SuggestedModuleCard[] = [];

            // 1. Dynamic Topical Practice Labs Manifest for JHS
            if (levelId === 'jhs') {
                try {
                    const manifest = await getSubjectTopicsManifest('jhs', subject);
                    if (manifest && manifest.topics && manifest.topics.length > 0) {
                        manifest.topics.forEach((t) => {
                            let strandName = t.strandName || t.strand || (subject === 'science' ? 'Strand 1: Diversity of Matter' : 'Strand 1: Number');
                            const strandCode = t.strandCode || '';
                            if (subject === 'science') {
                                if (strandCode === 'S1' || strandCode === '1') strandName = 'Strand 1: Diversity of Matter';
                                else if (strandCode === 'S2' || strandCode === '2') strandName = 'Strand 2: Cycles';
                                else if (strandCode === 'S3' || strandCode === '3') strandName = 'Strand 3: Systems';
                                else if (strandCode === 'S4' || strandCode === '4') strandName = 'Strand 4: Forces and Energy';
                                else if (strandCode === 'S5' || strandCode === '5') strandName = 'Strand 5: Humans and the Environment';
                            } else {
                                if (strandCode === 'S1' || strandCode === '1') {
                                    strandName = 'Strand 1: Number';
                                } else if (strandCode === 'S2' || strandCode === '2') {
                                    strandName = 'Strand 2: Algebra';
                                } else if (strandCode === 'S3' || strandCode === '3') {
                                    strandName = 'Strand 3: Geometry & Measurement';
                                } else if (strandCode === 'S4' || strandCode === '4') {
                                    strandName = 'Strand 4: Handling Data';
                                } else {
                                    const strandUpper = strandName.toUpperCase();
                                    if (strandUpper.includes('ALGEBRA') || strandUpper.includes('PATTERNS')) {
                                        strandName = 'Strand 2: Algebra';
                                    } else if (strandUpper.includes('GEOMETRY') || strandUpper.includes('MEASUREMENT')) {
                                        strandName = 'Strand 3: Geometry & Measurement';
                                    } else if (strandUpper.includes('DATA') || strandUpper.includes('STATISTICS') || strandUpper.includes('PROBABILITY')) {
                                        strandName = 'Strand 4: Handling Data';
                                    } else {
                                        strandName = 'Strand 1: Number';
                                    }
                                }
                            }

                            const isPending = t.status === 'pending_content';
                            scanned.push({
                                title: t.title,
                                domain: strandName.toUpperCase(),
                                strandName: strandName,
                                strandCode: t.strandCode || (subject === 'science' ? 'S1' : 'S1'),
                                subStrand: t.subStrand,
                                levelsAvailable: t.levelsAvailable || ['B7', 'B8', 'B9'],
                                gradeTier: 'Junior Secondary (JHS)',
                                meta: isPending
                                    ? `Curriculum Strand • Tiered Notes & Drills in Preparation`
                                    : `Basic 7 – Basic 9 • Concept Notes & Worked Examples`,
                                description: t.description || (isPending
                                    ? `Official ${strandName} curriculum unit. Interactive tiered learning drills and concept notes are being mapped.`
                                    : `Master ${t.title} with tiered concept notes, worked examples, and graded practice pools.`),
                                topicId: t.id,
                                setId: t.id,
                                kind: 'topical',
                                format: 'topical_lab',
                                questionCount: t.questionCount || (isPending ? 0 : 27),
                                subject: subject === 'science' ? 'Integrated Science' : 'Mathematics',
                                status: t.status || 'ready'
                            });
                        });
                    }
                } catch (manifestErr) {
                    console.warn('[senior-academy] Error loading topical labs manifest:', manifestErr);
                }
            }

            // 2. Exam Series scanning
            const topicsToScan = ['core_curriculum_mastery', 'bece_past_papers', 'nacca_preparatory_blueprint', 'past_papers'];
            for (const tId of topicsToScan) {
                const sets = await getTopicQuestionSets(levelId, subject, tId);
                console.log("[senior-academy] Fetched sets for topic", tId, ":", sets);
                if (sets && sets.length > 0) {
                    sets.forEach((s) => {
                        scanned.push({
                            title: s.title,
                            domain: s.format === 'structured_essay' || s.title.toLowerCase().includes('paper 2') || s.title.toLowerCase().includes('structured')
                                ? (subject === 'science' ? 'STRAND 1: DIVERSITY OF MATTER' : 'ALGEBRA')
                                : (subject === 'science' ? 'STRAND 2: CYCLES' : 'ARITHMETIC & NUMERACY'),
                            gradeTier: activeGrade,
                            meta: `${s.totalQuestions || s.questions?.length || 40} Questions • 60 mins • ${s.variantType === 'past_paper_variant' ? 'Past Paper Variant' : 'Mastery Series'}`,
                            description: s.topic || s.title,
                            difficulty: 'Advanced',
                            topicId: tId,
                            setId: s.id,
                            kind: 'exam_series',
                            format: s.format || (s.questions?.[0]?.options && s.questions[0].options.length > 0 ? 'objective' : 'structured_essay'),
                            questionCount: s.totalQuestions || s.questions?.length || 0,
                            examTag: `${s.totalQuestions || s.questions?.length || 0} Questions • Live Stepper`,
                            subject: subject === 'science' ? 'Integrated Science' : 'Mathematics'
                        });
                    });
                }
            }
            setDynamicSets(scanned);
            if (manual) {
                toast({ title: 'Curriculum Cache Refreshed! ⚡', description: 'Live Firestore resources & practice sets re-synchronized.' });
            }
        } catch (err) {
            console.warn('[senior-academy] Error scanning dynamic sets:', err);
        } finally {
            setIsRefreshing(false);
        }
    }, [activeGrade, subject, toast]);

    useEffect(() => {
        refreshCurriculumSets(false);
    }, [refreshCurriculumSets]);

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

    // Zero Read-Cost Client-Side Filter over merged static + dynamic sets
    const filteredModules = useMemo<SuggestedModuleCard[]>(() => {
        let candidateList: SuggestedModuleCard[] = [];

        if (viewMode === 'topical') {
            // In Topical Practice Labs mode, strictly display canonical topical practice labs matching active subject
            const topicalCards = dynamicSets.filter(d => 
                (d.kind === 'topical' || d.format === 'topical_lab') &&
                (subject === 'science' ? (d.subject?.toLowerCase().includes('science')) : (!d.subject?.toLowerCase().includes('science')))
            );
            if (topicalCards.length > 0) {
                candidateList = topicalCards;
            } else if (subject === 'math' && activeGrade === 'Senior Secondary (SHS)') {
                candidateList = SUGGESTED_MATH_MODULES.filter(m => m.gradeTier === activeGrade && m.kind !== 'exam_series');
            } else {
                candidateList = [];
            }
        } else {
            // In Standard Exam Series mode, merge static exam series with dynamic exam series
            const staticModules = subject === 'science'
                ? SUGGESTED_SCIENCE_MODULES.filter(m => m.kind === 'exam_series')
                : SUGGESTED_MATH_MODULES.filter(m => m.kind === 'exam_series');
            const combined = [...staticModules];

            dynamicSets.forEach(dyn => {
                if (dyn.kind === 'exam_series') {
                    const isScience = dyn.subject?.toLowerCase().includes('science');
                    if ((subject === 'science' && isScience) || (subject === 'math' && !isScience)) {
                        const exists = combined.some(m => (m.setId && m.setId === dyn.setId) || (m.title.toLowerCase() === dyn.title.toLowerCase()));
                        if (!exists) combined.push(dyn);
                    }
                }
            });
            candidateList = combined;
        }

        const filtered = candidateList.filter(mod => {
            // 1. Tier Match
            if (mod.gradeTier !== activeGrade) return false;

            // 2. Dual-Track Mode Match
            const isExam = mod.kind === 'exam_series' || 
                           (mod as any).variantType === 'past_paper_variant' ||
                           (mod as any).variantType === 'standard' ||
                           mod.title.toLowerCase().includes('paper 1') || 
                           mod.title.toLowerCase().includes('paper 2') || 
                           mod.title.toLowerCase().includes('past paper') ||
                           mod.title.toLowerCase().includes('objective test') ||
                           mod.title.toLowerCase().includes('structured essay') ||
                           mod.title.toLowerCase().includes('mastery series');
            
            if (viewMode === 'exam_series') {
                if (!isExam) return false;
            } else {
                if (isExam) return false;
            }

            // 3. Subject Filter (matching active tab subject or explicit filter)
            const modSub = (mod.subject || 'Mathematics').toLowerCase();
            if (subject === 'science') {
                if (!modSub.includes('science')) return false;
            } else if (subject === 'math') {
                if (modSub.includes('science')) return false;
            }
            if (filterSubject !== 'ALL') {
                const targetSub = filterSubject.toLowerCase();
                if (!modSub.includes(targetSub) && !targetSub.includes(modSub)) return false;
            }

            // 4. Question Format Filter
            if (filterFormat === 'objective') {
                const isObj = mod.format === 'objective' || mod.meta.toLowerCase().includes('objective') || mod.title.toLowerCase().includes('paper 1');
                if (!isObj) return false;
            } else if (filterFormat === 'structured_essay') {
                const isEssay = mod.format === 'structured_essay' || mod.meta.toLowerCase().includes('essay') || mod.title.toLowerCase().includes('paper 2');
                if (!isEssay) return false;
            }

            // 5. Exam Paper Type Quick Toggle (when in exam_series mode)
            if (viewMode === 'exam_series' && examPaperType !== 'all') {
                const meta = resolveExamMetadata(mod);
                if (examPaperType === 'paper1' && meta.paperType !== 1) return false;
                if (examPaperType === 'paper2' && meta.paperType !== 2) return false;
            }

            // 6. Era Filter (when in exam_series mode)
            if (viewMode === 'exam_series' && selectedEra !== 'all') {
                if (selectedEra === 'prep') {
                    return false; // Handled by 2013-2018 in-prep empty state
                }
                const meta = resolveExamMetadata(mod);
                if (meta.era !== selectedEra) return false;
            }

            // 7. Strand / Domain Filter (for topical mode)
            if (viewMode === 'topical' && selectedDomain !== 'ALL STRANDS' && selectedDomain !== 'ALL DOMAINS') {
                const modDomain = (mod.domain || '').toUpperCase();
                const modStrand = (mod.strandName || '').toUpperCase();
                if (modDomain !== selectedDomain && !modStrand.includes(selectedDomain) && !selectedDomain.includes(modDomain)) {
                    return false;
                }
            }

            // 8. Search Query (debounced instant match over in-memory catalog)
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = mod.title.toLowerCase().includes(q);
                const matchDesc = mod.description.toLowerCase().includes(q);
                const matchDomain = mod.domain.toLowerCase().includes(q);
                const matchStrand = (mod.strandName || '').toLowerCase().includes(q) || (mod.subStrand || '').toLowerCase().includes(q);
                const matchMeta = mod.meta.toLowerCase().includes(q);
                const matchSample = (mod.sampleInstruction || '').toLowerCase().includes(q);
                const matchTag = (mod.examTag || '').toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchDomain && !matchStrand && !matchMeta && !matchSample && !matchTag) {
                    return false;
                }
            }

            return true;
        });

        // Numerical sorting for Standard Exam Series (Set 1 through Set 67+)
        if (viewMode === 'exam_series') {
            return [...filtered].sort((a, b) => {
                const extractNum = (item: any) => {
                    const mId = (item.setId || '').match(/(?:series|set)-?(\d+)/i) || (item.setId || '').match(/(\d+)$/);
                    if (mId) return parseInt(mId[1], 10);
                    const mTitle = (item.title || '').match(/Set\s*(\d+)/i);
                    if (mTitle) return parseInt(mTitle[1], 10);
                    return 9999;
                };
                const numA = extractNum(a);
                const numB = extractNum(b);
                if (numA !== numB) return numA - numB;
                return (a.title || '').localeCompare(b.title || '');
            });
        }

        return filtered;
    }, [activeGrade, viewMode, filterSubject, filterFormat, selectedDomain, searchQuery, dynamicSets, selectedEra, examPaperType]);

    // Live counts for Era badges based on current grade and paper type filter
    const eraCounts = useMemo(() => {
        if (viewMode !== 'exam_series') return { modern: 0, legacy: 0, classic: 0 };
        const staticModules = subject === 'science'
            ? SUGGESTED_SCIENCE_MODULES.filter(m => m.kind === 'exam_series')
            : SUGGESTED_MATH_MODULES.filter(m => m.kind === 'exam_series');
        const combined = [...staticModules];
        dynamicSets.forEach(dyn => {
            if (dyn.kind === 'exam_series') {
                const isScience = dyn.subject?.toLowerCase().includes('science');
                if ((subject === 'science' && isScience) || (subject === 'math' && !isScience)) {
                    const exists = combined.some(m => (m.setId && m.setId === dyn.setId) || (m.title.toLowerCase() === dyn.title.toLowerCase()));
                    if (!exists) combined.push(dyn);
                }
            }
        });
        const counts = { modern: 0, legacy: 0, classic: 0 };
        combined.forEach(mod => {
            if (mod.gradeTier !== activeGrade) return;
            const meta = resolveExamMetadata(mod);
            if (examPaperType !== 'all') {
                if (examPaperType === 'paper1' && meta.paperType !== 1) return;
                if (examPaperType === 'paper2' && meta.paperType !== 2) return;
            }
            if (meta.era === 'modern') counts.modern++;
            else if (meta.era === 'legacy') counts.legacy++;
            else if (meta.era === 'classic') counts.classic++;
        });
        return counts;
    }, [dynamicSets, activeGrade, viewMode, examPaperType, subject]);

    // Pagination calculations
    const totalItems = filteredModules.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const validPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

    const paginatedModules = viewMode === 'exam_series' 
        ? filteredModules.slice(startIndex, endIndex)
        : filteredModules;

    const isPrepSearch = searchQuery.trim().length > 0 && /\b(2013|2014|2015|2016|2017|2018)\b/.test(searchQuery);
    const isPrepEraSelected = selectedEra === 'prep';
    const showPrepNotice = viewMode === 'exam_series' && (isPrepEraSelected || (isPrepSearch && filteredModules.length === 0));


    const handleLaunchModule = async (mod: any) => {
        setProblem(null);
        setActiveQuestionSet(null);
        setActiveTopicMeta(null);
        setActiveTopicalLab(null);

        // 1. Direct handling of Topical Practice Labs (costs strictly 1 Firestore read)
        if (mod.kind === 'topical' || mod.format === 'topical_lab' || (mod.topicId && (mod.topicId.startsWith('topic_') || mod.topicId.startsWith('bs')))) {
            setIsLoadingSet(true);
            try {
                const topicDocId = mod.topicId;
                const labSubject = (mod.subject?.toLowerCase().includes('science') || subject === 'science') ? 'science' : 'math';
                const labDoc = await getTopicalLabDoc(topicDocId, 'jhs', labSubject);
                if (labDoc) {
                    setActiveTopicalLab(labDoc);
                    return;
                } else {
                    toast({
                        title: 'Module In Preparation 📚',
                        description: `Tiered notes and practice pools for "${mod.title}" are currently being synchronized according to national curriculum standards. Check back shortly!`
                    });
                    return;
                }
            } catch (err) {
                console.warn('[senior-academy] Error loading topical lab document:', err);
            } finally {
                setIsLoadingSet(false);
            }
        }

        const levelId = mapGradeTierToLevelId(activeGrade);
        const subjectId = 'math';
        
        let topicId = mod.topicId || 'visual_blocks_addition';
        if (!mod.topicId) {
            const titleLower = (mod.title || mod.subTopic || '').toLowerCase();
            if (titleLower.includes('mastery') || titleLower.includes('problem-solving') || titleLower.includes('core curriculum') || titleLower.includes('series')) {
                topicId = 'core_curriculum_mastery';
            } else if (titleLower.includes('2012') || titleLower.includes('mock') || titleLower.includes('past paper') || titleLower.includes('bece')) {
                topicId = 'bece_past_papers';
            } else if (titleLower.includes('visual number blocks') || titleLower.includes('visual blocks') || titleLower.includes('addition') || titleLower.includes('bonds')) {
                topicId = 'visual_blocks_addition';
            } else if (titleLower.includes('fraction') || titleLower.includes('decimal') || titleLower.includes('percentage') || titleLower.includes('proportion')) {
                topicId = 'fractions_decimals';
            } else if (titleLower.includes('linear') || titleLower.includes('quadratic') || titleLower.includes('equation') || titleLower.includes('algebra')) {
                topicId = 'linear_equations';
            } else if (titleLower.includes('calculus') || titleLower.includes('differentiation') || titleLower.includes('derivative')) {
                topicId = 'calculus_differentiation';
            } else {
                topicId = titleLower.replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
            }
        }

        setActiveTopicMeta({ title: mod.title || mod.subTopic, topicId });
        setIsLoadingSet(true);

        console.log(`[senior-academy] Launching module: "${mod.title}", Topic: "${topicId}", SetId: "${mod.setId}"`);
        try {
            const sets = await getTopicQuestionSets(levelId, subjectId, topicId);
            console.log("Fetched sets:", sets);
            let targetSet: CurriculumQuestionSet | null = null;
            if (mod.setId) {
                targetSet = sets.find(s => s.id === mod.setId) || null;
                if (!targetSet) {
                    targetSet = await getQuestionSetById(levelId, subjectId, topicId, mod.setId);
                }
                if (!targetSet && isValidCurriculumLevelId(levelId)) {
                    const fallbackMatch = SAMPLE_GLOBAL_QUESTION_SETS[levelId as GlobalCurriculumLevelId]?.find(
                        (item) => item.questionSet.id === mod.setId
                    );
                    if (fallbackMatch) {
                        targetSet = fallbackMatch.questionSet;
                    }
                }
            }
            if (!targetSet && sets && sets.length > 0) {
                targetSet = sets[0];
            }
            if (targetSet) {
                console.log("[senior-academy] Activated target set:", targetSet.id, targetSet.title, `(${targetSet.questions?.length} questions)`);
                setActiveQuestionSet(targetSet);
            } else {
                setActiveQuestionSet(null);
            }
        } catch (e) {
            console.warn('Error loading topic question set:', e);
            setActiveQuestionSet(null);
        } finally {
            setIsLoadingSet(false);
        }
    };

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
            {activeTopicalLab ? (
                <TopicalLabRunner
                    topicDoc={activeTopicalLab}
                    studentId={studentId}
                    tenantId={tenantId}
                    initialLevel="b7"
                    onBack={() => setActiveTopicalLab(null)}
                    onNavigateToSet={(targetSetId) => {
                        setActiveTopicalLab(null);
                        handleLaunchModule({
                            title: `Exam Paper (${targetSetId})`,
                            setId: targetSetId,
                            topicId: 'core_curriculum_mastery',
                            kind: 'exam_series'
                        });
                    }}
                />
            ) : activeTopicMeta ? (
                isLoadingSet ? (
                    <div className="flex flex-col items-center justify-center p-16 space-y-4 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <p className="text-xs text-slate-400 font-medium">Synchronizing curriculum practice sets...</p>
                    </div>
                ) : (
                    <QuestionRunner
                        questionSet={activeQuestionSet}
                        topicTitle={activeTopicMeta.title}
                        gradeTier={activeGrade}
                        levelId={mapGradeTierToLevelId(activeGrade)}
                        subjectId="mathematics"
                        topicId={activeTopicMeta.topicId}
                        tenantId={tenantId}
                        studentId={studentId}
                        assignmentId={assignmentId}
                        onBack={() => {
                            setActiveTopicMeta(null);
                            setActiveQuestionSet(null);
                            if (typeof window !== 'undefined') {
                                const url = new URL(window.location.href);
                                url.searchParams.delete('examId');
                                url.searchParams.delete('assignmentId');
                                url.searchParams.delete('paperType');
                                window.history.replaceState({}, '', url.toString());
                            }
                        }}
                    />
                )
            ) : problem ? (
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
                    {/* Subject filter tabs */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                            setSubject('math');
                            setSelectedDomain('ALL STRANDS');
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          subject === 'math'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        📐 Mathematics (Core & Variants)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                            setSubject('science');
                            setSelectedDomain('ALL STRANDS');
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          subject === 'science'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🔬 Integrated Science (Discovery)
                      </button>
                    </div>

                    {/* Section Sub-Header with mode indicator */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                {viewMode === 'exam_series' ? (
                                    <>
                                        <Award className="w-4 h-4 text-amber-400" />
                                        <span>Standard Exam Series & Past Paper Variants • {activeGrade}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <span>Topical Practice Labs & Mastery Drills • {activeGrade}</span>
                                    </>
                                )}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {viewMode === 'exam_series' 
                                    ? "Timed official examination sets, Paper 1 objective steppers, and Paper 2 structured theory rubrics."
                                    : "Subject-by-subject unit drills, conceptual frameworks, and interactive laboratory problems."}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refreshCurriculumSets(true)}
                                disabled={isRefreshing}
                                className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                                title="Bust cache and re-query Firestore question sets"
                            >
                                <RotateCcw className={cn("w-3.5 h-3.5 text-indigo-400", isRefreshing && "animate-spin")} />
                                <span>{isRefreshing ? "Refreshing..." : "Refresh Resources"}</span>
                            </Button>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                                {filteredModules.length} {viewMode === 'exam_series' ? 'Exam Papers' : 'Topical Labs'}
                            </span>
                        </div>
                    </div>

                    {/* SUBJECT DOMAIN PILL BAR - Rendered only in Topical Practice Labs mode */}
                    {viewMode === 'topical' && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                            {(subject === 'science' ? SCIENCE_DOMAINS : MATH_DOMAINS).map((domain) => {
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
                    )}

                    {/* EXAM FEED FILTERING PILL BAR - Rendered in Standard Exam Series mode */}
                    {viewMode === 'exam_series' && (
                        <div className="space-y-2.5 pt-1 pb-2">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/50 p-2.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                                {/* Era / Year Range Segmented Control Chips */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                                        Era:
                                    </span>
                                    {[
                                        { id: 'all', label: 'All Sets', count: null },
                                        { id: 'modern', label: 'Modern Era (2019 – 2026)', count: eraCounts.modern },
                                        { id: 'prep', label: '2013 – 2018 (In Prep)', count: '0' },
                                        { id: 'legacy', label: 'Legacy Era 2 (2000 – 2012)', count: eraCounts.legacy },
                                        { id: 'classic', label: 'Classic Era (1992 – 1999)', count: eraCounts.classic }
                                    ].map(era => {
                                        const isActive = selectedEra === era.id;
                                        return (
                                            <button
                                                key={era.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedEra(era.id as any);
                                                    setCurrentPage(1);
                                                }}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                                                    isActive
                                                        ? era.id === 'modern'
                                                            ? "bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30"
                                                            : era.id === 'prep'
                                                            ? "bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30"
                                                            : "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                                        : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800"
                                                )}
                                            >
                                                <span>{era.label}</span>
                                                {era.count !== null && (
                                                    <span className={cn(
                                                        "text-[10px] font-extrabold px-1.5 py-0.2 rounded-md",
                                                        isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                                                    )}>
                                                        {era.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Paper Type Quick Toggle: [All Papers | Paper 1 Only | Paper 2 Only] */}
                                <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start lg:self-auto">
                                    {[
                                        { id: 'all', label: 'All Papers', icon: Layers, color: 'text-slate-400' },
                                        { id: 'paper1', label: 'Paper 1 Only', icon: ListChecks, color: 'text-sky-400' },
                                        { id: 'paper2', label: 'Paper 2 Only', icon: FileText, color: 'text-amber-400' }
                                    ].map(pt => {
                                        const isActive = examPaperType === pt.id;
                                        const Icon = pt.icon;
                                        return (
                                            <button
                                                key={pt.id}
                                                type="button"
                                                onClick={() => {
                                                    setExamPaperType(pt.id as any);
                                                    setCurrentPage(1);
                                                }}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                                                    isActive
                                                        ? pt.id === 'paper1'
                                                            ? "bg-sky-600 text-white shadow-xs"
                                                            : pt.id === 'paper2'
                                                            ? "bg-amber-600 text-white shadow-xs"
                                                            : "bg-indigo-600 text-white shadow-xs"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                                )}
                                            >
                                                <Icon className={cn("w-3.5 h-3.5", !isActive && pt.color)} />
                                                <span>{pt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2013-2018 PREPARATION EMPTY STATE OR REGULAR EMPTY STATE */}
                    {showPrepNotice ? (
                        <div className="py-16 px-6 text-center bg-slate-900/40 border border-dashed border-amber-500/30 rounded-3xl space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                                <Clock className="w-7 h-7" />
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-base sm:text-lg font-bold text-white">Past question variants for 2013–2018 are currently in preparation.</h4>
                                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                                    Official BECE mathematics examination variants for academic years 2013 through 2018 are currently undergoing digitization, calibration, and step-by-step marking rubric synthesis. Explore Modern Era (2019–2025) or Legacy Era sets in the meantime!
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedEra('all'); setCurrentPage(1); }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                                >
                                    View All Available Sets
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedEra('modern'); setCurrentPage(1); }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 transition-all cursor-pointer"
                                >
                                    Explore Modern Era (2019–2026)
                                </button>
                            </div>
                        </div>
                    ) : filteredModules.length === 0 ? (
                        <div className="py-16 px-6 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
                                <Search className="w-6 h-6 opacity-60" />
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white">No matching curriculum sets found</h4>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                Try adjusting your search keywords, clearing search filters, or switching academic tiers.
                            </p>
                        </div>
                    ) : (
                        /* FULL-WIDTH 3-COLUMN MODULE CARDS GRID */
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedModules.map((mod, i) => {
                                    const isExamCard = viewMode === 'exam_series' || mod.kind === 'exam_series';
                                    const examMeta = isExamCard ? resolveExamMetadata(mod) : null;
                                    const rawTitle = (mod.title || mod.name || '').toLowerCase();
                                    const rawFormat = (mod.format || mod.type || '').toLowerCase();
                                    const isPaper2 = examMeta 
                                        ? examMeta.paperType === 2 
                                        : (
                                            mod.paperType === 2 || 
                                            rawFormat.includes('essay') || 
                                            rawFormat.includes('theory') || 
                                            rawTitle.includes('paper 2') || 
                                            rawTitle.includes('structured') || 
                                            rawTitle.includes('problem-solving')
                                        );
                                    
                                    return (
                                        <div 
                                            key={mod.setId || i} 
                                            className={cn(
                                                "rounded-2xl p-5 transition-all flex flex-col justify-between group h-full",
                                                isExamCard 
                                                    ? (isPaper2 
                                                        ? "border border-amber-500/30 hover:border-amber-400/60 bg-slate-900/90 shadow-[0_0_15px_rgba(245,158,11,0.06)]" 
                                                        : "border border-sky-500/30 hover:border-sky-400/60 bg-slate-900/90 shadow-[0_0_15px_rgba(14,165,233,0.06)]")
                                                    : "border border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-850/80 shadow-lg"
                                            )}
                                        >
                                            <div>
                                                {/* Card Badges */}
                                                {isExamCard ? (
                                                    <div className="flex items-center justify-between gap-2 mb-3">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className={cn(
                                                                "text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5",
                                                                isPaper2 
                                                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" 
                                                                    : "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                                            )}>
                                                                {isPaper2 ? (
                                                                    <>
                                                                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                                                                        <span>Paper 2 • Structured Theory{examMeta?.year ? ` • ${examMeta.year}` : ''}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ListChecks className="w-3.5 h-3.5 text-sky-400" />
                                                                        <span>Paper 1 • Objective CBT{examMeta?.year ? ` • ${examMeta.year}` : ''}</span>
                                                                    </>
                                                                )}
                                                            </span>
                                                            <ExamDisclaimerTooltip compact={true} variantYear={examMeta?.year} />
                                                        </div>

                                                        {mod.status === 'pending_content' ? (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider bg-amber-500/15 text-amber-300 border-amber-500/30 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>Content coming soon</span>
                                                            </span>
                                                        ) : mod.difficulty ? (
                                                            <span className={cn(
                                                                "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                                                                mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                                mod.difficulty === 'Advanced' ? (isPaper2 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-sky-500/10 text-sky-400 border-sky-500/20") :
                                                                "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            )}>
                                                                {mod.difficulty}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    /* Topical Practice Lab: Official NaCCA Strand Tag Header (NO rigid difficulty badge) */
                                                    <div className="flex items-center justify-between gap-2 mb-3">
                                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-xs">
                                                            <Bookmark className="w-3 h-3 text-indigo-400" />
                                                            <span>{mod.strandName ? mod.strandName.toUpperCase() : mod.domain}</span>
                                                        </span>

                                                        {mod.subStrand && (
                                                            <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline truncate max-w-[150px]" title={mod.subStrand}>
                                                                {mod.subStrand}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Exam Series Highlights / Automated Tags */}
                                                {isExamCard && (
                                                    <div className="mb-2">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                                                            isPaper2 
                                                                ? "bg-amber-400/10 text-amber-300 border-amber-400/20" 
                                                                : "bg-sky-400/10 text-sky-300 border-sky-400/20"
                                                        )}>
                                                            {mod.examTag || (isPaper2 ? '6 Essay Modules • Step-by-Step Marking Guide' : '40 Objective Questions • Automated Stepper')}
                                                        </span>
                                                    </div>
                                                )}

                                                <h4 className={cn(
                                                    "text-base font-bold text-white transition-colors leading-snug mb-2 min-h-[44px] line-clamp-2",
                                                    isExamCard 
                                                        ? (isPaper2 ? "group-hover:text-amber-300" : "group-hover:text-sky-300")
                                                        : "group-hover:text-indigo-300"
                                                )}>
                                                    {mod.title}
                                                </h4>

                                                {/* Scope Snippet: 1-2 sentence description of skills covered */}
                                                <p className="text-xs text-slate-400 line-clamp-2 mb-3 min-h-[36px] leading-relaxed">
                                                    {mod.description}
                                                </p>

                                                {/* Class Coverage Chips: [ B7 (JHS 1) ] [ B8 (JHS 2) ] [ B9 (JHS 3) ] */}
                                                {!isExamCard && (
                                                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                                                        {(mod.levelsAvailable || ['B7', 'B8', 'B9']).map((lvlKey) => {
                                                            const label = lvlKey === 'B7' || lvlKey === 'b7' ? 'B7 (JHS 1)' :
                                                                          lvlKey === 'B8' || lvlKey === 'b8' ? 'B8 (JHS 2)' :
                                                                          lvlKey === 'B9' || lvlKey === 'b9' ? 'B9 (JHS 3)' : lvlKey;
                                                            return (
                                                                <span
                                                                    key={lvlKey}
                                                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700/80 shadow-xs"
                                                                >
                                                                    {label}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 mt-auto">
                                                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                                    {mod.meta}
                                                </span>
                                                {canEdit && isExamCard && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onOpenDispatch?.(mod.setId, isPaper2 ? 2 : 1);
                                                        }}
                                                        className="h-8 px-2.5 rounded-lg text-xs flex items-center gap-1 border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20 cursor-pointer mr-2"
                                                        title="Assign this past paper to a class"
                                                    >
                                                        <Send className="w-3 h-3 text-amber-400" />
                                                        <span>Assign</span>
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleLaunchModule(mod)}
                                                    disabled={mod.status === 'pending_content'}
                                                    className={cn(
                                                        "h-8 px-3.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer",
                                                        mod.status === 'pending_content'
                                                            ? "bg-slate-800/40 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-75"
                                                            : isExamCard
                                                                ? (isPaper2 
                                                                    ? "bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-sm transition-colors" 
                                                                    : "bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-sm transition-colors")
                                                                : "bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 font-semibold transition-all"
                                                    )}
                                                >
                                                    <span>
                                                        {mod.status === 'pending_content' 
                                                            ? "Coming Soon" 
                                                            : isExamCard 
                                                                ? (isPaper2 ? "Launch Theory Rubric" : "Launch Objective CBT") 
                                                                : "Launch Practice Lab"}
                                                    </span>
                                                    {mod.status !== 'pending_content' && <ChevronRight className="w-3.5 h-3.5" />}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* COMPACT PAGINATION BAR - Rendered only in Standard Exam Series mode */}
                            {viewMode === 'exam_series' && totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 pb-2 border-t border-slate-800/80">
                                    <div className="text-xs font-medium text-slate-400">
                                        Showing <span className="font-bold text-white">{totalItems === 0 ? 0 : startIndex + 1}</span>–<span className="font-bold text-white">{endIndex}</span> of <span className="font-bold text-white">{totalItems}</span> papers
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={validPage <= 1}
                                            className="h-8 px-3 text-xs bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                            <span>Previous</span>
                                        </Button>

                                        {/* Page number buttons */}
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                                                .filter(page => {
                                                    if (page === 1 || page === totalPages) return true;
                                                    if (Math.abs(page - validPage) <= 1) return true;
                                                    return false;
                                                })
                                                .map((page, idx, arr) => {
                                                    const prevPage = arr[idx - 1];
                                                    const showEllipsis = prevPage && page - prevPage > 1;
                                                    return (
                                                        <div key={page} className="flex items-center gap-1">
                                                            {showEllipsis && (
                                                                <span className="px-1 text-slate-600 text-xs font-bold">...</span>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => setCurrentPage(page)}
                                                                className={cn(
                                                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                                                                    validPage === page
                                                                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                                                                        : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800"
                                                                )}
                                                            >
                                                                {page}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={validPage >= totalPages}
                                            className="h-8 px-3 text-xs bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Persistent Footer Accreditation */}
                            {viewMode === 'exam_series' && <PlatformExamFooterNotice />}
                        </div>
                    )}
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
                                                                                        onClick={() => handleLaunchModule({ title: item.title || item.subTopic, ...item })}
                                                                                        className={`w-full text-left p-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all hover:bg-slate-800 text-slate-300 hover:text-white group`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2 truncate">
                                                                                            <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                                                                            <span className="truncate">{item.title}</span>
                                                                                        </div>
                                                                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 shrink-0" />
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

function DiscoveryLab({ 
    canEdit, 
    activeGrade = 'Senior Secondary (SHS)',
    tenantId,
    studentId
}: { 
    canEdit: boolean; 
    activeGrade?: SecondaryGradeTier;
    tenantId?: string;
    studentId?: string;
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [lab, setLab] = useState<any>(null);
    const [stage, setStage] = useState<'hypothesis' | 'experiment' | 'conclusion'>('hypothesis');
    const [selectedDomain, setSelectedDomain] = useState<string>('ALL DOMAINS');
    const [activeQuestionSet, setActiveQuestionSet] = useState<CurriculumQuestionSet | null>(null);
    const [activeTopicMeta, setActiveTopicMeta] = useState<{ title: string; topicId: string } | null>(null);
    const [isLoadingSet, setIsLoadingSet] = useState(false);

    const isJunior = isJuniorLevel(activeGrade);
    const theme = isJunior ? juniorStyles : null;

    const handleLaunchModule = async (mod: any) => {
        const levelId = mapGradeTierToLevelId(activeGrade);
        const subjectId = 'science';
        
        let topicId = 'states-of-matter';
        const titleLower = (mod.title || '').toLowerCase();
        if (titleLower.includes('state') || titleLower.includes('matter') || titleLower.includes('phase')) {
            topicId = 'states-of-matter';
        } else {
            topicId = titleLower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        setActiveTopicMeta({ title: mod.title, topicId });
        setIsLoadingSet(true);

        try {
            const sets = await getTopicQuestionSets(levelId, subjectId, topicId);
            if (sets && sets.length > 0) {
                setActiveQuestionSet(sets[0]);
            } else {
                setActiveQuestionSet(null);
            }
        } catch (e) {
            console.warn('Error loading science question set:', e);
            setActiveQuestionSet(null);
        } finally {
            setIsLoadingSet(false);
        }
    };

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
            {activeTopicMeta ? (
                isLoadingSet ? (
                    <div className="flex flex-col items-center justify-center p-16 space-y-4 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        <p className="text-xs text-slate-400 font-medium">Synchronizing science practice sets...</p>
                    </div>
                ) : (
                    <QuestionRunner
                        questionSet={activeQuestionSet}
                        topicTitle={activeTopicMeta.title}
                        gradeTier={activeGrade}
                        levelId={mapGradeTierToLevelId(activeGrade)}
                        subjectId="science"
                        topicId={activeTopicMeta.topicId}
                        tenantId={tenantId}
                        studentId={studentId}
                        onBack={() => {
                            setActiveTopicMeta(null);
                            setActiveQuestionSet(null);
                        }}
                    />
                )
            ) : lab ? (
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
                                        onClick={() => handleLaunchModule(mod)}
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
            "Junior Core Mathematics • Paper 1 (Objective)",
            "Junior Core Mathematics • Paper 2 (Structured)"
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
    },
    'Upper Primary (BS 4 - 6)': {
        math: [
            "Fractions, Decimals & Percentages",
            "Perimeter, Area & 2D Shapes",
            "Factors, Multiples & Prime Numbers",
            "Coordinate Grids & Linear Patterns",
            "Ratios, Scales & Unit Rates",
            "Basic Data Handling & Bar Charts"
        ],
        english: [
            "Reading Comprehension & Context Clues",
            "Persuasive Writing & Opinion Speeches",
            "Figurative Language, Similes & Metaphors",
            "Complex Sentences, Conjunctions & Clauses",
            "Narrative Writing & Character Dialogue",
            "Formal Letters & Descriptive Essays"
        ],
        science: [
            "States of Matter & Phase Changes",
            "Simple Machines, Levers & Pulleys",
            "Ecosystems, Food Chains & Energy Flow",
            "Plant Nutrition, Leaves & Germination",
            "Electricity, Conductors & Insulators",
            "The Water Cycle, Weather & Clouds"
        ]
    },
    'Lower Primary (BS 1 - 3)': {
        math: [
            "Visual Number Blocks & Addition Facts",
            "2D Shapes, Patterns & Symmetry",
            "Money, Coins & Basic Change",
            "Skip Counting by 2s, 5s & 10s",
            "Telling Time to the Hour & Half Hour",
            "Measuring Length with Non-Standard Units"
        ],
        english: [
            "Phonics, Vowel Blends & Rhyming Pairs",
            "Sight Words & Expressive Story Sentences",
            "Capital Letters, Full Stops & Question Marks",
            "Action Verbs, Nouns & Adjectives",
            "Story Retelling & Picture Sequence",
            "Vocabulary: Animals, Colors & Family"
        ],
        science: [
            "Living Things & The Five Senses",
            "Weather, Seasons & Day-Night Cycles",
            "Parts of a Plant & Seeds",
            "Animal Habitats, Sounds & Diets",
            "Push and Pull: Basic Forces",
            "Sink or Float: Exploring Materials"
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
                                            activeGrade === 'Lower Primary (BS 1 - 3)'
                                                ? (
                                                    activeSubject === 'math'
                                                        ? "e.g. Visual Number Blocks, Addition Facts, 2D Shapes..."
                                                        : activeSubject === 'english'
                                                        ? "e.g. Phonics Blends, Sight Words, Expressive Sentences..."
                                                        : "e.g. Five Senses, Living Things, Weather & Seasons..."
                                                )
                                                : activeGrade === 'Upper Primary (BS 4 - 6)'
                                                ? (
                                                    activeSubject === 'math'
                                                        ? "e.g. Fractions & Decimals, Area of Shapes, Factors & Multiples..."
                                                        : activeSubject === 'english'
                                                        ? "e.g. Reading Comprehension, Persuasive Writing, Similes & Idioms..."
                                                        : "e.g. States of Matter, Simple Machines, Ecosystems & Energy..."
                                                )
                                                : activeGrade === 'Junior Secondary (JHS)'
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


function SeniorAcademyPageContent() {
    const { role } = useRole();
    const canEdit = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL sync for active view mode (?view=topical vs ?view=exam_series)
    const urlView = searchParams.get('view');
    const urlTab = searchParams.get('tab');
    const urlExamId = searchParams.get('examId');
    const urlPaperType = searchParams.get('paperType');
    const urlAssignmentId = searchParams.get('assignmentId');

    const isExamRequested = urlView === 'exam_series' || urlTab === 'past-papers' || !!urlExamId || !!urlAssignmentId;
    const initialViewMode = isExamRequested ? 'exam_series' : 'topical';
    const [viewMode, setViewMode] = useState<'topical' | 'exam_series'>(initialViewMode);

    // Dispatch Past Questions Modal State
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [selectedDispatchExamId, setSelectedDispatchExamId] = useState<string | undefined>(undefined);
    const [selectedDispatchPaperType, setSelectedDispatchPaperType] = useState<1 | 2>(2);

    // Sync state if URL changes externally
    useEffect(() => {
        if (urlView === 'exam_series' && viewMode !== 'exam_series') {
            setViewMode('exam_series');
        } else if ((!urlView || urlView === 'topical') && viewMode !== 'topical') {
            setViewMode('topical');
        }
    }, [urlView]);

    const handleViewModeToggle = (mode: 'topical' | 'exam_series') => {
        setViewMode(mode);
        const params = new URLSearchParams(searchParams.toString());
        if (mode === 'exam_series') {
            params.set('view', 'exam_series');
        } else {
            params.set('view', 'topical');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    // Instant Client-Side Zero-Cost Search & Tag Filters
    const [rawSearchQuery, setRawSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterSubject, setFilterSubject] = useState('ALL');
    const [filterFormat, setFilterFormat] = useState('ALL');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(rawSearchQuery);
        }, 150);
        return () => clearTimeout(timer);
    }, [rawSearchQuery]);

    const [activeGradeTier, setActiveGradeTier] = useState<SecondaryGradeTier>('Junior Secondary (JHS)');
    const [activeSubject, setActiveSubject] = useState<'math' | 'english' | 'science'>('math');

    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolData } = useDoc<any>(schoolRef);
    const aiCredits = schoolData?.aiCredits ?? 810;
    
    const { user } = useUser();
    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );
    const studentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user?.uid;

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
                subtitle="Curriculum mastery laboratory, instant resource search, and standardized exam variant series."
                eyebrow="SUNNY SIDE ACADEMY • ACADEMICS"
                badge={{
                    label: "DUAL-TRACK LIVE",
                    variant: "success",
                }}
                icon={Rocket}
                className="mb-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
                actions={
                    canEdit ? (
                        <Button
                            type="button"
                            onClick={() => {
                                setSelectedDispatchExamId(undefined);
                                setSelectedDispatchPaperType(2);
                                setShowDispatchModal(true);
                            }}
                            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-amber-500/25 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                        >
                            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                            <span>Assign Past Questions to Class</span>
                        </Button>
                    ) : undefined
                }
            >
                {/* HORIZONTAL NAVIGATION BAR (Tier Selector tabs & Status Badge) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-4 border-t border-white/[0.08] overflow-visible">
                    {/* SEGMENTED CONTROL FOR ALL 4 STUDY LEVELS */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-slate-950/90 border border-slate-800/90 p-1 rounded-xl flex flex-wrap items-center gap-1 shadow-lg">
                            <button
                                type="button"
                                onClick={() => setActiveGradeTier('Lower Primary (BS 1 - 3)')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",
                                    activeGradeTier === 'Lower Primary (BS 1 - 3)'
                                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                )}
                            >
                                <Star className="w-3.5 h-3.5 shrink-0" />
                                <span>Lower Primary (BS 1 - 3)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveGradeTier('Upper Primary (BS 4 - 6)')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",
                                    activeGradeTier === 'Upper Primary (BS 4 - 6)'
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                )}
                            >
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span>Upper Primary (BS 4 - 6)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveGradeTier('Junior Secondary (JHS)')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",
                                    activeGradeTier === 'Junior Secondary (JHS)'
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                )}
                            >
                                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                <span>Junior Secondary (JHS)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveGradeTier('Senior Secondary (SHS)')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",
                                    activeGradeTier === 'Senior Secondary (SHS)'
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                )}
                            >
                                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                                <span>Senior Secondary (SHS)</span>
                            </button>
                        </div>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-xl shadow-inner text-xs shrink-0 self-start sm:self-auto">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="font-bold text-slate-300 whitespace-nowrap">Curriculum Synced</span>
                    </div>
                </div>
            </SectionHeroBanner>

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

            {/* 1. DUAL-TRACK RESOURCE SWITCHER & 2. INSTANT CLIENT-SIDE ZERO-COST SEARCH ENGINE */}
            <div className="mb-5 space-y-3 bg-slate-900/70 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl shadow-xl backdrop-blur-md">
                {/* DUAL-TRACK SEGMENTED MODE CONTROL */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
                    <div className="inline-flex p-1 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner">
                        <button
                            type="button"
                            onClick={() => handleViewModeToggle('topical')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
                                viewMode === 'topical'
                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/60"
                            )}
                        >
                            <span>📚 Topical Practice Labs</span>
                            <span className="text-[10px] opacity-75 hidden sm:inline font-normal">(Unit & Strand Drills)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleViewModeToggle('exam_series')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
                                viewMode === 'exam_series'
                                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-600/30 border border-amber-400/30"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/60"
                            )}
                        >
                            <span>🏛️ Standard Exam Series</span>
                            <span className="text-[10px] opacity-75 hidden sm:inline font-normal">(Paper 1 & Paper 2)</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 self-end md:self-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                            <Sparkles className="w-3 h-3" /> Zero Firestore Read-Cost
                        </span>
                    </div>
                </div>

                {/* SEARCH BAR & DYNAMIC TAG FILTERS */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 pt-0.5">
                    {/* Debounced Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Search by topic title, strand, keyword, or paper number (e.g. 'Fractions', 'Indices', 'Paper 1', 'Paper 2')..."
                            value={rawSearchQuery}
                            onChange={(e) => setRawSearchQuery(e.target.value)}
                            className="h-10 pl-10 pr-9 bg-slate-950/90 border-slate-800 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        {rawSearchQuery && (
                            <button
                                type="button"
                                onClick={() => setRawSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                                title="Clear search"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Dynamic Filters Row */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Subject Filter Tag */}
                        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/90 rounded-xl p-1 text-xs">
                            <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 flex items-center gap-1">
                                <Filter className="w-3 h-3" /> Subject:
                            </span>
                            {[
                                { id: 'ALL', label: 'All Subjects' },
                                { id: 'math', label: 'Mathematics' },
                                { id: 'english', label: 'English' },
                                { id: 'science', label: 'Science' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                        setFilterSubject(s.id);
                                        if (s.id === 'math' || s.id === 'english' || s.id === 'science') {
                                            setActiveSubject(s.id);
                                        }
                                    }}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer",
                                        filterSubject === s.id
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                    )}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Question Format Filter Tag */}
                        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/90 rounded-xl p-1 text-xs">
                            <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 flex items-center gap-1">
                                <SlidersHorizontal className="w-3 h-3" /> Format:
                            </span>
                            {[
                                { id: 'ALL', label: 'All Formats' },
                                { id: 'objective', label: 'Objective (MCQ)' },
                                { id: 'structured_essay', label: 'Structured Theory / Essay' }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFilterFormat(f.id)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer",
                                        filterFormat === f.id
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBJECT NAVIGATION FOR STUDENTS (when canEdit is false) */}
            {!canEdit && (
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-5 w-fit">
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

            {/* DIRECT FULL-WIDTH ACTIVE LAB RENDERING WITH DUAL-TRACK & SEARCH PARAMS */}
            <div className="space-y-4 sm:space-y-5">
                {activeSubject === 'math' && (
                    <MathLab 
                        canEdit={canEdit} 
                        activeGrade={activeGradeTier} 
                        tenantId={schoolId || undefined} 
                        studentId={studentId || undefined}
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeToggle}
                        searchQuery={debouncedSearch}
                        filterSubject={filterSubject}
                        filterFormat={filterFormat}
                        targetExamId={urlExamId || undefined}
                        targetPaperType={urlPaperType || undefined}
                        assignmentId={urlAssignmentId || undefined}
                        onOpenDispatch={(examId, paperType) => {
                            setSelectedDispatchExamId(examId);
                            if (paperType) setSelectedDispatchPaperType(paperType);
                            setShowDispatchModal(true);
                        }}
                    />
                )}
                {activeSubject === 'english' && (
                    <EnglishMastery 
                        canEdit={canEdit} 
                        activeGrade={activeGradeTier} 
                        tenantId={schoolId || undefined} 
                        studentId={studentId || undefined} 
                    />
                )}
                {activeSubject === 'science' && (
                    <MathLab 
                        canEdit={canEdit} 
                        activeGrade={activeGradeTier} 
                        tenantId={schoolId || undefined} 
                        studentId={studentId || undefined}
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeToggle}
                        searchQuery={debouncedSearch}
                        filterSubject={'science'}
                        filterFormat={filterFormat}
                        targetExamId={urlExamId || undefined}
                        targetPaperType={urlPaperType || undefined}
                        assignmentId={urlAssignmentId || undefined}
                        initialSubject="science"
                        onOpenDispatch={(examId, paperType) => {
                            setSelectedDispatchExamId(examId);
                            if (paperType) setSelectedDispatchPaperType(paperType);
                            setShowDispatchModal(true);
                        }}
                    />
                )}
            </div>

            <style jsx global>{`
                .math-container { max-width: 100%; overflow-x: auto; overflow-y: hidden; }
                .katex-display { margin: 0 !important; }
            `}</style>
    
            {/* Modal to Assign Past Questions to Class */}
            <DispatchAssignmentModal
                isOpen={showDispatchModal}
                onClose={() => setShowDispatchModal(false)}
                schoolId={schoolId || ''}
                userUid={user?.uid || ''}
                userName={user?.displayName || (role === 'Teacher' ? 'Class Teacher' : 'Director')}
                initialExamId={selectedDispatchExamId}
                initialPaperType={selectedDispatchPaperType}
                onDispatched={(newAssignmentId) => {
                    setShowDispatchModal(false);
                }}
            />

        </div>
    );
}

// --- MAIN PAGE WITH SUSPENSE (Required by Next.js for useSearchParams) ---
export default function SeniorAcademyPage() {
    return (
        <Suspense fallback={
            <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-900 min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-400 font-medium">Loading Senior Academy Explorer...</p>
            </div>
        }>
            <SeniorAcademyPageContent />
        </Suspense>
    );
}

