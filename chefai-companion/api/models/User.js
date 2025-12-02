import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not using Google OAuth
        },
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    avatar: {
        type: String
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    savedRecipes: [{
        recipeId: String,
        name: String,
        description: String,
        ingredients: [String],
        instructions: [String],
        prepTime: String,
        cookTime: String,
        difficulty: String,
        servings: Number,
        savedAt: {
            type: Date,
            default: Date.now
        }
    }],
    favoriteRecipes: [{
        recipeId: String,
        name: String,
        description: String,
        ingredients: [String],
        instructions: [String],
        prepTime: String,
        cookTime: String,
        difficulty: String,
        servings: Number,
        favoritedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving (only if password is provided and modified)
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) {
        return false; // No password set (Google OAuth user)
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
