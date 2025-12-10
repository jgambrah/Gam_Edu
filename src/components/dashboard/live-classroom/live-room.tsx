
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

// Expanded STUN servers list for better connectivity
const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    { urls: ['stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302'] },
  ],
  iceCandidatePoolSize: 10,
};

export default function LiveRoom({ roomId, isHost }: { roomId: string, isHost: boolean }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Media State
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  
  // Connection Diagnostics
  const [connectionState, setConnectionState] = useState<string>('initializing');
  const [signalingState, setSignalingState] = useState<string>('idle');

  // Refs
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidatesQueue = useRef<RTCIceCandidateInit[]>([]); 
  const effectRan = useRef(false); // Fix for React Strict Mode

  // --- 1. INITIALIZE CALL ---
  useEffect(() => {
    // Prevent double-run in React Strict Mode
    if (effectRan.current) return;
    if (!firestore || !user || !roomId) return;

    effectRan.current = true;

    const startCall = async () => {
      console.log(`🚀 Starting call as ${isHost ? 'HOST' : 'GUEST'}`);
      setSignalingState('starting');

      // --- CLEANUP OLD DATA (Host Only) ---
      // If teacher starts, clear previous handshake data to prevent "Dead Offer" bugs
      const roomRef = doc(firestore, 'active_classes', roomId);
      const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
      const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

      if (isHost) {
          console.log("Cleaning up old room data...");
          // We overwrite the room doc with empty data first
          await setDoc(roomRef, { created: new Date() }); 
          // Note: Ideally we'd delete subcollections too, but overwriting the main offer triggers a reset
      }

      // A. Initialize Peer Connection
      pc.current = new RTCPeerConnection(servers);

      // Monitor Connection State
      pc.current.onconnectionstatechange = () => {
        console.log("📡 Connection State:", pc.current?.connectionState);
        setConnectionState(pc.current?.connectionState || 'unknown');
      };

      pc.current.oniceconnectionstatechange = () => {
        console.log("❄️ ICE State:", pc.current?.iceConnectionState);
        if (pc.current?.iceConnectionState === 'failed') {
            setConnectionState('failed (firewall blocked)');
            pc.current.restartIce();
        }
      };

      // B. Handle Remote Stream
      pc.current.ontrack = (event) => {
        console.log("🎥 Stream received from remote");
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      try {
        // C. Get Local Media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true; // Always mute self
        }

        stream.getTracks().forEach((track) => {
            pc.current?.addTrack(track, stream);
        });
      } catch (err) {
          console.error("Media Error", err);
          toast({ variant: 'destructive', title: "Media Error", description: "Camera/Mic blocked." });
      }

      // --- SIGNALING LOGIC ---
      
      // Helper: Add queued candidates
      const processCandidates = async () => {
          if (!pc.current || !pc.current.remoteDescription) return;
          while (candidatesQueue.current.length > 0) {
              const candidate = candidatesQueue.current.shift();
              if (candidate) {
                  try {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                  } catch (e) { console.error("Error adding candidate", e); }
              }
          }
      };

      if (isHost) {
        // === HOST (TEACHER) ===
        setSignalingState('creating offer');

        // 1. Listen for ICE candidates generated by my PC
        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
             addDoc(callerCandidatesCollection, event.candidate.toJSON());
          }
        };

        // 2. Create Offer
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        
        const roomWithOffer = {
            offer: { type: offer.type, sdp: offer.sdp },
        };

        await updateDoc(roomRef, roomWithOffer);
        setSignalingState('waiting for student...');

        // 3. Listen for Answer
        onSnapshot(roomRef, async (snapshot) => {
          const data = snapshot.data();
          if (!pc.current?.currentRemoteDescription && data?.answer) {
            console.log("✅ Received Answer from Student!");
            setSignalingState('connecting...');
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await pc.current.setRemoteDescription(rtcSessionDescription);
            await processCandidates(); 
          }
        });

        // 4. Listen for Remote ICE Candidates
        onSnapshot(calleeCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                if (pc.current?.remoteDescription) {
                    pc.current.addIceCandidate(new RTCIceCandidate(data));
                } else {
                    candidatesQueue.current.push(data);
                }
            }
          });
        });

      } else {
        // === GUEST (STUDENT) ===
        setSignalingState('looking for teacher...');

        // 1. Listen for my ICE candidates
        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
             addDoc(calleeCandidatesCollection, event.candidate.toJSON());
          }
        };

        // 2. Listen for Room Data (Offer)
        onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            
            // If we have an Offer but haven't answered yet
            if (!pc.current?.currentRemoteDescription && data?.offer) {
                console.log("✅ Received Offer from Teacher!");
                setSignalingState('creating answer...');
                
                const rtcSessionDescription = new RTCSessionDescription(data.offer);
                await pc.current.setRemoteDescription(rtcSessionDescription);
                
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                
                const roomWithAnswer = {
                    answer: { type: answer.type, sdp: answer.sdp },
                };
                
                await updateDoc(roomRef, roomWithAnswer);
                setSignalingState('connecting...');
                await processCandidates();
            }
        });

        // 3. Listen for Remote ICE Candidates
        onSnapshot(callerCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                if (pc.current?.remoteDescription) {
                    pc.current.addIceCandidate(new RTCIceCandidate(data));
                } else {
                    candidatesQueue.current.push(data);
                }
            }
          });
        });
      }
    };

    startCall();

    return () => {
       // Cleanup logic
       localStreamRef.current?.getTracks().forEach(track => track.stop());
       pc.current?.close();
    };
  }, [firestore, user, roomId, isHost, toast]);

  // --- CONTROLS ---
  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setCameraOn(!cameraOn);
  };

  const handleHangup = () => {
      window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh] p-4 bg-slate-900 rounded-xl relative">
      
      {/* MAIN STAGE */}
      <div className="md:col-span-3 relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {showWhiteboard ? (
            <Whiteboard onClose={() => setShowWhiteboard(false)} />
        ) : (
            <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain"
            />
        )}

        {/* STATUS BADGE */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className={`px-3 py-1 rounded text-white text-xs font-bold flex items-center gap-2 ${
                connectionState === 'connected' ? 'bg-green-600' : 
                connectionState === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
                <Wifi className="h-3 w-3"/>
                {connectionState.toUpperCase()}
            </div>
            <div className="bg-black/50 text-white px-3 py-1 rounded text-xs">
                Signal: {signalingState}
            </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="flex flex-col gap-4">
          <div className="relative bg-slate-800 rounded-lg h-48 overflow-hidden border border-slate-700">
             <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror-mode"
                style={{ transform: isScreenSharing ? 'none' : 'scaleX(-1)' }} 
             />
             <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded flex items-center gap-1">
                <User className="w-3 h-3"/> You
             </div>
          </div>

          <Card className="p-4 flex flex-col gap-3 bg-slate-800 border-slate-700">
             <div className="grid grid-cols-2 gap-2">
                <Button variant={micOn ? "secondary" : "destructive"} onClick={toggleMic} size="sm">
                    {micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}
                </Button>
                <Button variant={cameraOn ? "secondary" : "destructive"} onClick={toggleCamera} size="sm">
                    {cameraOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}
                </Button>
             </div>
             
             <Button variant="destructive" className="w-full mt-2" onClick={handleHangup}>
                <PhoneOff className="w-4 h-4 mr-2"/> End Call
             </Button>
          </Card>
      </div>
    </div>
  );
}
