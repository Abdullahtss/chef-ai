import dotenv from 'dotenv';
// import fetch from 'node-fetch'; // Using native fetch in Node 18+

dotenv.config();

// Get API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

/**
 * Generate 4-5 recipes based on provided ingredients using OpenRouter/DeepSeek
 * @param {Array<string>} ingredients - List of available ingredients
 * @returns {Promise<Array>} Array of recipe objects
 */
export async function generateRecipes(ingredients) {
    try {
        console.log('API Key loaded:', apiKey ? `Yes (starts with: ${apiKey.substring(0, 15)}...)` : 'No - MISSING!');

        if (!apiKey) {
            throw new Error('OpenRouter API key is missing. Please check your .env file.');
        }

        const ingredientList = ingredients.join(', ');

        const prompt = `You are a professional chef assistant. Given these ingredients: ${ingredientList}

Generate exactly 4-5 different creative recipes that can be made using these ingredients. You can assume basic pantry staples like salt, pepper, oil, and water are available.

For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Complete ingredient list with quantities
4. Step-by-step cooking instructions (numbered)
5. Preparation time
6. Cooking time
7. Difficulty level (Easy/Medium/Hard)
8. Number of servings

Format your response as a JSON array of recipe objects with this exact structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": [
      "1 cup ingredient1",
      "2 tbsp ingredient2"
    ],
    "instructions": [
      "Step 1 instruction",
      "Step 2 instruction"
    ],
    "prepTime": "15 minutes",
    "cookTime": "30 minutes",
    "difficulty": "Easy",
    "servings": 4
  }
]

Return ONLY the JSON array, no additional text. Do not include markdown formatting like \`\`\`json.`;

        console.log('Sending request to OpenRouter (DeepSeek)...');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "ChefAI Companion",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenRouter');
        }

        const content = data.choices[0].message.content.trim();
        console.log('Received response from DeepSeek');

        // Parse the JSON response
        let recipes;
        try {
            // Clean up markdown code blocks if present
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            recipes = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error. Content received:', content);
            // Try to extract JSON array
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                recipes = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse recipe JSON from DeepSeek response');
            }
        }

        // Validate that we got an array
        if (!Array.isArray(recipes)) {
            throw new Error('Response is not an array of recipes');
        }

        return recipes.slice(0, 5);

    } catch (error) {
        console.error('Error generating recipes:', error);
        throw new Error(`Failed to generate recipes: ${error.message}`);
    }
}
