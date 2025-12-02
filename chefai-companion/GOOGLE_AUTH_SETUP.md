# Google OAuth Setup Guide

This guide will help you set up Google Authentication for the ChefAI Companion application.

## Prerequisites

- A Google Cloud Platform account
- Access to Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: "ChefAI Companion" (or any name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity Services"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (for testing) or Internal (for organization)
     - App name: "ChefAI Companion"
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Add scopes: `email`, `profile`, `openid`
     - Click "Save and Continue"
     - Add test users (if external) or skip
     - Click "Back to Dashboard"

5. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "ChefAI Companion Web Client"
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (for development)
     - `http://localhost:3000` (if using different port)
     - Add your production URL when deploying
   - **Authorized redirect URIs:**
     - `http://localhost:5173` (for development)
     - Add your production URL when deploying
   - Click "Create"
   - **Copy the Client ID** (you'll need this)

## Step 2: Configure Backend (.env)

Add the following to your `chefai-companion/api/.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important Notes:**
- Replace `your-google-client-id-here` with the Client ID you copied from Google Cloud Console
- Replace `JWT_SECRET` with a strong, random secret key (at least 32 characters)
- Never commit your `.env` file to version control

## Step 3: Configure Frontend (.env)

Create a `.env` file in `chefai-companion/client/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Note:** The `VITE_` prefix is required for Vite to expose the variable to the frontend.

## Step 4: Restart Servers

After adding the environment variables, restart both servers:

```bash
# Stop current servers (Ctrl+C)
# Then restart:

# Backend
cd chefai-companion/api
npm run dev

# Frontend (in new terminal)
cd chefai-companion/client
npm run dev
```

## Step 5: Test Google Authentication

1. Navigate to `http://localhost:5173/login` or `http://localhost:5173/signup`
2. You should see a "Continue with Google" button
3. Click it and sign in with your Google account
4. You should be redirected to the home page after successful authentication

## Troubleshooting

### "Google Client ID not found" Warning
- Make sure you created the `.env` file in the `client` directory
- Verify the variable name is `VITE_GOOGLE_CLIENT_ID` (with `VITE_` prefix)
- Restart the frontend server after adding the variable

### "Invalid Google token" Error
- Verify `GOOGLE_CLIENT_ID` in the backend `.env` matches the one in frontend
- Check that the Client ID is correct in Google Cloud Console
- Ensure the authorized origins include `http://localhost:5173`

### Button Not Showing
- Check browser console for errors
- Verify the Google Identity Services script is loading
- Make sure `VITE_GOOGLE_CLIENT_ID` is set correctly

### CORS Errors
- Make sure your backend CORS is configured to allow requests from `http://localhost:5173`
- Check that authorized JavaScript origins in Google Console include your frontend URL

## Security Notes

1. **Never expose your Client Secret** - Only the Client ID should be in the frontend
2. **Use HTTPS in production** - Update authorized origins and redirect URIs
3. **Rotate JWT_SECRET** - Use a strong, random secret in production
4. **Review OAuth scopes** - Only request the permissions you need

## Production Deployment

When deploying to production:

1. Update Google Cloud Console:
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"

2. Update environment variables:
   - Set `GOOGLE_CLIENT_ID` in your production backend environment
   - Set `VITE_GOOGLE_CLIENT_ID` in your production frontend environment
   - Use a strong `JWT_SECRET` in production

3. Update OAuth Consent Screen:
   - Complete the verification process if required
   - Add your production domain

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

