import { FoodRecognitionResult } from "@/types";
import { cn } from "@/lib/utils";
import { CircleCheck, Award, Banana, Apple, Circle, AlertTriangle, AlertCircle, Info, Egg, Milk } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import DietaryCompatibility from "./DietaryCompatibility";

interface FoodAnalysisProps {
  result: FoodRecognitionResult | null;
  className?: string;
}

// Map common allergens to appropriate icons
const allergenIcons: Record<string, JSX.Element> = {
  'Eggs': <Egg className="h-3.5 w-3.5" />,
  'Egg': <Egg className="h-3.5 w-3.5" />,
  'Milk': <Milk className="h-3.5 w-3.5" />,
  'Dairy': <Milk className="h-3.5 w-3.5" />,
  'Gluten': <AlertCircle className="h-3.5 w-3.5" />,
  'Wheat': <AlertCircle className="h-3.5 w-3.5" />,
  'Peanut': <AlertTriangle className="h-3.5 w-3.5" />,
  'Peanuts': <AlertTriangle className="h-3.5 w-3.5" />,
  'Nuts': <AlertTriangle className="h-3.5 w-3.5" />
};

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

  const hasAllergens = result.allergenInfo && (
    result.allergenInfo.allergens.length > 0 || 
    result.allergenInfo.cautions.length > 0
  );

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
        
        {hasAllergens && (
          <div className="px-6 mb-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  {result.allergenInfo?.allergens.length > 0 && (
                    <>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">
                        Potential Allergens
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {result.allergenInfo?.allergens.map((allergen, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium gap-1"
                          >
                            {allergenIcons[allergen] || <AlertCircle className="h-3.5 w-3.5" />}
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {result.allergenInfo?.cautions.length > 0 && (
                    <>
                      <h4 className="text-sm font-medium text-orange-800 mb-1">
                        Dietary Cautions
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.allergenInfo?.cautions.map((caution, index) => (
                          <span 
                            key={`caution-${index}`}
                            className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium gap-1"
                          >
                            <Info className="h-3.5 w-3.5" />
                            {caution}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <p className="text-xs text-yellow-700 mt-2">
                    Information provided by AI analysis. Always check food labels for allergens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.calories}</div>
              <div className="text-xs text-muted-foreground mt-1">Calories</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.protein.toFixed(1)}g</div>
              <div className="text-xs text-muted-foreground mt-1">Protein</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.carbs.toFixed(1)}g</div>
              <div className="text-xs text-muted-foreground mt-1">Carbs</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-border/50">
              <div className="text-2xl font-bold">{nutritionInfo.fat.toFixed(1)}g</div>
              <div className="text-xs text-muted-foreground mt-1">Fat</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Protein</div>
                <div className="text-sm font-medium">{proteinPercentage}%</div>
              </div>
              <Progress value={proteinPercentage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Carbs</div>
                <div className="text-sm font-medium">{carbsPercentage}%</div>
              </div>
              <Progress value={carbsPercentage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Fat</div>
                <div className="text-sm font-medium">{fatPercentage}%</div>
              </div>
              <Progress value={fatPercentage} />
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

      {/* Dietary Compatibility Section */}
      {result.dietaryCompatibility && (
        <DietaryCompatibility 
          compatibility={result.dietaryCompatibility}
          className="border border-border/50 shadow-sm"
        />
      )}
    </div>
  );
};

export default FoodAnalysis;
