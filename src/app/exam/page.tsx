// src/app/exam/page.tsx
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import ResultsSummary from "@/app/exam/components/ResultsSummary";
import PositionTracking from "@/app/exam/components/PositionTracking";

/** Example static data for the Examination Dashboard */
const exampleResults = [
  { exam: "Mid-Term", score: 79 },
  { exam: "End-Term", score: 83 },
  { exam: "Mock Exam", score: 85 },
];

const examplePositions = [
  { term: "Term 1", position: 12 },
  { term: "Term 2", position: 8 },
  { term: "Term 3", position: 5 },
];

export default function ExamDashboard() {
  // Simulate loading for demo purposes
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold tracking-tighter text-foreground uppercase mb-6">
        Examination Dashboard
      </h1>
      <ResultsSummary data={exampleResults} />
      <PositionTracking data={examplePositions} />
    </div>
  );
}
