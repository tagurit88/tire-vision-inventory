
import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { validateImageData, validateImageSize } from '@/utils/security';

interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPermissionDenied(false);
      console.log('Starting camera...');
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Camera stream obtained:', mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        console.log('Video playing');
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Camera access denied. Please allow camera permissions in your browser settings and refresh the page.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setError('No camera found on this device. Please ensure your device has a camera.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setError('Camera is already in use by another application. Please close other camera apps and try again.');
      } else if (error.name === 'OverconstrainedError') {
        setError('Camera constraints not supported. Trying with basic settings...');
        // Retry with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
            await videoRef.current.play();
            setStream(basicStream);
            setError(null);
          }
        } catch {
          setError('Unable to access camera with any settings.');
        }
      } else {
        setError('Camera access failed. Please check your camera permissions and try again.');
      }
      
      toast({
        title: "Camera Error",
        description: error.message || "Unable to access camera",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track);
      });
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const capturePhoto = () => {
    console.log('Capturing photo...');
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Security validation
        if (!validateImageData(imageUrl)) {
          setError('Invalid image format captured. Please try again.');
          toast({
            title: "Image Error",
            description: "Invalid image format. Please try capturing again.",
            variant: "destructive"
          });
          return;
        }
        
        if (!validateImageSize(imageUrl)) {
          setError('Image size too large. Please try again with different settings.');
          toast({
            title: "Image Too Large",
            description: "Captured image is too large. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        console.log('Photo captured successfully, data URL length:', imageUrl.length);
        setCapturedImage(imageUrl);
        setError(null);
      } else {
        console.error('Cannot capture photo: video not ready or context not available');
        setError('Cannot capture photo. Please ensure camera is working.');
        toast({
          title: "Capture Error",
          description: "Unable to capture photo. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      console.error('Video or canvas ref not available');
      setError('Camera not ready. Please try again.');
    }
  };

  const confirmCapture = () => {
    console.log('Confirming capture...');
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    console.log('Retaking photo...');
    setCapturedImage(null);
    setError(null);
  };

  const handleCancel = () => {
    console.log('Canceling camera...');
    stopCamera();
    onCancel();
  };

  const handleRetryCamera = () => {
    setError(null);
    setPermissionDenied(false);
    startCamera();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col safe-area-inset">
      {/* Header - Mobile optimized */}
      <div className="bg-black/80 text-white p-4 flex items-center justify-between safe-area-top">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-white hover:bg-white/20 h-10 w-10 p-0"
        >
          <X className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Capture Tire Photo</h2>
        <div className="w-10" />
      </div>

      {/* Camera View - Full screen on mobile */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-6 max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p className="mb-6 text-sm leading-relaxed">{error}</p>
            {permissionDenied ? (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  To enable camera access:
                  <br />1. Click the camera icon in your browser's address bar
                  <br />2. Select "Allow" for camera permissions
                  <br />3. Refresh this page
                </p>
                <Button onClick={handleRetryCamera} variant="outline" className="text-white border-white hover:bg-white/20">
                  Try Again
                </Button>
              </div>
            ) : (
              <Button onClick={handleRetryCamera} variant="outline" className="text-white border-white hover:bg-white/20">
                Retry Camera
              </Button>
            )}
          </div>
        ) : isLoading ? (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Starting camera...</p>
          </div>
        ) : capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured tire"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onError={(e) => {
                console.error('Video error:', e);
                setError('Video playback error. Please try again.');
              }}
            />
            {/* Camera overlay - Responsive */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white rounded-lg w-64 h-64 sm:w-80 sm:h-80 opacity-50"></div>
            </div>
          </>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls - Mobile optimized with larger touch targets */}
      <div className="bg-black/80 p-6 safe-area-bottom">
        {capturedImage ? (
          <div className="flex justify-center gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={retakePhoto}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-14 px-8"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Retake
            </Button>
            <Button
              size="lg"
              onClick={confirmCapture}
              className="bg-green-600 hover:bg-green-700 text-white h-14 px-8"
            >
              <Check className="mr-2 h-5 w-5" />
              Use Photo
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={capturePhoto}
              disabled={!stream || isLoading || !!error}
              className="bg-white text-black hover:bg-gray-200 rounded-full w-20 h-20 p-0 touch-manipulation disabled:opacity-50"
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
