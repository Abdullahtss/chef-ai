import api from './api';

// Share a recipe with another user
export const shareRecipe = async (recipe, recipientName) => {
    const response = await api.post('/shared/share', { recipe, recipientName });
    return response.data;
};

// Get all shared recipes (sent and received)
export const getSharedRecipes = async (filter = 'all') => {
    const response = await api.get(`/shared?filter=${filter}`);
    return response.data;
};

// Delete a shared recipe
export const deleteSharedRecipe = async (sharedRecipeId) => {
    const response = await api.delete(`/shared/${sharedRecipeId}`);
    return response.data;
};

// Search users by name (for autocomplete)
export const searchUsers = async (query) => {
    const response = await api.get(`/shared/search-users?q=${encodeURIComponent(query)}`);
    return response.data;
};

// Get user's recipes to share
export const getMyRecipes = async () => {
    const response = await api.get('/shared/my-recipes');
    return response.data;
};

export default {
    shareRecipe,
    getSharedRecipes,
    deleteSharedRecipe,
    searchUsers,
    getMyRecipes
};

