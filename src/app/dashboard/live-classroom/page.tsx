
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useRole } from '@/context/role-context';

const LiveRoomClient = dynamic(
  () => import('./live-room'), 
  {
    loading: () => <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>,
    ssr: false, // This is crucial for WebRTC
  }
);

export default function LiveClassroomPage() {
  const { role } = useRole();
  const isHost = role === 'Teacher' || role === 'Administrator' || role === 'Director';
  
  // For demonstration, we'll use a fixed room ID.
  // In a real app, this would come from URL params or a database.
  const roomId = "general-classroom";

  return <LiveRoomClient roomId={roomId} isHost={isHost} />;
}
