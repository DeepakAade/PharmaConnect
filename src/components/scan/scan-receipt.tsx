'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Loader2, Info, User, Pill, Stethoscope, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scanReceipt } from '@/app/scan/actions';
import { Skeleton } from '../ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <Camera className="mr-2 h-4 w-4" />
          Scan Receipt
        </>
      )}
    </Button>
  );
}

export function ScanReceipt() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const { toast } = useToast();

  const initialState = { status: 'idle' as const, message: '' };
  const [state, formAction] = useFormState(scanReceipt, initialState);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageData(dataUrl);
      }
    }
  };

  const handleScan = (formData: FormData) => {
    if (imageData) {
      formData.append('receiptImage', imageData);
      formAction(formData);
    } else {
      captureImageAndScan(formData);
    }
  };

  const captureImageAndScan = (formData: FormData) => {
     if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageData(dataUrl);
        formData.append('receiptImage', dataUrl);
        formAction(formData);
      }
    }
  }

  const reset = () => {
    setImageData(null);
    const form = document.getElementById('scan-form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
    // a bit of a hack to reset the form state
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Camera View</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCameraPermission === null && <Skeleton className="w-full aspect-video rounded-md" />}
          
          <div className="relative">
            <video ref={videoRef} className={`w-full aspect-video rounded-md bg-black ${imageData ? 'hidden' : ''}`} autoPlay muted playsInline />
            {imageData && (
              <img src={imageData} alt="Captured receipt" className="w-full aspect-video rounded-md" />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <Camera className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature. You might need to refresh the page after granting permission.
              </AlertDescription>
            </Alert>
          )}

          {hasCameraPermission && (
            <form action={handleScan} id="scan-form" className="mt-4 flex items-center justify-between">
              <SubmitButton />
              { (imageData || (state.status !== 'idle' && state.status !== 'pending')) && (
                <Button variant="outline" onClick={reset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Scan New Receipt
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
        </CardHeader>
        <CardContent>
          {useFormStatus().pending && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
          {state.status === 'success' && state.data ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Patient Name</p>
                  <p className="font-medium">{state.data.patientName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Doctor Name</p>
                  <p className="font-medium">{state.data.doctorName || 'N/A'}</p>
                </div>
              </div>
              <div>
                 <h4 className="font-semibold flex items-center gap-2 mb-2"><Pill className="w-5 h-5 text-primary"/> Medications</h4>
                 <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                    {state.data.medications.map((med, i) => (
                      <li key={i}>{med.name} - {med.dosage} ({med.quantity})</li>
                    ))}
                 </ul>
              </div>
            </div>
          ) : !useFormStatus().pending ? (
            <div className="text-center text-muted-foreground py-10">
              <Info className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4">
                Extracted receipt details will appear here.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
