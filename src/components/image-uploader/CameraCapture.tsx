
import { cn } from "@/lib/utils";
import { Camera, X, FlipHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCameraCapture } from "./hooks/useCameraCapture";

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const {
    cameraError,
    useFrontCamera,
    videoRef,
    canvasRef,
    capturePhoto,
    stopCamera,
    toggleCamera
  } = useCameraCapture({ onCapture, onClose });

  return (
    <div className="relative">
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 overflow-hidden h-72">
        {cameraError ? (
          <div className="h-full flex items-center justify-center p-4 text-center bg-background/95">
            <div>
              <div className="mb-4 rounded-full p-3 bg-destructive/10 text-destructive w-12 h-12 flex items-center justify-center mx-auto">
                <X className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium mb-4">{cameraError}</p>
              <Button
                variant="outline"
                onClick={stopCamera}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Close Camera
              </Button>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className={cn(
              "w-full h-full object-cover",
              useFrontCamera && "scale-x-[-1]" // Mirror effect for front camera
            )}
          />
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
        <Button
          onClick={capturePhoto}
          className="flex items-center gap-2 bg-primary"
          disabled={!!cameraError}
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
        
        <Button
          variant="outline"
          onClick={toggleCamera}
          className="flex items-center gap-2"
          disabled={!!cameraError}
        >
          <FlipHorizontal className="h-4 w-4" />
          Switch Camera
        </Button>
        
        <Button
          variant="outline"
          onClick={stopCamera}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
