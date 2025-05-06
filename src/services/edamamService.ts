
import { AllergenInfo } from "@/types";

// OpenAI API constants
const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Check for allergens in a food item using OpenAI API
 * @param foodName The name of the food to check for allergens
 * @returns Promise resolving to allergen information or null
 */
export async function checkAllergens(foodName: string): Promise<AllergenInfo | null> {
  try {
    const prompt = `As a nutritional expert, analyze "${foodName}" and provide a JSON response with two arrays:
1. "allergens": Common allergens present (e.g., dairy, eggs, nuts, gluten, shellfish, soy)
2. "cautions": Dietary cautions (e.g., high sodium, sulfites, FODMAPs)

Include only relevant, factual information. If uncertain about specific allergens, include only those that are commonly associated with this food. Return only the JSON without explanations.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more focused responses
        max_tokens: 150    // Limit response size
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return mockAllergenData(foodName);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        // Parse the JSON response from OpenAI
        const allergenData = JSON.parse(content);
        return {
          allergens: allergenData.allergens || [],
          cautions: allergenData.cautions || []
        };
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return mockAllergenData(foodName);
      }
    }
    
    return mockAllergenData(foodName);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return mockAllergenData(foodName);
  }
}

/**
 * Generate mock allergen data for testing or when API fails
 */
function mockAllergenData(foodName: string): AllergenInfo {
  const foodAllergenMap: Record<string, AllergenInfo> = {
    'Apple': { allergens: ['Oral Allergy Syndrome'], cautions: ['Pesticides'] },
    'Banana': { allergens: ['Latex-fruit syndrome'], cautions: ['High in sugar'] },
    'Burger': { allergens: ['Wheat', 'Dairy', 'Soy'], cautions: ['High fat', 'High sodium'] },
    'Pizza': { allergens: ['Wheat', 'Dairy'], cautions: ['High sodium', 'High fat'] },
    'Salad': { allergens: [], cautions: ['Potential pesticides'] },
    'Pasta': { allergens: ['Wheat', 'Gluten'], cautions: ['High carbohydrates'] },
    'Chocolate': { allergens: ['Dairy', 'Soy'], cautions: ['Caffeine', 'High sugar'] },
    'Sushi': { allergens: ['Fish', 'Shellfish'], cautions: ['Raw food'] },
    'Bread': { allergens: ['Wheat', 'Gluten'], cautions: [] },
    'Ice Cream': { allergens: ['Dairy', 'Eggs'], cautions: ['High sugar'] },
  };
  
  const defaultAllergens: AllergenInfo = {
    allergens: [],
    cautions: ['Check ingredients list']
  };
  
  // Check if we have predefined allergen data for this food
  const knownFood = Object.keys(foodAllergenMap).find(
    known => foodName.toLowerCase().includes(known.toLowerCase())
  );
  
  return knownFood ? foodAllergenMap[knownFood] : defaultAllergens;
}
