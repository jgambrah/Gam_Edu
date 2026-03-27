'use client';

import { format } from "date-fns";

interface Props {
  url?: string | null;
  name: string;
  role: string;
  date?: any;
}

/**
 * High-grade component for rendering professional digital signatures.
 * Uses mix-blend-multiply to ensure white backgrounds become transparent.
 * Now includes robust date parsing to prevent "Invalid time value" errors.
 */
export default function SignatureStamp({ url, name, role, date }: Props) {
  
  const getFormattedDate = (d: any) => {
    if (!d) return null;
    
    try {
      // 1. Handle Firestore Timestamp objects
      if (typeof d.toDate === 'function') {
        return format(d.toDate(), 'PPP p');
      }
      
      // 2. Handle native JS Date objects
      if (d instanceof Date) {
        if (isNaN(d.getTime())) return null;
        return format(d, 'PPP p');
      }

      // 3. Handle string or number inputs
      if (typeof d === 'string' || typeof d === 'number') {
        const parsed = new Date(d);
        if (!isNaN(parsed.getTime())) {
          return format(parsed, 'PPP p');
        }
      }

      // 4. Fallback for Firestore sentinels or other non-date objects
      return null;
    } catch (e) {
      console.warn("SignatureStamp: Date parsing failed", e);
      return null;
    }
  };

  const formattedDate = getFormattedDate(date);

  return (
    <div className="flex flex-col items-center space-y-2 min-w-[200px]">
      <div className="relative h-20 w-full flex items-center justify-center">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={url} 
            alt="Digital Signature" 
            className="h-full w-auto object-contain mix-blend-multiply filter contrast-125" 
          />
        ) : (
          <div className="text-slate-300 italic text-[10px] uppercase border-2 border-dashed border-slate-100 p-4 rounded-xl text-center">
            Awaiting Digital Signature
          </div>
        )}
      </div>
      
      <div className="w-full border-t-2 border-slate-900 pt-2 text-center">
        <p className="text-[10px] font-black uppercase text-black leading-none">{name || 'N/A'}</p>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{role}</p>
        {formattedDate && (
          <p className="text-[7px] text-slate-400 italic mt-1">
            Signed: {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
}
