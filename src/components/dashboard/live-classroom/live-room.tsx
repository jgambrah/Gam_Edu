
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, onSnapshot, addDoc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, User, Wifi, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Whiteboard from './whiteboard';

const servers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.ekiga.net' },
    { urls: 'stun:stun.ideasip.com' },
    { urls: 'stun:stun.schlund.de' },
    { urls: 'stun:stun.voiparound.com' },
    { urls: 'stun:stun.voipstunt.com' },
  ],
  iceCandidatePoolSize: 10,
};

export default function LiveRoom({ roomId, isHost }: { roomId: string, isHost: boolean }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  // State
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  
  // Diagnostics
  const [connectionState, setConnectionState] = useState<string>('init');
  const [signalingState, setSignalingState] = useState<string>('idle');
  const [candidateCount, setCandidateCount] = useState(0); // DEBUG

  // Refs
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current || !firestore || !user || !roomId) return;
    effectRan.current = true;

    const startCall = async () => {
      console.log(`🚀 Starting call as ${isHost ? 'HOST' : 'GUEST'}`);
      
      const roomRef = doc(firestore, 'active_classes', roomId);
      const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
      const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

      // 1. SETUP PC
      pc.current = new RTCPeerConnection(servers);

      pc.current.onconnectionstatechange = () => {
        setConnectionState(pc.current?.connectionState || 'unknown');
        if(pc.current?.connectionState === 'failed') {
            toast({ variant: 'destructive', title: "Connection Failed", description: "Firewall blocked the connection." });
        }
      };
      
      pc.current.oniceconnectionstatechange = () => {
         console.log("ICE State:", pc.current?.iceConnectionState);
      };

      // 2. ICE Candidates (The Address Book)
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
           setCandidateCount(prev => prev + 1);
           // Host writes to 'caller', Guest writes to 'callee'
           const targetColl = isHost ? callerCandidatesCollection : calleeCandidatesCollection;
           addDoc(targetColl, event.candidate.toJSON());
        }
      };

      // 3. Media
      pc.current.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true;
        }
        stream.getTracks().forEach((track) => pc.current?.addTrack(track, stream));
      } catch (err) {
          console.error("Media Error", err);
      }

      // --- SIGNALING ---

      if (isHost) {
        // HOST: Create Offer
        setSignalingState('Creating Room...');
        
        // Reset Room
        await setDoc(roomRef, { created: serverTimestamp() });

        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        
        await updateDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });
        setSignalingState('Waiting for student...');

        // Listen for Answer
        onSnapshot(roomRef, async (snapshot) => {
          const data = snapshot.data();
          if (!pc.current?.currentRemoteDescription && data?.answer) {
            setSignalingState('Connecting...');
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await pc.current.setRemoteDescription(rtcSessionDescription);
          }
        });

        // Listen for Student Candidates
        onSnapshot(calleeCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                await pc.current?.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });

      } else {
        // GUEST: Join Room
        setSignalingState('Looking for room...');

        // Listen for Offer
        onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (!pc.current?.currentRemoteDescription && data?.offer) {
                setSignalingState('Found Room. Connecting...');
                const rtcSessionDescription = new RTCSessionDescription(data.offer);
                await pc.current.setRemoteDescription(rtcSessionDescription);
                
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                
                await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
            }
        });

        // Listen for Teacher Candidates
        onSnapshot(callerCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                await pc.current?.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
      }
    };

    startCall();

    return () => {
       localStreamRef.current?.getTracks().forEach(track => track.stop());
       pc.current?.close();
    };
  }, [firestore, user, roomId, isHost, toast]);

  // --- CONTROLS --- (Keep the toggle functions from previous code)
  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setCameraOn(!cameraOn);
  };
  
  const handleHangup = () => window.location.reload();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh] p-4 bg-slate-900 rounded-xl relative">
      <div className="md:col-span-3 relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {showWhiteboard ? <Whiteboard onClose={() => setShowWhiteboard(false)} /> : <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" />}
        <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-white text-xs">
            Status: {connectionState.toUpperCase()} | Signal: {signalingState} | Candidates: {candidateCount}
        </div>
      </div>
      <div className="flex flex-col gap-4">
          <div className="relative bg-slate-800 rounded-lg h-48 overflow-hidden border border-slate-700">
             <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror-mode" />
          </div>
          <Card className="p-4 flex flex-col gap-3 bg-slate-800 border-slate-700">
             <div className="grid grid-cols-2 gap-2">
                <Button variant={micOn ? "secondary" : "destructive"} onClick={toggleMic} size="sm">{micOn ? <Mic /> : <MicOff />}</Button>
                <Button variant={cameraOn ? "secondary" : "destructive"} onClick={toggleCamera} size="sm">{cameraOn ? <Video /> : <VideoOff />}</Button>
             </div>
             <Button variant="destructive" className="w-full mt-2" onClick={handleHangup}><PhoneOff className="w-4 h-4 mr-2"/> End Call</Button>
          </Card>
      </div>
    </div>
  );
}
