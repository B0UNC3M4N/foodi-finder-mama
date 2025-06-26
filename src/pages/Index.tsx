
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";
import ImageUploader from "@/components/image-uploader";
import FoodAnalysis from "@/components/FoodAnalysis";
import { recognizeFood } from "@/services/calorieMamaService";
import { HistoryEntry, FoodRecognitionResult } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from "@tanstack/react-query";
import { getHistory, saveHistory } from "@/services/localStorageService";
import { useEffect } from "react";
import Header from "@/components/Header";
import { format } from "date-fns";

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<FoodRecognitionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });

  useEffect(() => {
    refetchHistory();
  }, [refetchHistory]);

  const handleImageUpload = (file: File, previewUrl: string) => {
    setImageFile(file);
    setRecognitionResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await recognizeFood(imageFile);
      if (result) {
        setRecognitionResult(result);
        
        // Save to history
        const newEntry: HistoryEntry = {
          id: uuidv4(),
          timestamp: Date.now(),
          imageUrl: URL.createObjectURL(imageFile),
          result: result,
        };
        
        const currentHistory = history || [];
        saveHistory([...currentHistory, newEntry]);
        refetchHistory();
      } else {
        setError("Failed to recognize food. Please try again.");
      }
    } catch (err: any) {
      console.error("Recognition error:", err);
      setError(err.message || "Failed to analyze image.");
    } finally {
      setIsLoading(false);
    }
  };

  const groupedHistory = useMemo(() => {
    if (!history || !Array.isArray(history)) return {};
    
    return history.reduce((groups: { [key: string]: HistoryEntry[] }, entry) => {
      const dateKey = format(entry.timestamp, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
      return groups;
    }, {});
  }, [history]);

  const hasHistory = useMemo(() => {
    return history && Array.isArray(history) && history.length > 0;
  }, [history]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Food Recognition & Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Upload a photo of your food to get instant nutritional analysis, allergen information, and dietary compatibility insights powered by AI.
          </p>
          
          {/* Navigation to Meal Planner */}
          <div className="mb-8">
            <Link 
              to="/meal-planner" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Target className="h-5 w-5" />
              Try AI Meal Planner
            </Link>
          </div>
        </div>

        <ImageUploader 
          onImageUploaded={handleImageUpload} 
          isProcessing={isLoading} 
        />
        
        {imageFile && !isLoading && !recognitionResult && (
          <div className="text-center mt-6">
            <button
              onClick={analyzeImage}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Analyze Food
            </button>
          </div>
        )}
        
        {recognitionResult && (
          <FoodAnalysis result={recognitionResult} />
        )}
        
        {error && (
          <div className="text-center mt-6 text-red-500">
            {error}
          </div>
        )}

        {hasHistory && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent History</h2>
            <div className="space-y-6">
              {Object.entries(groupedHistory).slice(0, 3).map(([date, entries]) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-1">
                    {format(new Date(date), 'EEEE, MMMM do')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entries.slice(0, 6).map((entry) => (
                      <div key={entry.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src={entry.imageUrl} alt="Food" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800">{entry.result.name}</h4>
                          <p className="text-gray-600 text-sm">
                            {entry.result.nutrition?.calories} calories
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
