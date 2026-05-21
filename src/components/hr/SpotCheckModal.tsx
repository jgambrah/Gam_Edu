'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, updateDoc, arrayUnion, getDoc, Timestamp } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Loader2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { getDistanceInMeters } from '@/lib/geo';

export function SpotCheckModal() {
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [activeCheck, setActiveCheck] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Only staff who are NOT admins are targets for spot checks
    const isTargetStaff = useMemo(() => {
        if (!role) return false;
        const targetRoles = ['Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer'];
        return targetRoles.includes(role);
    }, [role]);

    // 1. Listen for Active Spot Checks - ONLY for target staff
    const checkQuery = useMemoFirebase(() => (firestore && schoolId && isTargetStaff) ? query(
        collection(firestore, 'spot_checks'),
        where('schoolId', '==', schoolId),
        where('status', '==', 'active'),
        orderBy('initiatedAt', 'desc'),
        limit(1)
    ) : null, [firestore, schoolId, isTargetStaff]);
    
    const { data: checks } = useCollection<any>(checkQuery);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
            toast({ variant: 'destructive', title: "Camera Error", description: "Please enable camera access for verification." });
        }
    }, [toast]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setCameraActive(false);
        }
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return null;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUri = canvas.toDataURL('image/jpeg');
            setImageDataUri(dataUri);
            return dataUri;
        }
        return null;
    };

    useEffect(() => {
        if (checks && checks.length > 0 && user && isTargetStaff) {
            const check = checks[0];
            const now = new Date();
            const expires = check.expiresAt?.toDate();
            const hasResponded = check.responses?.some((r: any) => r.staffId === user.uid);
            
            if (expires && now < expires && !hasResponded) {
                setActiveCheck(check);
                startCamera();
            } else {
                setActiveCheck(null);
                stopCamera();
            }
        } else {
            setActiveCheck(null);
            stopCamera();
        }
        
        return () => stopCamera();
    }, [checks, user, isTargetStaff, startCamera, stopCamera]);

    useEffect(() => {
        if (activeCheck && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                () => toast({ variant: 'destructive', title: "GPS Error", description: "Enable location services to verify." }),
                { 
                    enableHighAccuracy: true, 
                    timeout: 15000, 
                    maximumAge: 0 
                }
            );
        }
    }, [activeCheck, toast]);

    const handleVerify = async () => {
        if (!user || !schoolId || !firestore || !activeCheck || !location) return;
        
        setIsVerifying(true);
        try {
            const photo = imageDataUri || capturePhoto();
            if (!photo) throw new Error("Please capture a photo first.");

            const schoolDoc = await getDoc(doc(firestore, 'schoolSettings', schoolId));
            const { schoolLat, schoolLng, allowedRadius } = schoolDoc.data() || {};
            
            let isOffCampus = false;
            let distance = 0;
            if (schoolLat && schoolLng) {
                distance = getDistanceInMeters(schoolLat, schoolLng, location.latitude, location.longitude);
                isOffCampus = distance > (allowedRadius || 200);
            }

            await updateDoc(doc(firestore, 'spot_checks', activeCheck.id), {
                responses: arrayUnion({
                    staffId: user.uid,
                    staffName: user.displayName || user.email,
                    timestamp: new Date(),
                    latitude: location.latitude,
                    longitude: location.longitude,
                    distanceMeters: Math.round(distance),
                    isOffCampus,
                    photoUrl: photo
                })
            });

            toast({ title: "Verified!", description: "Your presence has been confirmed." });
            setActiveCheck(null);
            stopCamera();
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsVerifying(false);
        }
    };

    if (!activeCheck) return null;

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md border-4 border-red-500 rounded-[2rem] overflow-hidden p-0" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <div className="bg-red-600 p-6 text-white text-center">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle size={48} className="animate-bounce" />
                    </div>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tight">Security Spot Check</DialogTitle>
                    <DialogDescription className="text-red-100 font-bold mt-2">
                        Verify your presence before {format(activeCheck.expiresAt.toDate(), 'h:mm a')}.
                    </DialogDescription>
                </div>
                
                <div className="p-6 space-y-6 bg-white">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border-4 border-slate-100 shadow-inner">
                        {imageDataUri ? (
                            <img src={imageDataUri} className="w-full h-full object-cover" alt="Verification" />
                        ) : (
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                        {imageDataUri && (
                            <button onClick={() => setImageDataUri(null)} className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white">
                                <RefreshCw size={20}/>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
                        {location ? (
                            <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={14}/> GPS Signal Lock</span>
                        ) : (
                            <span className="text-orange-500 flex items-center gap-1 animate-pulse"><Loader2 size={14} className="animate-spin"/> Acquiring Satellite...</span>
                        )}
                    </div>

                    <Button 
                        onClick={handleVerify} 
                        disabled={isVerifying || !location || (!imageDataUri && !cameraActive)} 
                        className="w-full bg-red-600 hover:bg-black h-16 text-xl font-black rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                        {isVerifying ? <Loader2 className="animate-spin mr-2"/> : <MapPin className="mr-2"/>}
                        CONFIRM PRESENCE
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
