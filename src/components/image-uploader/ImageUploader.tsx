
import { useState, useCallback } from "react";
import { Camera } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import CameraCapture from "./CameraCapture";
import UploadArea from "./UploadArea";
import ImagePreview from "./ImagePreview";

interface ImageUploaderProps {
  onImageUploaded: (file: File, previewUrl: string) => void;
  isProcessing: boolean;
}

const ImageUploader = ({ onImageUploaded, isProcessing }: ImageUploaderProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const isMobile = useIsMobile();

  const handleImageUploaded = useCallback((file: File, previewUrl: string) => {
    setPreviewImage(previewUrl);
    onImageUploaded(file, previewUrl);
  }, [onImageUploaded]);

  const handleCameraClick = useCallback(() => {
    setShowCameraCapture(true);
  }, []);

  const handleCameraClosed = useCallback(() => {
    setShowCameraCapture(false);
  }, []);

  const clearImage = useCallback(() => {
    setPreviewImage(null);
  }, []);

  return (
    <div className="w-full mx-auto max-w-xl">
      {showCameraCapture ? (
        <CameraCapture 
          onCapture={handleImageUploaded} 
          onClose={handleCameraClosed} 
        />
      ) : (
        <div className="relative h-72 rounded-xl border-2 border-dashed border-muted-foreground/30 overflow-hidden group">
          {previewImage ? (
            <ImagePreview 
              imageUrl={previewImage} 
              isProcessing={isProcessing}
              onClear={clearImage}
            />
          ) : (
            <UploadArea 
              onImageUploaded={handleImageUploaded}
              onCameraClick={handleCameraClick}
            />
          )}
        </div>
      )}

      {previewImage && !showCameraCapture && !isProcessing && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={clearImage}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Scan Another
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
