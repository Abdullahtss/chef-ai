import dotenv from 'dotenv';

dotenv.config();

// Get API keys from environment variables
const groqKey = process.env.GROQ_API_KEY;
const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

/**
 * Generate 4-5 recipes based on provided ingredients
 * Uses OpenRouter first, falls back to Groq
 * @param {Array<string>} ingredients - List of available ingredients
 * @returns {Promise<Array>} Array of recipe objects
 */
export async function generateRecipes(ingredients) {
    // Use OpenRouter first (works on localhost), fall back to Groq (works everywhere)
    if (openRouterKey) {
        console.log('Using OpenRouter API...');
        try {
            return await generateRecipesWithOpenRouter(ingredients);
        } catch (error) {
            console.log('OpenRouter failed, trying Groq...', error.message);
            if (groqKey) {
                return await generateRecipesWithGroq(ingredients);
            }
            throw error;
        }
    } else if (groqKey) {
        console.log('Using Groq API...');
        return generateRecipesWithGroq(ingredients);
    } else {
        throw new Error('No API key found. Please add OPENROUTER_API_KEY or GROQ_API_KEY to your environment variables.');
    }
}

/**
 * Generate recipes using Groq API (works on localhost and production)
 */
async function generateRecipesWithGroq(ingredients) {
    try {
        console.log('Groq API Key loaded:', groqKey ? `Yes (starts with: ${groqKey.substring(0, 10)}...)` : 'No - MISSING!');

        if (!groqKey) {
            throw new Error('Groq API key is missing. Please add GROQ_API_KEY to your .env file.');
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

        console.log('Sending request to Groq...');

        const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = `Groq API Error: ${response.status} - ${errorData}`;

            if (response.status === 401) {
                errorMessage += '\n\n💡 This usually means your API key is invalid or expired.';
            } else if (response.status === 429) {
                errorMessage += '\n\n💡 Rate limit exceeded. Please try again later.';
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from Groq');
        }

        const content = data.choices[0].message.content.trim();
        console.log('Received response from Groq');

        // Parse the JSON response
        let recipes;
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            recipes = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error. Content received:', content);
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                recipes = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse recipe JSON from Groq response');
            }
        }

        if (!Array.isArray(recipes)) {
            throw new Error('Response is not an array of recipes');
        }

        return recipes.slice(0, 5);

    } catch (error) {
        console.error('Error generating recipes with Groq:', error);
        throw new Error(`Failed to generate recipes: ${error.message}`);
    }
}

/**
 * Generate recipes using OpenRouter API (works on localhost)
 */
async function generateRecipesWithOpenRouter(ingredients) {
    try {
        console.log('OpenRouter API Key loaded:', openRouterKey ? `Yes (starts with: ${openRouterKey.substring(0, 15)}...)` : 'No - MISSING!');

        if (!openRouterKey) {
            throw new Error('OpenRouter API key is missing.');
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

        console.log('Sending request to OpenRouter...');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
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
            let errorMessage = `OpenRouter API Error: ${response.status} - ${errorData}`;

            if (response.status === 401) {
                errorMessage += '\n\n💡 This usually means your API key is invalid or expired.';
            } else if (response.status === 429) {
                errorMessage += '\n\n💡 Rate limit exceeded. Please try again later.';
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenRouter');
        }

        const content = data.choices[0].message.content.trim();
        console.log('Received response from OpenRouter');

        let recipes;
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            recipes = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error. Content received:', content);
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                recipes = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse recipe JSON from OpenRouter response');
            }
        }

        if (!Array.isArray(recipes)) {
            throw new Error('Response is not an array of recipes');
        }

        return recipes.slice(0, 5);

    } catch (error) {
        console.error('Error generating recipes with OpenRouter:', error);
        throw new Error(`Failed to generate recipes: ${error.message}`);
    }
}
