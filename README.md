# ChefAI Companion 👨‍🍳

An AI-powered recipe generator that transforms your available ingredients into amazing culinary creations. Simply input what you have in your kitchen, and let OpenAI generate 4-5 personalized recipes with detailed step-by-step instructions.

## ✨ Features

- **Ingredient-Based Recipe Generation**: Add your available ingredients and get 4-5 unique recipe suggestions
- **AI-Powered**: Uses OpenAI GPT-3.5 to generate creative, detailed recipes
- **Step-by-Step Instructions**: Each recipe includes numbered cooking instructions
- **Recipe Details**: View prep time, cook time, difficulty level, and servings
- **Beautiful UI**: Modern, kitchen-inspired design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Set up the Backend**

```bash
cd api
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the `api` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
PORT=5000
OPENAI_API_KEY=your_actual_openai_api_key_here
NODE_ENV=development
```

4. **Set up the Frontend**

```bash
cd ../client
npm install
```

### Running the Application

1. **Start the Backend Server** (in the `api` directory):

```bash
cd api
npm run dev
```

The API will run on `http://localhost:5000`

2. **Start the Frontend** (in a new terminal, in the `client` directory):

```bash
cd client
npm run dev
```

The app will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📖 How to Use

1. **Add Ingredients**: Type an ingredient and click "Add" or press Enter
2. **Build Your List**: Add multiple ingredients (e.g., chicken, tomatoes, pasta, garlic)
3. **Generate Recipes**: Click the "Generate Recipes" button
4. **Explore Results**: Browse through 4-5 AI-generated recipes
5. **View Instructions**: Click "Show All Steps" to see complete cooking instructions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **OpenAI API** - AI recipe generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Custom styling with modern design system

## 📁 Project Structure

```
chefai-companion/
├── api/                    # Backend API
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic (OpenAI integration)
│   ├── server.js          # Express server setup
│   └── package.json
│
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🎨 Design System

The app uses a kitchen-inspired color palette:

- **Chef White**: Clean, professional background
- **Steel Grey**: Modern, sleek accents
- **Herb Green**: Fresh, vibrant primary color
- **Tomato Red**: Warm accent for alerts

## 🔑 API Endpoints

### POST `/api/recipes/generate`

Generate recipes from ingredients.

**Request Body:**
```json
{
  "ingredients": ["chicken", "tomatoes", "pasta", "garlic"]
}
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["1 cup ingredient1", "2 tbsp ingredient2"],
      "instructions": ["Step 1", "Step 2"],
      "prepTime": "15 minutes",
      "cookTime": "30 minutes",
      "difficulty": "Easy",
      "servings": 4
    }
  ]
}
```

## 🤝 Contributing

This is a student project for the Web Programming course. Contributions and suggestions are welcome!

## 📝 License

ISC

## 👥 Team

- Abdullah Ahmed (22L-7444)
- Khuzema Asim (21L-7644)
- Fatima Imran (22L-6946)

**Course**: Web Programming  
**Instructor**: Sir Saif Ullah Tanveer

---

s
