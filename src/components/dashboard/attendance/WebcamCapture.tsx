
      
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebcamCaptureProps {
  imageDataUri: string | null;
  setImageDataUri: (uri: string | null) => void;
}

export function WebcamCapture({ imageDataUri, setImageDataUri }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const getCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    getCameraPermission();

    return () => {
      // Cleanup: Stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [getCameraPermission]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      // Flip the context horizontally for mirroring effect
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');
      setImageDataUri(dataUri);
    }
  };

  const handleRetake = () => {
    setImageDataUri(null);
  };
  
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4">
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-900 border-4 border-slate-200 shadow-inner relative">
        {hasCameraPermission === false ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-4">
            <AlertTriangle className="h-10 w-10 text-yellow-400 mb-2"/>
            <p className="font-semibold text-center">Camera Access Denied</p>
            <p className="text-xs text-center text-slate-300">Please allow camera permissions in your browser settings.</p>
          </div>
        ) : imageDataUri ? (
          <img src={imageDataUri} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted style={{ transform: 'scaleX(-1)' }} />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="w-full flex gap-4">
        {!imageDataUri ? (
          <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full h-12 text-lg">
            <Camera className="mr-2"/> Capture Photo
          </Button>
        ) : (
          <Button onClick={handleRetake} variant="outline" className="w-full h-12 text-lg">
            <RefreshCw className="mr-2"/> Retake
          </Button>
        )}
      </div>
    </div>
  );
}
      
    