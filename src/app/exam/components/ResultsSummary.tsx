// src/app/exam/components/ResultsSummary.tsx
"use client";

import React from "react";

/**
 * Props for the ResultsSummary component.
 * `data` is expected to be an array of objects where each object contains
 * - `exam`: string (e.g., "Mid-Term")
 * - `score`: number (percentage value, e.g., 79)
 */
interface ResultsSummaryProps {
  data: Array<{ exam: string; score: number }> | null;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
        No exam data available.
      </div>
    );
  }

  return (
    <section className="rounded-xl bg-white/90 backdrop-blur-sm shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results Summary</h2>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">Exam</th>
            <th className="px-4 py-2 text-left text-gray-600">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-4 py-2 text-gray-800">{item.exam}</td>
              <td className="px-4 py-2 text-gray-800">
                {item.score}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ResultsSummary;
