
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseCameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

export function useCameraCapture({ onCapture, onClose }: UseCameraCaptureProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    // Reset any previous errors
    setCameraError(null);
    
    try {
      if (videoRef.current) {
        // Stop any existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Try to get camera access with current facing mode
        const facingMode = useFrontCamera ? "user" : "environment";
        const constraints = {
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };
        
        console.log(`Attempting to access camera with facingMode: ${facingMode}`);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Save stream reference for cleanup
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        
        // Ensure video plays automatically
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error("Error playing video:", err);
              setCameraError("Could not start video stream. Please check your browser settings.");
            });
          }
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      
      // Handle iOS specific issues
      if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.location.href.startsWith("https")) {
        setCameraError("Camera access requires HTTPS on iOS devices.");
      } else {
        setCameraError("Failed to access camera. Please check your camera permissions.");
      }
    }
  }, [useFrontCamera]);

  const stopCamera = useCallback(() => {
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Reset UI state
    setCameraError(null);
    onClose();
  }, [onClose]);

  const toggleCamera = useCallback(() => {
    setUseFrontCamera(prev => !prev);
    // Restart camera with new setting
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      // Small delay to ensure previous camera is fully stopped
      setTimeout(() => {
        startCamera();
      }, 300);
    }
  }, [startCamera]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // If using front camera, flip horizontally to create a mirror effect
        if (useFrontCamera) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Restore context if we modified it
        if (useFrontCamera) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        // Convert the canvas to a blob and then to a File object
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(blob);
            
            // Process the captured image
            onCapture(file, previewUrl);
            stopCamera();
          }
        }, "image/jpeg", 0.9);
      }
    }
  }, [onCapture, stopCamera, useFrontCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  return {
    cameraError,
    useFrontCamera,
    videoRef,
    canvasRef,
    capturePhoto,
    stopCamera,
    toggleCamera
  };
}
