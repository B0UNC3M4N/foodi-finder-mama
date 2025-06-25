
import { FoodRecognitionResult } from "@/types";
import { toast } from "sonner";
import { checkAllergens } from "./edamamService";
import { prepareImageForAPI } from "./imageProcessingService";
import { mapApiResponseToResult } from "./responseMapperService";
import { getMockRecognitionResult } from "./mockDataService";
import { analyzeDietaryCompatibility } from "./dietaryCompatibilityService";

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
    const result = mapApiResponseToResult(data);
    
    // Check for allergens after getting food recognition result
    try {
      console.log("Getting allergen info for:", result.name);
      const allergenInfo = await checkAllergens(result.name);
      console.log("Allergen info received:", allergenInfo);
      if (allergenInfo) {
        result.allergenInfo = allergenInfo;
      }
    } catch (allergenError) {
      console.error("Failed to fetch allergen information:", allergenError);
      // Add mock allergen data as fallback
      result.allergenInfo = await checkAllergens(result.name);
    }
    
    // Analyze dietary compatibility
    try {
      console.log("Analyzing dietary compatibility for:", result.name);
      const dietaryCompatibility = await analyzeDietaryCompatibility(
        result.name,
        result.nutrition,
        result.allergenInfo
      );
      if (dietaryCompatibility) {
        result.dietaryCompatibility = dietaryCompatibility;
      }
    } catch (compatibilityError) {
      console.error("Failed to analyze dietary compatibility:", compatibilityError);
    }
    
    return result;
    
  } catch (error) {
    console.error("Food recognition error:", error);
    toast.error("Failed to recognize food. Please try again.");
    
    // Fallback to mock data if API call fails
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResult = getMockRecognitionResult(imageFile.name);
    
    // Add mock allergen data
    try {
      const allergenInfo = await checkAllergens(mockResult.name);
      if (allergenInfo) {
        mockResult.allergenInfo = allergenInfo;
      }
    } catch (allergenError) {
      console.error("Failed to fetch mock allergen information:", allergenError);
    }
    
    // Add mock dietary compatibility
    try {
      const dietaryCompatibility = await analyzeDietaryCompatibility(
        mockResult.name,
        mockResult.nutrition,
        mockResult.allergenInfo
      );
      if (dietaryCompatibility) {
        mockResult.dietaryCompatibility = dietaryCompatibility;
      }
    } catch (compatibilityError) {
      console.error("Failed to analyze mock dietary compatibility:", compatibilityError);
    }
    
    return mockResult;
  }
}
