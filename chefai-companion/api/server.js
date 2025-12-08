import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sharedRecipeRoutes from './routes/sharedRecipeRoutes.js';
import mealPlannerRoutes from './routes/mealPlannerRoutes.js';

dotenv.config();

// Connect to MongoDB (non-blocking - server will start even if DB connection fails)
connectDB().catch(err => {
  console.error('⚠️  Database connection failed, but server will continue running');
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// Increase JSON body size limit to handle base64 image uploads (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shared', sharedRecipeRoutes);
app.use('/api/meal-planner', mealPlannerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ChefAI Companion API is running' });
});

// Debug endpoint to check environment variables (remove in production later)
app.get('/api/debug', (req, res) => {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const frontendUrl = process.env.FRONTEND_URL;

  res.json({
    environment: process.env.NODE_ENV || 'not set',
    frontendUrl: frontendUrl || 'not set',
    groqApiKey: groqKey ? `Set (starts with: ${groqKey.substring(0, 10)}...)` : 'NOT SET',
    openRouterApiKey: openRouterKey ? `Set (starts with: ${openRouterKey.substring(0, 15)}...)` : 'NOT SET',
    openAiApiKey: openAiKey ? `Set (starts with: ${openAiKey.substring(0, 15)}...)` : 'NOT SET',
    recipeService: openRouterKey ? 'OPENROUTER (with GROQ fallback)' : (groqKey ? 'GROQ' : 'NONE')
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
