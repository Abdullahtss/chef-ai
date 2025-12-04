# Vercel Deployment Guide for ChefAI Companion

This guide will help you deploy both the frontend and backend of ChefAI Companion to Vercel.

## 📋 Prerequisites

- Vercel account (khuzemaasim456@gmail.com)
- GitHub repository connected: https://github.com/Abdullahtss/chef-ai
- MongoDB Atlas account (for database)
- OpenAI API key or OpenRouter API key

## 🚀 Deployment Steps

### Step 1: Deploy the Backend API

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your account (khuzemaasim456@gmail.com)

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository: `Abdullahtss/chef-ai`
   - Select the repository and click "Import"

3. **Configure Backend Project**
   - **Root Directory**: Set to `chefai-companion/api`
   - **Framework Preset**: Select "Other" or "Node.js"
   - **Build Command**: Leave empty (or use `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Environment Variables** (Backend)
   Add these environment variables in Vercel:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   OPENAI_API_KEY=your_openai_api_key
   # OR use OpenRouter instead:
   # OPENROUTER_API_KEY=your_openrouter_api_key
   JWT_SECRET=your_secure_jwt_secret_key_here
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Copy the deployment URL** (e.g., `https://chefai-api.vercel.app`)
   - This will be your backend API URL

### Step 2: Deploy the Frontend

1. **Create New Project in Vercel**
   - Click "Add New" → "Project"
   - Import the same GitHub repository: `Abdullahtss/chef-ai`
   - This will be a separate project from the backend

2. **Configure Frontend Project**
   - **Root Directory**: Set to `chefai-companion/client`
   - **Framework Preset**: Select "Vite"
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`

3. **Environment Variables** (Frontend)
   Add these environment variables in Vercel:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
   ⚠️ **Important**: Replace `your-backend-url.vercel.app` with the actual backend URL from Step 1

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live!

## 🔧 Alternative: Single Project with Monorepo

If you prefer to deploy both frontend and backend in a single Vercel project:

1. **Create a root `vercel.json`** in the project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "chefai-companion/api/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "chefai-companion/client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "chefai-companion/api/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "chefai-companion/client/$1"
    }
  ]
}
```

2. **Set Root Directory** to project root
3. **Add all environment variables** as listed above

## 📝 Environment Variables Summary

### Backend (`chefai-companion/api`)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to `production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` - AI service API key
- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID

### Frontend (`chefai-companion/client`)
- `VITE_API_URL` - Backend API URL (e.g., `https://your-api.vercel.app/api`)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

## 🔍 Post-Deployment Checklist

- [ ] Backend API is accessible (check `/api/health` endpoint)
- [ ] Frontend can connect to backend API
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] Google OAuth is configured (if using)
- [ ] CORS is properly configured (should work with Vercel)

## 🐛 Troubleshooting

### Backend Issues

1. **"Module not found" errors**
   - Ensure `package.json` is in the `chefai-companion/api` directory
   - Check that all dependencies are listed in `package.json`

2. **Database connection fails**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
   - Ensure MongoDB Atlas cluster is running

3. **API key errors**
   - Verify `OPENAI_API_KEY` or `OPENROUTER_API_KEY` is set
   - Check API key is valid and has credits

### Frontend Issues

1. **API calls fail**
   - Verify `VITE_API_URL` is set correctly
   - Check backend URL is accessible
   - Ensure CORS is enabled on backend

2. **Build fails**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript/ESLint errors

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test API endpoints directly
4. Check browser console for frontend errors

---

**Note**: After deployment, update the `VITE_API_URL` in the frontend environment variables if the backend URL changes.

