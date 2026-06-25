// src/app/exam/components/PositionTracking.tsx
"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

/**
 * Props for the PositionTracking component.
 * `data` is expected to be an array of objects where each object contains
 * - `term`: string (e.g., "Term 1")
 * - `position`: number (e.g., 12)
 */
interface PositionTrackingProps {
  data: Array<{ term: string; position: number }> | null;
}

const calculateImprovement = (positions: number[]) => {
  if (positions.length < 2) return 0;
  // improvement is previous - current (positive means moved up)
  return positions[positions.length - 2] - positions[positions.length - 1];
};

const PositionTracking: React.FC<PositionTrackingProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white shadow-lg">
        No position data available.
      </div>
    );
  }

  const positions = data.map((item) => item.position);
  const improvement = calculateImprovement(positions);

  return (
    <section className="rounded-xl bg-white/90 backdrop-blur-sm shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Position Tracking</h2>
      <ul className="space-y-2">
        {data.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center text-gray-800">
            <span>{item.term}: {item.position}<sup>th</sup> Position</span>
          </li>
        ))}
      </ul>
      {improvement !== 0 && (
        <div className="mt-4 flex items-center text-green-700 font-medium">
          {improvement > 0 ? (
            <>
              <ArrowUp className="w-5 h-5 mr-1" />
              Improved by {improvement} place{improvement > 1 ? "s" : ""}
            </>
          ) : (
            <>
              <ArrowDown className="w-5 h-5 mr-1" />
              Declined by {Math.abs(improvement)} place{Math.abs(improvement) > 1 ? "s" : ""}
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default PositionTracking;
