
import { FoodRecognitionResult, NutritionInfo } from "@/types";

/**
 * Mock food recognition results for demo purposes or when API fails
 */
export function getMockRecognitionResult(filename: string): FoodRecognitionResult {
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
