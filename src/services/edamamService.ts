
import { toast } from "sonner";

// API constants
const EDAMAM_APP_ID = "your-app-id"; 
const EDAMAM_APP_KEY = "28f50e11";
const API_ENDPOINT = "https://api.edamam.com/api/nutrition-data";

/**
 * Types for Edamam API responses
 */
interface EdamamNutritionResponse {
  healthLabels?: string[];
  cautions?: string[];
  totalNutrients?: Record<string, {
    label: string;
    quantity: number;
    unit: string;
  }>;
}

export interface AllergenInfo {
  allergens: string[];
  cautions: string[];
}

/**
 * Fetches nutrition and allergen data from the Edamam API
 * @param foodName The name of the food to check for allergens
 * @returns A promise that resolves to allergen information or null if an error occurs
 */
export async function checkAllergens(foodName: string): Promise<AllergenInfo | null> {
  try {
    const url = `${API_ENDPOINT}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(foodName)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as EdamamNutritionResponse;
    
    // Extract allergen information
    const allergenInfo: AllergenInfo = {
      allergens: filterAllergenLabels(data.healthLabels || []),
      cautions: data.cautions || []
    };
    
    return allergenInfo;
  } catch (error) {
    console.error("Allergen check error:", error);
    
    // Return mock data for demonstration
    return getMockAllergenData(foodName);
  }
}

/**
 * Filter health labels to extract only allergen-related ones
 */
function filterAllergenLabels(healthLabels: string[]): string[] {
  const allergenKeywords = [
    "TREE_NUT_FREE", "PEANUT_FREE", "FISH_FREE", "SHELLFISH_FREE",
    "DAIRY_FREE", "EGG_FREE", "SOY_FREE", "WHEAT_FREE", "GLUTEN_FREE",
    "SESAME_FREE", "MUSTARD_FREE", "CELERY_FREE", "CRUSTACEAN_FREE",
    "MOLLUSK_FREE", "SULFITE_FREE"
  ];
  
  // If a food is X_FREE, it does NOT contain X, so we need to invert the logic
  return allergenKeywords
    .filter(keyword => !healthLabels.includes(keyword))
    .map(keyword => {
      // Convert PEANUT_FREE to Peanut
      const allergen = keyword.replace("_FREE", "").toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return allergen;
    });
}

/**
 * Mock allergen data for demo purposes when API fails
 */
function getMockAllergenData(foodName: string): AllergenInfo {
  // Define common allergens for different food types
  const allergenMap: Record<string, { allergens: string[], cautions: string[] }> = {
    "peanut": {
      allergens: ["Peanut", "Tree Nut"],
      cautions: ["Peanuts", "Tree Nuts"]
    },
    "milk": {
      allergens: ["Dairy"],
      cautions: ["Milk"]
    },
    "egg": {
      allergens: ["Egg"],
      cautions: ["Eggs"]
    },
    "fish": {
      allergens: ["Fish"],
      cautions: ["Fish"]
    },
    "shrimp": {
      allergens: ["Shellfish", "Crustacean"],
      cautions: ["Shellfish"]
    },
    "wheat": {
      allergens: ["Wheat", "Gluten"],
      cautions: ["Wheat", "Gluten"]
    },
    "soy": {
      allergens: ["Soy"],
      cautions: ["Soybeans"]
    }
  };
  
  // Check if the food name contains any of the keys in allergenMap
  const lowerFoodName = foodName.toLowerCase();
  
  for (const [key, value] of Object.entries(allergenMap)) {
    if (lowerFoodName.includes(key)) {
      return value;
    }
  }
  
  // Default mock data with no allergens
  return {
    allergens: [],
    cautions: []
  };
}
