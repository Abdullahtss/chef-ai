import mongoose from 'mongoose';

const sharedRecipeSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: true
    },
    recipe: {
        name: String,
        description: String,
        ingredients: [String],
        instructions: [String],
        prepTime: String,
        cookTime: String,
        difficulty: String,
        servings: Number
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    sharedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
sharedRecipeSchema.index({ recipientId: 1, sharedAt: -1 });
sharedRecipeSchema.index({ senderId: 1, sharedAt: -1 });

const SharedRecipe = mongoose.model('SharedRecipe', sharedRecipeSchema);

export default SharedRecipe;

