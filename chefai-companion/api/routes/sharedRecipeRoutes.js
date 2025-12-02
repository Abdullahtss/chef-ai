import express from 'express';
import {
    shareRecipe,
    getSharedRecipes,
    deleteSharedRecipe,
    searchUsers,
    getMyRecipes
} from '../controllers/sharedRecipeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/share', auth, shareRecipe);
router.get('/', auth, getSharedRecipes);
router.get('/my-recipes', auth, getMyRecipes);
router.get('/search-users', auth, searchUsers);
router.delete('/:sharedRecipeId', auth, deleteSharedRecipe);

export default router;

