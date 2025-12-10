'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, onSnapshot, addDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, User, 
    Smile, PenTool, Disc, Download, Users, AlertCircle, Wifi 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Whiteboard from './whiteboard';

// Standard Google STUN servers (Free)
const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
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
  const [isRecording, setIsRecording] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  
  // Connection Diagnostics
  const [connectionState, setConnectionState] = useState<string>('initializing');
  const [participantCount, setParticipantCount] = useState(1);

  // Refs
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  // --- 1. INITIALIZE CALL ---
  useEffect(() => {
    if (!firestore || !user || !roomId) return;

    const startCall = async () => {
      console.log(`Starting call as ${isHost ? 'HOST' : 'GUEST'}`);
      
      // 1. Create Peer Connection
      pc.current = new RTCPeerConnection(servers);

      // Monitor Connection State
      pc.current.oniceconnectionstatechange = () => {
        const state = pc.current?.iceConnectionState || 'unknown';
        console.log("ICE State:", state);
        setConnectionState(state);
        if (state === 'connected') setParticipantCount(2);
        else setParticipantCount(1);
      };

      // 2. Handle Remote Stream
      pc.current.ontrack = (event) => {
        console.log("Stream received:", event.streams[0]);
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      try {
        // 3. Get Local Media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true;
        }

        stream.getTracks().forEach((track) => {
            pc.current?.addTrack(track, stream);
        });

      } catch (err) {
          console.error("Media Error", err);
          toast({ variant: 'destructive', title: "Camera Error", description: "Could not access camera/mic." });
      }

      // --- SIGNALING ---
      const roomRef = doc(firestore, 'active_classes', roomId);
      const callerCandidates = collection(roomRef, 'callerCandidates');
      const calleeCandidates = collection(roomRef, 'calleeCandidates');

      if (isHost) {
        // === HOST ===
        pc.current.onicecandidate = (event) => {
          if (event.candidate) addDoc(callerCandidates, event.candidate.toJSON());
        };

        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        await setDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });

        onSnapshot(roomRef, (snapshot) => {
          const data = snapshot.data();
          if (!pc.current?.currentRemoteDescription && data?.answer) {
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            pc.current.setRemoteDescription(rtcSessionDescription);
          }
        });

        onSnapshot(calleeCandidates, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.current?.addIceCandidate(candidate);
            }
          });
        });

      } else {
        // === GUEST ===
        pc.current.onicecandidate = (event) => {
          if (event.candidate) addDoc(calleeCandidates, event.candidate.toJSON());
        };

        // Listen for Offer
        const unsubscribeRoom = onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (!pc.current?.currentRemoteDescription && data?.offer) {
                const rtcSessionDescription = new RTCSessionDescription(data.offer);
                await pc.current.setRemoteDescription(rtcSessionDescription);
                
                // Process any queued candidates
                iceCandidateQueue.current.forEach(candidate => pc.current?.addIceCandidate(candidate));
                iceCandidateQueue.current = [];
                
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
            }
        });

        // Listen for Candidates
        onSnapshot(callerCandidates, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                // FIX: If remote description isn't set, queue the candidate.
                if (pc.current?.remoteDescription) {
                    pc.current?.addIceCandidate(candidate);
                } else {
                    iceCandidateQueue.current.push(candidate);
                }
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

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setCameraOn(!cameraOn);
  };

  const startScreenShare = async () => {
    if (!pc.current) return;
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = pc.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);
        screenTrack.onended = () => stopScreenShare();
    } catch (err) { console.error(err); }
  };

  const stopScreenShare = async () => {
      if (!pc.current || !localStreamRef.current) return;
      const cameraTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = pc.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender) sender.replaceTrack(cameraTrack);
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
      setIsScreenSharing(false);
  };
  
    const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recordedChunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Class-Recording-${new Date().toISOString()}.webm`;
            a.click();
            setIsRecording(false);
            stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setIsRecording(true);
        toast({ title: "Recording Started", description: "Recording your screen and audio." });
    } catch (e) { console.error(e); }
  };

  const stopRecording = () => {
      mediaRecorderRef.current?.stop();
  };
  
  const sendReaction = (emoji: string) => {
      setReaction(emoji);
      setTimeout(() => setReaction(null), 2000);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh] p-4 bg-slate-900 rounded-xl relative">
      
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

        <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-3 py-1 rounded text-white text-xs font-bold flex items-center gap-2 ${
                connectionState === 'connected' ? 'bg-green-600' : 
                connectionState === 'failed' || connectionState === 'disconnected' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
                <Wifi className="h-3 w-3"/>
                {connectionState.toUpperCase()}
            </div>
        </div>

        {reaction && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-6xl pointer-events-none">
                {reaction}
            </div>
        )}
      </div>

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
             <div className="absolute top-2 right-2 flex gap-1">
                 {!micOn && <div className="bg-red-500 p-1 rounded-full"><MicOff className="w-3 h-3 text-white"/></div>}
                 {!cameraOn && <div className="bg-red-500 p-1 rounded-full"><VideoOff className="w-3 h-3 text-white"/></div>}
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
             
             {isHost && (
                 <>
                    <Button variant={isScreenSharing ? "destructive" : "outline"} onClick={isScreenSharing ? stopScreenShare : startScreenShare} size="sm" className="w-full justify-start border-slate-600 text-slate-200">
                        <Monitor className="w-4 h-4 mr-2"/> {isScreenSharing ? "Stop Share" : "Share Screen"}
                    </Button>
                    <Button variant={showWhiteboard ? "destructive" : "outline"} onClick={() => setShowWhiteboard(!showWhiteboard)} size="sm" className="w-full justify-start border-slate-600 text-slate-200">
                        <PenTool className="w-4 h-4 mr-2"/> Whiteboard
                    </Button>
                    <Button variant={isRecording ? "destructive" : "outline"} onClick={isRecording ? stopRecording : startRecording} size="sm" className="w-full justify-start border-slate-600 text-slate-200">
                        {isRecording ? <Disc className="w-4 h-4 mr-2 animate-pulse"/> : <Download className="w-4 h-4 mr-2"/>} 
                        {isRecording ? "Stop Record" : "Record Class"}
                    </Button>
                 </>
             )}
             
             <div className="flex gap-1 justify-center pt-2 border-t border-slate-700">
                <button onClick={() => sendReaction("👍")} className="text-xl hover:scale-125 transition">👍</button>
                <button onClick={() => sendReaction("👏")} className="text-xl hover:scale-125 transition">👏</button>
                <button onClick={() => sendReaction("❤️")} className="text-xl hover:scale-125 transition">❤️</button>
                <button onClick={() => sendReaction("🤔")} className="text-xl hover:scale-125 transition">🤔</button>
             </div>

             <Button variant="destructive" className="w-full mt-2" onClick={() => window.location.reload()}>
                <PhoneOff className="w-4 h-4 mr-2"/> End Call
             </Button>

             <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                 <Users className="h-3 w-3"/> {participantCount} Active
             </div>
          </Card>
      </div>
    </div>
  );
}