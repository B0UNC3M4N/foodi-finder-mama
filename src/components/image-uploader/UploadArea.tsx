
import { cn } from "@/lib/utils";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "./hooks/useImageUpload";

interface UploadAreaProps {
  onImageUploaded: (file: File, previewUrl: string) => void;
  onCameraClick: () => void;
}

const UploadArea = ({ onImageUploaded, onCameraClick }: UploadAreaProps) => {
  const {
    dragActive,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleButtonClick
  } = useImageUpload({ onImageUploaded });

  return (
    <div 
      className={cn(
        "relative h-72 rounded-xl border-2 border-dashed border-muted-foreground/30 p-4",
        "transition-all duration-200 ease-in-out",
        "flex flex-col items-center justify-center",
        dragActive ? "border-primary/70 bg-primary/5" : "",
        "image-upload-area overflow-hidden"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <div className="mb-4 rounded-full p-3 bg-primary/10 text-primary">
        <Camera className="h-6 w-6" />
      </div>
      <p className="mb-2 text-sm font-medium">
        <span className="text-primary">Upload a food image</span> or drag and drop
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        PNG, JPG or JPEG (max. 5MB)
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleButtonClick}
          variant="outline"
          className="py-2 px-4 flex items-center gap-2"
          type="button"
        >
          <Upload className="h-4 w-4" />
          Select Image
        </Button>
        <Button
          onClick={onCameraClick}
          variant="secondary"
          className="py-2 px-4 flex items-center gap-2"
          type="button"
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
      </div>
    </div>
  );
};

export default UploadArea;
