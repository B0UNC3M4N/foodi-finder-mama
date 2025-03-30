
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseImageUploadProps {
  onImageUploaded: (file: File, previewUrl: string) => void;
}

export function useImageUpload({ onImageUploaded }: UseImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    // Call the callback with the file and preview URL
    onImageUploaded(file, previewUrl);
  }, [onImageUploaded]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

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

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    dragActive,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleButtonClick
  };
}
