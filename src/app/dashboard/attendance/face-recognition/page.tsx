'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ScanFace, UserCheck, Video, VideoOff } from 'lucide-react';
import { identifyAndMarkAttendance } from '@/ai/flows/identify-and-mark-attendance-flow';
import { Button } from '@/components/ui/button';

type KioskStatus = 'initializing' | 'scanning' | 'processing' | 'success' | 'failure' | 'no-camera' | 'off';

const statusMessages: Record<KioskStatus, string> = {
  initializing: 'Initializing Camera...',
  scanning: 'Ready to scan. Please position your face in the frame.',
  processing: 'Processing...',
  success: 'Welcome!',
  failure: 'Face not recognized. Please try again.',
  'no-camera': 'Camera access denied or unavailable.',
  off: 'Camera is off.',
};

export default function FaceRecognitionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [status, setStatus] = useState<KioskStatus>('off');
  const [recognizedStudent, setRecognizedStudent] = useState<{name: string, id: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setStatus('off');
  }, []);

  const startCamera = useCallback(async () => {
    setStatus('initializing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus('scanning');
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setStatus('no-camera');
      setIsCameraOn(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  }, [toast]);
  
  const handleToggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (status !== 'scanning' || isProcessing) return;

    const intervalId = setInterval(async () => {
      if (videoRef.current && canvasRef.current && streamRef.current) {
        setIsProcessing(true);
        setStatus('processing');

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const photoDataUri = canvas.toDataURL('image/jpeg');

        try {
          const result = await identifyAndMarkAttendance({ photoDataUri });
          if (result.success && result.studentName && result.studentId) {
            setRecognizedStudent({name: result.studentName, id: result.studentId});
            setStatus('success');
            // Show success message for a few seconds then reset
            setTimeout(() => {
                setStatus('scanning');
                setRecognizedStudent(null);
            }, 5000);
          } else {
            setStatus('failure');
             setTimeout(() => setStatus('scanning'), 3000);
          }
        } catch (error) {
          console.error('Error during recognition:', error);
          setStatus('failure');
          setTimeout(() => setStatus('scanning'), 3000);
        } finally {
            setTimeout(() => setIsProcessing(false), 2000); // Cooldown to prevent spamming
        }
      }
    }, 3000); // Capture frame every 3 seconds

    return () => clearInterval(intervalId);
  }, [status, isProcessing]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <ScanFace className="h-8 w-8" />
            Face Recognition Attendance Kiosk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            {/* Hidden canvas for capturing frames */}
            <canvas ref={canvasRef} className="hidden" />

             {/* Status Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                {status === 'processing' && <Loader2 className="h-12 w-12 animate-spin mb-4" />}
                {status === 'success' && recognizedStudent && (
                    <div className='text-center'>
                        <UserCheck className="h-16 w-16 text-green-400 mb-4 mx-auto" />
                        <h3 className="text-4xl font-bold">{statusMessages[status]}</h3>
                        <p className="text-2xl">{recognizedStudent.name}</p>
                    </div>
                )}
                 {status !== 'success' && (
                    <p className="text-xl font-medium">{statusMessages[status]}</p>
                )}
            </div>
          </div>
          {status === 'no-camera' && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use this feature.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleToggleCamera} className="w-full">
                {isCameraOn ? <VideoOff className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                {isCameraOn ? 'Turn Off Camera' : 'Start Camera'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
