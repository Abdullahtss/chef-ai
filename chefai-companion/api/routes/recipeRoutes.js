import express from 'express';
import { generateRecipesFromIngredients } from '../controllers/recipeController.js';

const router = express.Router();

// POST /api/recipes/generate - Generate recipes from ingredients
router.post('/generate', generateRecipesFromIngredients);

export default router;
