'use client';
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-10 bg-white border-8 border-black rounded-[3rem] text-center">
      <h2 className="text-3xl font-black uppercase mb-4">Dr. GAM hit a snag!</h2>
      <p className="text-red-500 font-bold mb-6">{error.message}</p>
      <button onClick={() => reset()} className="px-8 py-3 bg-black text-white rounded-2xl font-black uppercase">Try Again</button>
    </div>
  );
}
