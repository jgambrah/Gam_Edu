
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, onSnapshot, addDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, User } from 'lucide-react';

// 1. STUN SERVERS (Crucial for connecting through routers)
const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function LiveRoom({ roomId, isHost }: { roomId: string, isHost: boolean }) {
  const firestore = useFirestore();
  const { user } = useUser();
  
  // State
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Refs (Persistence without re-render)
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // --- 1. INITIALIZE CALL ---
  useEffect(() => {
    if (!firestore || !user || !roomId) return;

    const startCall = async () => {
      // A. Initialize Peer Connection
      pc.current = new RTCPeerConnection(servers);

      // Listen for connection state changes
      pc.current.onconnectionstatechange = () => {
        if (pc.current?.connectionState === 'connected') {
            setConnectionStatus('connected');
        } else if (pc.current?.connectionState === 'disconnected') {
            setConnectionStatus('disconnected');
        }
      };

      // B. Setup Remote Stream Listener
      // When the other person sends video, this fires
      pc.current.ontrack = (event) => {
        console.log("Receiver: Got Remote Track", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
             // Attach to remote video element
             if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
             }
        });
      };

      try {
        // C. Get Local Media (Camera/Mic)
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        localStreamRef.current = stream;
        
        // Attach to local video tag
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true; // Mute local to prevent feedback
        }

        // Add tracks to Peer Connection
        stream.getTracks().forEach((track) => {
            pc.current?.addTrack(track, stream);
        });

      } catch (err) {
          console.error("Error accessing media devices:", err);
          alert("Could not access camera/microphone. Please allow permissions.");
      }

      // --- SIGNALING LOGIC (Firestore) ---
      const roomRef = doc(firestore, 'active_classes', roomId);
      const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
      const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

      if (isHost) {
        // === HOST LOGIC (TEACHER) ===
        console.log("Host: Creating Offer...");
        
        // 1. Handle ICE Candidates
        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
            addDoc(callerCandidatesCollection, event.candidate.toJSON());
          }
        };

        // 2. Create Offer
        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);

        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };

        // Save Offer to Firestore
        await setDoc(roomRef, { offer });

        // 3. Listen for Answer from Student
        onSnapshot(roomRef, (snapshot) => {
          const data = snapshot.data();
          if (!pc.current?.currentRemoteDescription && data?.answer) {
            console.log("Host: Received Answer");
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.current.setRemoteDescription(answerDescription);
          }
        });

        // 4. Listen for Student's ICE Candidates
        onSnapshot(calleeCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              pc.current?.addIceCandidate(candidate);
            }
          });
        });

      } else {
        // === GUEST LOGIC (STUDENT) ===
        console.log("Student: Joining Room...");

        // 1. Handle ICE Candidates
        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
            addDoc(calleeCandidatesCollection, event.candidate.toJSON());
          }
        };

        // 2. Read Offer from Teacher
        const roomSnapshot = await getDoc(roomRef);
        const roomData = roomSnapshot.data();

        if (roomData?.offer) {
            await pc.current.setRemoteDescription(new RTCSessionDescription(roomData.offer));
            
            // 3. Create Answer
            const answerDescription = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await updateDoc(roomRef, { answer });
        }

        // 4. Listen for Teacher's ICE Candidates
        onSnapshot(callerCandidatesCollection, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              pc.current?.addIceCandidate(candidate);
            }
          });
        });
      }
    };

    startCall();

    // Cleanup on unmount
    return () => {
       // Stop all tracks (Cam/Mic)
       if (localStreamRef.current) {
         localStreamRef.current.getTracks().forEach(track => track.stop());
       }
       // Close connection
       if (pc.current) {
         pc.current.close();
       }
    };
  }, [firestore, user, roomId, isHost]);


  // --- MEDIA CONTROLS ---

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicOn(!micOn);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setCameraOn(!cameraOn);
    }
  };

  const startScreenShare = async () => {
    if (!pc.current) return;

    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace the Video Track in the Peer Connection
        const sender = pc.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
            sender.replaceTrack(screenTrack);
        }

        // Update Local View
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
        }

        setIsScreenSharing(true);

        // Handle Stop Sharing (via browser button)
        screenTrack.onended = () => {
            stopScreenShare();
        };

    } catch (err) {
        console.error("Error sharing screen:", err);
    }
  };

  const stopScreenShare = async () => {
      if (!pc.current) return;
      
      // Get Camera stream again
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const cameraTrack = cameraStream.getVideoTracks()[0];
      
      // Switch back to camera track
      const sender = pc.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
          sender.replaceTrack(cameraTrack);
      }

      // Update Local View
      if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
  };

  const handleHangup = () => {
      // Just reload the page or navigate away to kill the connection
      window.location.reload(); 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh] p-4 bg-slate-900 rounded-xl">
      
      {/* MAIN STAGE (Remote Video / Teacher's Screen) */}
      <div className="md:col-span-3 relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-contain"
        />
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
            {connectionStatus === 'connected' ? (isHost ? "Student Connected" : "Teacher Connected") : "Waiting for connection..."}
        </div>
      </div>

      {/* SIDEBAR (Local Video & Controls) */}
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
                <User className="w-3 h-3"/> You ({isHost ? 'Teacher' : 'Student'})
             </div>
             <div className="absolute top-2 right-2 flex gap-1">
                 {!micOn && <div className="bg-red-500 p-1 rounded-full"><MicOff className="w-3 h-3 text-white"/></div>}
                 {!cameraOn && <div className="bg-red-500 p-1 rounded-full"><VideoOff className="w-3 h-3 text-white"/></div>}
             </div>
          </div>

          {/* CONTROLS */}
          <Card className="p-4 flex flex-col gap-4 bg-slate-800 border-slate-700">
             <div className="grid grid-cols-2 gap-2">
                <Button variant={micOn ? "secondary" : "destructive"} onClick={toggleMic} className="w-full">
                    {micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}
                </Button>
                <Button variant={cameraOn ? "secondary" : "destructive"} onClick={toggleCamera} className="w-full">
                    {cameraOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}
                </Button>
             </div>
             
             {isHost && (
                 <Button 
                    variant={isScreenSharing ? "destructive" : "default"} 
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare} 
                    className="w-full"
                 >
                    <Monitor className="w-4 h-4 mr-2"/> {isScreenSharing ? "Stop Share" : "Share Screen"}
                 </Button>
             )}
             
             <Button variant="destructive" className="w-full mt-4" onClick={handleHangup}>
                <PhoneOff className="w-4 h-4 mr-2"/> End Call
             </Button>
          </Card>
      </div>
    </div>
  );
}
