import SharedRecipe from '../models/SharedRecipe.js';
import User from '../models/User.js';

// @desc    Share a recipe with another user
// @route   POST /api/shared/share
// @access  Private
export const shareRecipe = async (req, res) => {
    try {
        const { recipe, recipientName } = req.body;
        const senderId = req.userId;

        // Validation
        if (!recipe || !recipientName) {
            return res.status(400).json({
                success: false,
                message: 'Recipe and recipient name are required'
            });
        }

        // Get sender info
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({
                success: false,
                message: 'Sender not found'
            });
        }

        // Find recipient by name (case-insensitive)
        const recipient = await User.findOne({ 
            name: { $regex: new RegExp(`^${recipientName}$`, 'i') }
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please check the username.'
            });
        }

        // Prevent sharing with yourself
        if (recipient._id.toString() === senderId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot share a recipe with yourself'
            });
        }

        // Generate unique recipe ID
        const recipeId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create shared recipe
        const sharedRecipe = await SharedRecipe.create({
            recipeId,
            recipe,
            senderId,
            senderName: sender.name,
            recipientId: recipient._id,
            recipientName: recipient.name,
            sharedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: `Recipe shared successfully with ${recipient.name}`,
            sharedRecipe
        });
    } catch (error) {
        console.error('Share recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sharing recipe',
            error: error.message
        });
    }
};

// @desc    Get all shared recipes (sent and received)
// @route   GET /api/shared
// @access  Private
export const getSharedRecipes = async (req, res) => {
    try {
        const userId = req.userId;
        const { filter } = req.query; // 'all', 'sent', 'received'

        let query = {};
        
        if (filter === 'sent') {
            query = { senderId: userId };
        } else if (filter === 'received') {
            query = { recipientId: userId };
        } else {
            // Get both sent and received
            query = {
                $or: [
                    { senderId: userId },
                    { recipientId: userId }
                ]
            };
        }

        const sharedRecipes = await SharedRecipe.find(query)
            .sort({ sharedAt: -1 })
            .populate('senderId', 'name email')
            .populate('recipientId', 'name email');

        // Format the response
        const formattedRecipes = sharedRecipes.map(sr => ({
            _id: sr._id,
            recipeId: sr.recipeId,
            recipe: sr.recipe,
            senderId: sr.senderId._id || sr.senderId,
            senderName: sr.senderName,
            recipientId: sr.recipientId._id || sr.recipientId,
            recipientName: sr.recipientName,
            sharedAt: sr.sharedAt,
            status: sr.senderId._id?.toString() === userId.toString() ? 'sent' : 'received',
            isSender: sr.senderId._id?.toString() === userId.toString()
        }));

        res.json({
            success: true,
            count: formattedRecipes.length,
            recipes: formattedRecipes
        });
    } catch (error) {
        console.error('Get shared recipes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching shared recipes',
            error: error.message
        });
    }
};

// @desc    Delete a shared recipe
// @route   DELETE /api/shared/:sharedRecipeId
// @access  Private
export const deleteSharedRecipe = async (req, res) => {
    try {
        const { sharedRecipeId } = req.params;
        const userId = req.userId;

        const sharedRecipe = await SharedRecipe.findById(sharedRecipeId);

        if (!sharedRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Shared recipe not found'
            });
        }

        // Only recipient or sender can delete
        const isRecipient = sharedRecipe.recipientId.toString() === userId.toString();
        const isSender = sharedRecipe.senderId.toString() === userId.toString();

        if (!isRecipient && !isSender) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this shared recipe'
            });
        }

        await SharedRecipe.findByIdAndDelete(sharedRecipeId);

        res.json({
            success: true,
            message: 'Shared recipe deleted successfully'
        });
    } catch (error) {
        console.error('Delete shared recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting shared recipe',
            error: error.message
        });
    }
};

// @desc    Search users by name (for autocomplete)
// @route   GET /api/shared/search-users
// @access  Private
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const userId = req.userId;

        if (!q || q.length < 2) {
            return res.json({
                success: true,
                users: []
            });
        }

        // Search users by name (case-insensitive, exclude current user)
        const users = await User.find({
            _id: { $ne: userId },
            name: { $regex: new RegExp(q, 'i') }
        })
        .select('name email')
        .limit(10);

        res.json({
            success: true,
            users: users.map(u => ({
                name: u.name,
                email: u.email
            }))
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
};

// @desc    Get user's recipes to share (saved and favorite)
// @route   GET /api/shared/my-recipes
// @access  Private
export const getMyRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Combine saved and favorite recipes
        const allRecipes = [
            ...user.savedRecipes.map(r => ({ ...r.toObject(), source: 'saved' })),
            ...user.favoriteRecipes.map(r => ({ ...r.toObject(), source: 'favorite' }))
        ];

        res.json({
            success: true,
            recipes: allRecipes
        });
    } catch (error) {
        console.error('Get my recipes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your recipes',
            error: error.message
        });
    }
};

