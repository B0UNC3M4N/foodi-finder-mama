
import { DietaryCompatibility, NutritionInfo, AllergenInfo } from "@/types";

const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Analyze dietary compatibility using OpenAI API
 */
export async function analyzeDietaryCompatibility(
  foodName: string,
  nutrition?: NutritionInfo,
  allergenInfo?: AllergenInfo
): Promise<DietaryCompatibility | null> {
  try {
    const nutritionText = nutrition ? 
      `Calories: ${nutrition.calories}, Protein: ${nutrition.protein}g, Carbs: ${nutrition.carbs}g, Fat: ${nutrition.fat}g` :
      "Nutrition data not available";
    
    const allergenText = allergenInfo?.allergens.length ? 
      `Allergens: ${allergenInfo.allergens.join(', ')}` :
      "No known allergens";

    const prompt = `Analyze the dietary compatibility of "${foodName}" based on:
- Nutrition: ${nutritionText}
- ${allergenText}

Return a JSON response with:
1. Boolean compatibility for: keto, vegan, vegetarian, glutenFree, diabeticSafe, heartHealthy
2. Status for each: "compatible", "not-compatible", or "caution"
3. Brief reason for non-compatible items
4. A summary message (max 100 characters)

Format:
{
  "keto": {"compatible": true, "status": "compatible"},
  "vegan": {"compatible": false, "status": "not-compatible", "reason": "Contains dairy"},
  "vegetarian": {"compatible": true, "status": "compatible"},
  "glutenFree": {"compatible": true, "status": "compatible"},
  "diabeticSafe": {"compatible": false, "status": "caution", "reason": "High carbs"},
  "heartHealthy": {"compatible": true, "status": "compatible"},
  "summary": "High protein, keto-friendly but contains dairy"
}`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.json());
      return getMockDietaryCompatibility(foodName, nutrition, allergenInfo);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        const compatibilityData = JSON.parse(content);
        return compatibilityData as DietaryCompatibility;
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return getMockDietaryCompatibility(foodName, nutrition, allergenInfo);
      }
    }

    return getMockDietaryCompatibility(foodName, nutrition, allergenInfo);
  } catch (error) {
    console.error('Error analyzing dietary compatibility:', error);
    return getMockDietaryCompatibility(foodName, nutrition, allergenInfo);
  }
}

/**
 * Generate mock dietary compatibility data
 */
function getMockDietaryCompatibility(
  foodName: string,
  nutrition?: NutritionInfo,
  allergenInfo?: AllergenInfo
): DietaryCompatibility {
  const hasAllergens = allergenInfo?.allergens.length > 0;
  const highCarbs = nutrition?.carbs > 20;
  const highFat = nutrition?.fat > 15;
  const hasDairy = allergenInfo?.allergens.some(a => a.toLowerCase().includes('dairy') || a.toLowerCase().includes('milk'));
  const hasAnimalProducts = hasDairy || allergenInfo?.allergens.some(a => 
    a.toLowerCase().includes('egg') || a.toLowerCase().includes('meat') || a.toLowerCase().includes('fish')
  );

  return {
    keto: {
      compatible: !highCarbs && highFat,
      status: highCarbs ? 'not-compatible' : 'compatible',
      reason: highCarbs ? 'High in carbohydrates' : undefined
    },
    vegan: {
      compatible: !hasAnimalProducts,
      status: hasAnimalProducts ? 'not-compatible' : 'compatible',
      reason: hasAnimalProducts ? 'Contains animal products' : undefined
    },
    vegetarian: {
      compatible: !allergenInfo?.allergens.some(a => 
        a.toLowerCase().includes('meat') || a.toLowerCase().includes('fish')
      ),
      status: 'compatible'
    },
    glutenFree: {
      compatible: !allergenInfo?.allergens.some(a => 
        a.toLowerCase().includes('gluten') || a.toLowerCase().includes('wheat')
      ),
      status: allergenInfo?.allergens.some(a => 
        a.toLowerCase().includes('gluten') || a.toLowerCase().includes('wheat')
      ) ? 'not-compatible' : 'compatible',
      reason: allergenInfo?.allergens.some(a => 
        a.toLowerCase().includes('gluten') || a.toLowerCase().includes('wheat')
      ) ? 'Contains gluten' : undefined
    },
    diabeticSafe: {
      compatible: !highCarbs,
      status: highCarbs ? 'caution' : 'compatible',
      reason: highCarbs ? 'High in carbohydrates' : undefined
    },
    heartHealthy: {
      compatible: true,
      status: 'compatible'
    },
    summary: `${hasAnimalProducts ? 'Not vegan' : 'Plant-based'}, ${highCarbs ? 'high carb' : 'low carb'}`
  };
}
