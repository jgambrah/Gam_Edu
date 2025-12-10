
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, onSnapshot, addDoc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Users } from 'lucide-react';

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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Refs (Persistence without re-render)
  const pc = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // --- 1. INITIALIZE CALL ---
  useEffect(() => {
    if (!firestore || !user) return;

    const startCall = async () => {
      // A. Initialize Peer Connection
      pc.current = new RTCPeerConnection(servers);

      // B. Setup Remote Stream Listener
      // When the other person sends video, this fires
      pc.current.ontrack = (event) => {
        console.log("Receiver: Got Remote Track", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
            // Force refresh remote stream
            setRemoteStream((prev) => {
               if(!prev) return event.streams[0];
               prev.addTrack(track);
               return prev;
            })
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // C. Get Local Media (Camera/Mic)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setLocalStream(stream);
      
      // Attach to local video tag
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true; // Mute local to prevent feedback
      }

      // Add tracks to Peer Connection
      stream.getTracks().forEach((track) => {
        pc.current?.addTrack(track, stream);
      });

      // --- SIGNALING LOGIC ---
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
       if (localStream) {
         localStream.getTracks().forEach(track => track.stop());
       }
       if (pc.current) {
         pc.current.close();
       }
    };
  }, [firestore, user, roomId, isHost]);


  // --- MEDIA CONTROLS ---

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicOn(!micOn);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setCameraOn(!cameraOn);
    }
  };

  const startScreenShare = async () => {
    if (!pc.current || !localStream) return;

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

  const stopScreenShare = () => {
      if (!pc.current || !localStream) return;
      
      const cameraTrack = localStream.getVideoTracks()[0];
      
      // Switch back to camera track
      const sender = pc.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
          sender.replaceTrack(cameraTrack);
      }

      // Update Local View
      if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
      }
      setIsScreenSharing(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[80vh] p-4 bg-slate-900 rounded-xl">
      
      {/* MAIN STAGE (Remote Video / Teacher's Screen) */}
      <div className="md:col-span-2 relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-contain"
        />
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm">
            {isHost ? "Student View" : "Teacher's Screen"}
        </div>
      </div>

      {/* SIDEBAR (Local Video & Chat placeholder) */}
      <div className="flex flex-col gap-4">
          <div className="relative bg-slate-800 rounded-lg h-48 overflow-hidden">
             <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror-mode"
                style={{ transform: isScreenSharing ? 'none' : 'scaleX(-1)' }} 
             />
             <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                You ({isHost ? 'Teacher' : 'Student'})
             </div>
          </div>

          {/* CONTROLS */}
          <Card className="p-4 flex flex-wrap gap-2 justify-center bg-slate-800 border-slate-700">
             <Button variant={micOn ? "default" : "destructive"} size="icon" onClick={toggleMic} className="rounded-full">
                {micOn ? <Mic /> : <MicOff />}
             </Button>
             <Button variant={cameraOn ? "default" : "destructive"} size="icon" onClick={toggleCamera} className="rounded-full">
                {cameraOn ? <Video /> : <VideoOff />}
             </Button>
             
             {isHost && (
                 <Button 
                    variant={isScreenSharing ? "destructive" : "secondary"} 
                    size="icon" 
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare} 
                    className="rounded-full"
                    title="Share Screen"
                 >
                    <Monitor />
                 </Button>
             )}
             
             <Button variant="destructive" size="icon" className="rounded-full" onClick={() => window.location.reload()}>
                <PhoneOff />
             </Button>
          </Card>

          {/* CHAT WOULD GO HERE */}
          <div className="flex-1 bg-slate-800 rounded-lg p-4 text-slate-400 text-center text-sm">
             <Users className="mx-auto mb-2 h-8 w-8 opacity-50"/>
             Chat & Participants Area
          </div>
      </div>
    </div>
  );
}
