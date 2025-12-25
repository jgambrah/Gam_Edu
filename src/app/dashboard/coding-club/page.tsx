
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Code, MousePointerClick, Youtube, BrainCircuit, Cpu, Play, Palette, Image as ImageIcon, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ScratchEngine from '@/components/ScratchEngine';

export default function CodingClubPage() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      <ScratchEngine />
    </div>
  );
}
