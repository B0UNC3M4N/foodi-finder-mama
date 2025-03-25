
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUploaded: (file: File, previewUrl: string) => void;
  isProcessing: boolean;
}

const ImageUploader = ({ onImageUploaded, isProcessing }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processImage = useCallback((file: File) => {
    // Check if the file is an image
    if (!file.type.match(/image.*/)) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    
    // Call the callback with the file and preview URL
    onImageUploaded(file, previewUrl);
  }, [onImageUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  }, [processImage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  }, [processImage]);

  const onButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearImage = useCallback(() => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className="w-full mx-auto max-w-xl">
      <div 
        className={cn(
          "relative h-72 rounded-xl border-2 border-dashed border-muted-foreground/30 p-4",
          "transition-all duration-200 ease-in-out",
          "flex flex-col items-center justify-center",
          dragActive ? "border-primary/70 bg-primary/5" : "",
          "image-upload-area overflow-hidden",
          "group"
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
        
        {previewImage ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={previewImage} 
              alt="Food preview" 
              className="w-full h-full object-cover animate-fade-in" 
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {!isProcessing && (
                <button 
                  onClick={clearImage}
                  className="p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white p-4 rounded-lg glassmorphism">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm font-medium">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-full p-3 bg-primary/10 text-primary">
              <Camera className="h-6 w-6" />
            </div>
            <p className="mb-2 text-sm font-medium">
              <span className="text-primary">Upload a food image</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              PNG, JPG or JPEG (max. 5MB)
            </p>
            <button
              onClick={onButtonClick}
              className="py-2 px-4 rounded-lg border border-input bg-background hover:bg-accent transition-colors text-sm font-medium flex items-center gap-2"
              type="button"
            >
              <Upload className="h-4 w-4" />
              Select Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
