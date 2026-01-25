
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, onSnapshot, addDoc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, User, Wifi, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Whiteboard from '@/components/dashboard/live-classroom/whiteboard';

// Expanded STUN servers list for better connectivity
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
  
  // Media State
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  
  // Connection Diagnostics
  const [connectionState, setConnectionState] = useState<string>('initializing');
  const [signalingState, setSignalingState] = useState<string>('idle');
  const [candidateCount, setCandidateCount] = useState(0); // DEBUG

  // Refs
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const effectRan = useRef(false); // Fix for React Strict Mode

  // --- 1. GET LOCAL MEDIA FIRST ---
  useEffect(() => {
    const getMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true;
            }
        } catch (err) {
            console.error("Media Error", err);
            toast({ variant: 'destructive', title: "Media Error", description: "Could not access camera/mic." });
        }
    };
    getMedia();

    return () => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [toast]);


  // --- 2. INITIALIZE CALL ---
  useEffect(() => {
    // Prevent double-run in React Strict Mode
    if (effectRan.current) return;
    if (!firestore || !user || !roomId || !localStreamRef.current) return;

    effectRan.current = true;

    const startCall = async () => {
      console.log(`🚀 Starting call as ${isHost ? 'HOST' : 'GUEST'}`);
      setSignalingState('starting');

      // --- CLEANUP OLD DATA (Host Only) ---
      const roomRef = doc(firestore, 'active_classes', roomId);
      const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
      const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

      if (isHost) {
          console.log("Cleaning up old room data...");
          await setDoc(roomRef, { created: serverTimestamp() });
      }

      // A. Initialize Peer Connection
      pc.current = new RTCPeerConnection(servers);

      // Add local tracks
      localStreamRef.current?.getTracks().forEach((track) => {
          pc.current?.addTrack(track, localStreamRef.current!);
      });

      // B. Monitor Connection State
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

      // C. Handle Remote Stream
      pc.current.ontrack = (event) => {
        console.log("🎥 Stream received from remote");
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // --- SIGNALING LOGIC ---
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
        setSignalingState('creating offer');

        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
             addDoc(callerCandidatesCollection, event.candidate.toJSON());
          }
        };

        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        
        await updateDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });
        setSignalingState('waiting for student...');

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

        onSnapshot(calleeCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                const candidate = new RTCIceCandidate(data);
                if (pc.current?.remoteDescription) {
                    pc.current.addIceCandidate(candidate);
                } else {
                    candidatesQueue.current.push(data);
                }
            }
          });
        });

      } else { // GUEST
        setSignalingState('looking for teacher...');

        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
             addDoc(calleeCandidatesCollection, event.candidate.toJSON());
          }
        };

        onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            
            if (!pc.current?.currentRemoteDescription && data?.offer) {
                console.log("✅ Received Offer from Teacher!");
                setSignalingState('creating answer...');
                
                const rtcSessionDescription = new RTCSessionDescription(data.offer);
                await pc.current.setRemoteDescription(rtcSessionDescription);
                
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                
                await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
                setSignalingState('connecting...');
                await processCandidates();
            }
        });

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
  
  const handleHangup = () => window.location.reload();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh] p-4 bg-slate-900 rounded-xl relative">
      <div className="md:col-span-3 relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {showWhiteboard ? <Whiteboard onClose={() => setShowWhiteboard(false)} /> : <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" />}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className={`px-3 py-1 rounded text-white text-xs font-bold flex items-center gap-2 ${
                connectionState === 'connected' ? 'bg-green-600' : 
                connectionState === 'failed' || connectionState === 'disconnected' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
                <Wifi className="h-3 w-3"/>
                {connectionState.toUpperCase()}
            </div>
            <div className="bg-black/50 text-white px-3 py-1 rounded text-xs">
                Signal: {signalingState}
            </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
          <div className="relative bg-slate-800 rounded-lg h-48 overflow-hidden border border-slate-700">
             <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror-mode" />
             <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded flex items-center gap-1">
                <User className="w-3 h-3"/> You
             </div>
          </div>
          <Card className="p-4 flex flex-col gap-3 bg-slate-800 border-slate-700">
             <div className="grid grid-cols-2 gap-2">
                <Button variant={micOn ? "secondary" : "destructive"} onClick={toggleMic} size="sm">{micOn ? <Mic /> : <MicOff />}</Button>
                <Button variant={cameraOn ? "secondary" : "destructive"} onClick={toggleCamera} size="sm">{cameraOn ? <Video /> : <VideoOff />}</Button>
             </div>
              <Button variant="outline" size="sm" onClick={() => pc.current?.restartIce()} className="w-full mt-2 border-yellow-500 text-yellow-500">
                <RefreshCw className="w-4 h-4 mr-2"/> Retry Connection
             </Button>
             <Button variant="destructive" className="w-full mt-2" onClick={handleHangup}><PhoneOff className="w-4 h-4 mr-2"/> End Call</Button>
          </Card>
      </div>
    </div>
  );
}
