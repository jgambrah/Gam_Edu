'use client';
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-10 text-center bg-white border-8 border-black rounded-[3rem] m-4">
      <h2 className="text-3xl font-black mb-4 uppercase">System Snag!</h2>
      <p className="text-red-500 font-bold mb-6">{error.message}</p>
      <button onClick={() => reset()} className="px-8 py-3 bg-black text-white rounded-2xl font-black uppercase">
        Try to Wake Dr. GAM again
      </button>
    </div>
  );
}
