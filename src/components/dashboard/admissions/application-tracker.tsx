'use client';

import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

// The steps involved in your process
const STEPS = [
  { id: 'submitted', label: 'Application Submitted' },
  { id: 'review', label: 'Under Review' },
  { id: 'decision', label: 'Final Decision' },
  { id: 'enrolled', label: 'Enrolled' }
];

export function ApplicationTracker({ status }: { status: string }) {
  // Map current status to a step index
  let currentStepIndex = 0;
  let isRejected = status === 'Rejected';

  if (status === 'Pending Review') currentStepIndex = 1;
  if (status === 'Admitted' || status === 'Rejected') currentStepIndex = 2;
  if (status === 'Enrolled') currentStepIndex = 3; 

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between w-full">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />
        
        {/* Active Line */}
        <div 
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 -z-10 transition-all duration-500 ${isRejected ? 'bg-red-200' : 'bg-green-500'}`} 
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }} 
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          let Icon = Circle;
          let colorClass = "text-slate-300 bg-white";

          if (isCompleted) {
            Icon = CheckCircle2;
            colorClass = "text-green-600 bg-white fill-green-50";
          } else if (isCurrent) {
            if (isRejected && index === 2) {
                Icon = XCircle;
                colorClass = "text-red-600 bg-white fill-red-50";
            } else {
                Icon = Clock;
                colorClass = "text-blue-600 bg-white fill-blue-50 animate-pulse";
            }
          }

          return (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className={`z-10 rounded-full p-1 ${colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`text-xs mt-2 font-medium w-24 ${isCurrent ? 'text-black' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
