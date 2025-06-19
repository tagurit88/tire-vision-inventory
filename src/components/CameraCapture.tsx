
import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting camera...');
      
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
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Camera access denied. Please allow camera permissions and try again.');
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
        console.log('Photo captured, data URL length:', imageUrl.length);
        setCapturedImage(imageUrl);
      } else {
        console.error('Cannot capture photo: video not ready or context not available');
        setError('Cannot capture photo. Please ensure camera is working.');
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
          <div className="text-white text-center p-4">
            <p className="mb-4">{error}</p>
            <Button onClick={startCamera} variant="outline" className="text-white border-white">
              Try Again
            </Button>
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
