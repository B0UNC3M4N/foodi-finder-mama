
export interface FoodRecognitionResult {
  name: string;
  score: number;
  nutrition?: NutritionInfo;
  allergenInfo?: AllergenInfo;
  dietaryCompatibility?: DietaryCompatibility;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  nutrients?: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  imageUrl: string;
  result: FoodRecognitionResult;
}

export interface AllergenInfo {
  allergens: string[];
  cautions: string[];
}

export interface DietaryCompatibility {
  keto: DietStatus;
  vegan: DietStatus;
  vegetarian: DietStatus;
  glutenFree: DietStatus;
  diabeticSafe: DietStatus;
  heartHealthy: DietStatus;
  summary: string;
}

export interface DietStatus {
  compatible: boolean;
  status: 'compatible' | 'not-compatible' | 'caution';
  reason?: string;
}
