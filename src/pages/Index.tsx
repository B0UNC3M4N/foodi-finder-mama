
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { recognizeFood } from "@/services/calorieMamaService";
import { FoodRecognitionResult, HistoryEntry } from "@/types";

import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import FoodAnalysis from "@/components/FoodAnalysis";
import HistoryItem from "@/components/HistoryItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Save, 
  ArrowRight, 
  DatabaseIcon,
  Camera,
  InfoIcon
} from "lucide-react";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<FoodRecognitionResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<HistoryEntry | null>(null);

  // Load history from localStorage on initial load
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("food-scan-history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("food-scan-history", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }, [history]);

  const handleImageUploaded = useCallback(async (file: File, previewUrl: string) => {
    setCurrentImage(previewUrl);
    setIsProcessing(true);
    setRecognitionResult(null);
    setSelectedHistoryEntry(null);
    
    try {
      const result = await recognizeFood(file);
      
      if (result) {
        setRecognitionResult(result);
        
        // Create history entry
        const newEntry: HistoryEntry = {
          id: uuidv4(),
          timestamp: Date.now(),
          imageUrl: previewUrl,
          result: result
        };
        
        // Add to history
        setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep only last 50 entries
        
        toast.success(`Identified as ${result.name} with ${Math.round(result.score * 100)}% confidence`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleHistoryItemClick = useCallback((entry: HistoryEntry) => {
    setSelectedHistoryEntry(entry);
    setCurrentImage(entry.imageUrl);
    setRecognitionResult(entry.result);
  }, []);

  const handleResetScan = useCallback(() => {
    setCurrentImage(null);
    setRecognitionResult(null);
    setSelectedHistoryEntry(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col container max-w-6xl py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
          Food Recognition
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Upload a picture of any food and get instant nutritional information. Our AI will analyze your image and provide accurate results.
        </p>
        
        <Tabs 
          defaultValue="scan" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-6xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Scan Food
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="scan" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <ImageUploader 
                  onImageUploaded={handleImageUploaded}
                  isProcessing={isProcessing}
                />
                
                {recognitionResult && (
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={handleResetScan}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Scan Another
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                {recognitionResult ? (
                  <FoodAnalysis result={recognitionResult} />
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-6">
                    <div className="max-w-md">
                      <div className="mb-4 rounded-full p-4 bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                        <InfoIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">How It Works</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        Take or upload a photo of your food, and our AI will identify it and provide detailed nutritional information.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto">
                            <Camera className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs">Upload Image</p>
                        </div>
                        
                        <div className="space-y-2 flex flex-col items-center">
                          <ArrowRight className="h-5 w-5 text-muted-foreground my-2.5" />
                          <p className="text-xs">Process</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mx-auto">
                            <DatabaseIcon className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs">Get Results</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Recent Scans</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => {
                      if (history.length > 0) {
                        if (window.confirm("Are you sure you want to clear all history?")) {
                          setHistory([]);
                          setSelectedHistoryEntry(null);
                          toast.success("History cleared");
                        }
                      } else {
                        toast.info("No history to clear");
                      }
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  {history.length > 0 ? (
                    <div className="max-h-[450px] overflow-y-auto">
                      {history.map((entry) => (
                        <div key={entry.id}>
                          <HistoryItem 
                            entry={entry}
                            onClick={handleHistoryItemClick}
                            isActive={selectedHistoryEntry?.id === entry.id}
                          />
                          <Separator className="last:hidden" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="rounded-full p-3 bg-muted/50 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-medium mb-1">No history yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan some food to see your history here
                      </p>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setActiveTab("scan")}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Go to Scanner
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                {selectedHistoryEntry ? (
                  <>
                    <div className="mb-6 relative rounded-lg overflow-hidden h-64 w-full">
                      {selectedHistoryEntry.imageUrl ? (
                        <img 
                          src={selectedHistoryEntry.imageUrl} 
                          alt={selectedHistoryEntry.result.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Utensils className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <FoodAnalysis result={selectedHistoryEntry.result} />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-6">
                    <div className="max-w-md">
                      <div className="mb-4 rounded-full p-4 bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                        <Clock className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Your Food History</h3>
                      <p className="text-muted-foreground text-sm">
                        Select an item from your history to view its details. Your scan history is saved locally on your device.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 border-t border-border/40">
        <div className="container max-w-6xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NutriScan. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
