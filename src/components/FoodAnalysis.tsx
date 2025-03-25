
import { FoodRecognitionResult } from "@/types";
import { cn } from "@/lib/utils";
import { CircleCheck, Award, Banana, Apple, Circle } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FoodAnalysisProps {
  result: FoodRecognitionResult | null;
  className?: string;
}

const FoodAnalysis = ({ result, className }: FoodAnalysisProps) => {
  if (!result) return null;

  const nutritionInfo = result.nutrition;
  if (!nutritionInfo) return null;
  
  const confidence = Math.round(result.score * 100);
  
  // Calculate macronutrient percentages
  const totalGrams = nutritionInfo.protein + nutritionInfo.carbs + nutritionInfo.fat;
  const proteinPercentage = Math.round((nutritionInfo.protein / totalGrams) * 100) || 0;
  const carbsPercentage = Math.round((nutritionInfo.carbs / totalGrams) * 100) || 0;
  const fatPercentage = Math.round((nutritionInfo.fat / totalGrams) * 100) || 0;

  return (
    <div className={cn("w-full max-w-xl mx-auto space-y-4 animate-slide-up", className)}>
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{result.name}</CardTitle>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <CircleCheck className="h-3.5 w-3.5" />
              <span>{confidence}% match</span>
            </div>
          </div>
          <CardDescription>
            Nutritional information per serving
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.calories}</div>
              <div className="text-xs text-muted-foreground mt-1">Calories</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.protein}g</div>
              <div className="text-xs text-muted-foreground mt-1">Protein</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.carbs}g</div>
              <div className="text-xs text-muted-foreground mt-1">Carbs</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.fat}g</div>
              <div className="text-xs text-muted-foreground mt-1">Fat</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Protein</div>
                <div className="text-sm font-medium">{proteinPercentage}%</div>
              </div>
              <Progress value={proteinPercentage} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Carbs</div>
                <div className="text-sm font-medium">{carbsPercentage}%</div>
              </div>
              <Progress value={carbsPercentage} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Fat</div>
                <div className="text-sm font-medium">{fatPercentage}%</div>
              </div>
              <Progress value={fatPercentage} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
            </div>
          </div>
        </CardContent>
        
        {nutritionInfo.nutrients && nutritionInfo.nutrients.length > 0 && (
          <CardFooter className="border-t border-border/50 pt-4">
            <div className="w-full">
              <h4 className="text-sm font-medium mb-2">Additional Nutrients</h4>
              <div className="grid grid-cols-2 gap-2">
                {nutritionInfo.nutrients.map((nutrient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Circle className="h-2 w-2 text-primary fill-primary" />
                    <span className="text-xs">
                      {nutrient.name}: {nutrient.amount}{nutrient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default FoodAnalysis;
