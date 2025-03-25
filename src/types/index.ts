
export interface FoodRecognitionResult {
  name: string;
  score: number;
  nutrition?: NutritionInfo;
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
