
import { FoodRecognitionResult, NutritionInfo } from "@/types";

/**
 * Maps the Calorie Mama API response to our application's format
 * Based on the API documentation provided
 */
export function mapApiResponseToResult(apiResponse: any): FoodRecognitionResult {
  // Verify the response contains results
  if (!apiResponse.results || !apiResponse.results.length) {
    throw new Error("No food recognized in the image");
  }

  // Get the first food group
  const firstGroup = apiResponse.results[0];
  
  // Get the highest scoring item from the first group
  let highestScoringItem = firstGroup.items[0];
  for (const item of firstGroup.items) {
    if (item.score > highestScoringItem.score) {
      highestScoringItem = item;
    }
  }
  
  // Convert nutrition values from kg to g for better readability
  // API returns values in SI units (kg)
  const rawNutrition = highestScoringItem.nutrition;
  
  // Extract the nutrition information
  const nutritionInfo: NutritionInfo = {
    calories: rawNutrition?.calories || 0,
    // Convert from kg to g (multiply by 1000)
    protein: (rawNutrition?.protein || 0) * 1000,
    carbs: (rawNutrition?.totalCarbs || 0) * 1000, 
    fat: (rawNutrition?.totalFat || 0) * 1000,
    nutrients: []
  };

  // Add additional nutrients if available
  const nutrientMappings: Record<string, string> = {
    saturatedFat: "Saturated Fat",
    cholesterol: "Cholesterol",
    sodium: "Sodium",
    dietaryFiber: "Fiber",
    sugars: "Sugar",
    monounsaturatedFat: "Monounsaturated Fat",
    polyunsaturatedFat: "Polyunsaturated Fat",
    vitaminA: "Vitamin A",
    vitaminC: "Vitamin C",
    iron: "Iron", 
    potassium: "Potassium",
    calcium: "Calcium"
  };

  for (const [apiKey, displayName] of Object.entries(nutrientMappings)) {
    if (rawNutrition?.[apiKey] !== undefined) {
      let value = rawNutrition[apiKey];
      let unit = "g";
      
      // Convert to appropriate units for better readability
      if (apiKey === "vitaminA" || apiKey === "vitaminC") {
        value = value * 1000000; // Convert to mcg
        unit = "mcg";
      } else if (apiKey === "iron" || apiKey === "calcium") {
        value = value * 1000000; // Convert to mg
        unit = "mg";
      } else if (apiKey === "sodium" || apiKey === "potassium") {
        value = value * 1000; // Convert to mg
        unit = "mg";
      } else if (apiKey === "cholesterol") {
        value = value * 1000; // Convert to mg
        unit = "mg";
      } else {
        value = value * 1000; // Convert to g
      }
      
      nutritionInfo.nutrients?.push({
        name: displayName,
        amount: Math.round(value * 100) / 100, // Round to 2 decimal places
        unit
      });
    }
  }

  // Build the final result
  return {
    name: highestScoringItem.name || "Unknown Food",
    score: highestScoringItem.score / 100, // Convert to 0-1 range as expected by our app
    nutrition: nutritionInfo
  };
}
