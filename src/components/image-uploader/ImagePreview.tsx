
import { X, Loader2 } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  isProcessing: boolean;
  onClear: () => void;
}

const ImagePreview = ({ imageUrl, isProcessing, onClear }: ImagePreviewProps) => {
  return (
    <div className="absolute inset-0 w-full h-full group">
      <img 
        src={imageUrl} 
        alt="Food preview" 
        className="w-full h-full object-cover animate-fade-in" 
      />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {!isProcessing && (
          <button 
            onClick={onClear}
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
  );
};

export default ImagePreview;
