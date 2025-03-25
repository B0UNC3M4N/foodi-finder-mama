
import { FoodRecognitionResult, NutritionInfo } from "@/types";
import { toast } from "sonner";

// This is where you would put your Calorie Mama API key
// In a production environment, this should be stored securely
const CALORIE_MAMA_API_KEY = "YOUR_API_KEY"; 
const API_ENDPOINT = "https://api.caloriemama.ai/v1/foodrecognition";

export async function recognizeFood(imageFile: File): Promise<FoodRecognitionResult | null> {
  try {
    // Create form data to send the image
    const formData = new FormData();
    formData.append("image", imageFile);
    
    // If using the actual API
    if (CALORIE_MAMA_API_KEY !== "YOUR_API_KEY") {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CALORIE_MAMA_API_KEY}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return mapApiResponseToResult(data);
    }
    
    // If no API key provided, use mock data for demonstration
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockRecognitionResult(imageFile.name);
    
  } catch (error) {
    console.error("Food recognition error:", error);
    toast.error("Failed to recognize food. Please try again.");
    return null;
  }
}

function mockRecognitionResult(filename: string): FoodRecognitionResult {
  // This is a simplified mock - actual implementation would use real API results
  const foods = [
    {
      name: "Apple",
      score: 0.95,
      nutrition: {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fat: 0.2,
        nutrients: [
          { name: "Fiber", amount: 2.4, unit: "g" },
          { name: "Sugar", amount: 10.3, unit: "g" },
          { name: "Vitamin C", amount: 4.6, unit: "mg" }
        ]
      }
    },
    {
      name: "Banana",
      score: 0.92,
      nutrition: {
        calories: 89,
        protein: 1.1,
        carbs: 22.8,
        fat: 0.3,
        nutrients: [
          { name: "Fiber", amount: 2.6, unit: "g" },
          { name: "Sugar", amount: 12.2, unit: "g" },
          { name: "Potassium", amount: 358, unit: "mg" }
        ]
      }
    },
    {
      name: "Burger",
      score: 0.94,
      nutrition: {
        calories: 354,
        protein: 20,
        carbs: 29,
        fat: 17,
        nutrients: [
          { name: "Sodium", amount: 497, unit: "mg" },
          { name: "Cholesterol", amount: 45, unit: "mg" },
          { name: "Calcium", amount: 127, unit: "mg" }
        ]
      }
    },
    {
      name: "Salad",
      score: 0.91,
      nutrition: {
        calories: 89,
        protein: 1.8,
        carbs: 6.9,
        fat: 6.2,
        nutrients: [
          { name: "Fiber", amount: 2.3, unit: "g" },
          { name: "Vitamin A", amount: 146, unit: "mcg" },
          { name: "Vitamin K", amount: 93, unit: "mcg" }
        ]
      }
    },
    {
      name: "Pizza",
      score: 0.93,
      nutrition: {
        calories: 285,
        protein: 12,
        carbs: 36,
        fat: 10,
        nutrients: [
          { name: "Sodium", amount: 640, unit: "mg" },
          { name: "Calcium", amount: 189, unit: "mg" },
          { name: "Iron", amount: 2.3, unit: "mg" }
        ]
      }
    }
  ];
  
  // Select a random food from the mock data
  const randomIndex = Math.floor(Math.random() * foods.length);
  return foods[randomIndex];
}

// This function maps the actual Calorie Mama API response to our expected format
function mapApiResponseToResult(apiResponse: any): FoodRecognitionResult {
  // Based on Calorie Mama API documentation
  // https://dev.caloriemama.ai/docs

  // Check if there's a recognized food and extract first item
  if (!apiResponse.results || !apiResponse.results.length) {
    throw new Error("No food recognized in the image");
  }

  const firstResult = apiResponse.results[0];
  
  // Extract the nutrition information
  const nutritionInfo: NutritionInfo = {
    calories: firstResult.nutrition?.calories || 0,
    protein: firstResult.nutrition?.protein?.value || 0,
    carbs: firstResult.nutrition?.carbs?.value || 0,
    fat: firstResult.nutrition?.fat?.value || 0,
    nutrients: []
  };

  // Add additional nutrients if available
  if (firstResult.nutrition?.minerals) {
    for (const mineral in firstResult.nutrition.minerals) {
      nutritionInfo.nutrients?.push({
        name: mineral,
        amount: firstResult.nutrition.minerals[mineral].value,
        unit: firstResult.nutrition.minerals[mineral].unit
      });
    }
  }

  if (firstResult.nutrition?.vitamins) {
    for (const vitamin in firstResult.nutrition.vitamins) {
      nutritionInfo.nutrients?.push({
        name: vitamin,
        amount: firstResult.nutrition.vitamins[vitamin].value,
        unit: firstResult.nutrition.vitamins[vitamin].unit
      });
    }
  }

  // Build the final result
  return {
    name: firstResult.food?.name || "Unknown Food",
    score: firstResult.score || 0,
    nutrition: nutritionInfo
  };
}
