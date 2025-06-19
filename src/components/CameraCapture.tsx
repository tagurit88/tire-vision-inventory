
import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input if camera access fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageUrl);
      }
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
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
        {isLoading ? (
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
              disabled={!stream}
              className="bg-white text-black hover:bg-gray-200 rounded-full w-20 h-20 p-0 touch-manipulation"
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
