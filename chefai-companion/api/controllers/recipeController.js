import { generateRecipes } from '../services/aiService.js';

/**
 * Generate recipes from ingredients
 * POST /api/recipes/generate
 * Body: { ingredients: ["ingredient1", "ingredient2", ...] }
 */
export async function generateRecipesFromIngredients(req, res) {
    try {
        const { ingredients } = req.body;

        // Validation
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Please provide an array of ingredients'
            });
        }

        // Filter out empty strings and trim whitespace
        const cleanedIngredients = ingredients
            .map(ing => ing.trim())
            .filter(ing => ing.length > 0);

        if (cleanedIngredients.length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Please provide at least one valid ingredient'
            });
        }

        console.log(`Generating recipes for ingredients: ${cleanedIngredients.join(', ')}`);

        // Generate recipes using OpenAI
        const recipes = await generateRecipes(cleanedIngredients);

        res.json({
            success: true,
            count: recipes.length,
            recipes: recipes
        });

    } catch (error) {
        console.error('Error in generateRecipesFromIngredients:', error);
        res.status(500).json({
            error: 'Failed to generate recipes',
            message: error.message
        });
    }
}
