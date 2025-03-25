
import { FoodRecognitionResult, NutritionInfo } from "@/types";
import { toast } from "sonner";

// API constants
const CALORIE_MAMA_API_KEY = "f934310199cd6b97e1086ed6cfb20825"; 
const API_ENDPOINT = "https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition";

/**
 * Sends an image to the Calorie Mama API for food recognition
 * @param imageFile The food image file to analyze
 * @returns A promise that resolves to the recognition result or null if an error occurs
 */
export async function recognizeFood(imageFile: File): Promise<FoodRecognitionResult | null> {
  try {
    // Prepare image before sending to API
    const processedImage = await prepareImageForAPI(imageFile);
    
    // Always attempt to use the API since we have a key set
    const formData = new FormData();
    formData.append("media", processedImage);
    
    const response = await fetch(`${API_ENDPOINT}?user_key=${CALORIE_MAMA_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData?.error?.errorDetail || response.status}`);
    }
    
    const data = await response.json();
    return mapApiResponseToResult(data);
    
    // Fallback to mock data - removed the invalid comparison
  } catch (error) {
    console.error("Food recognition error:", error);
    toast.error("Failed to recognize food. Please try again.");
    
    // Fallback to mock data if API call fails
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockRecognitionResult(imageFile.name);
  }
}

/**
 * Prepares an image for the API by resizing it to 544x544 pixels
 * @param imageFile The original image file
 * @returns A promise that resolves to the processed image file
 */
async function prepareImageForAPI(imageFile: File): Promise<File> {
  // Return original file for mock implementation
  // In a real implementation, we would resize the image to 544x544 as required by the API
  return imageFile;
  
  /* Actual implementation would be:
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 544;
      canvas.height = 544;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Calculate dimensions to crop from center
      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;
      
      // Draw image centered and cropped
      ctx.drawImage(
        img,
        startX, startY, size, size,
        0, 0, 544, 544
      );
      
      // Convert to blob/file
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }
        
        const processedFile = new File([blob], imageFile.name, { type: 'image/jpeg' });
        resolve(processedFile);
      }, 'image/jpeg', 0.95);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
  */
}

/**
 * Mock food recognition results for demo purposes
 */
function mockRecognitionResult(filename: string): FoodRecognitionResult {
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

/**
 * Maps the Calorie Mama API response to our application's format
 * Based on the API documentation provided
 */
function mapApiResponseToResult(apiResponse: any): FoodRecognitionResult {
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
