import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import PublicRoute from './components/auth/PublicRoute'
import ProtectedRoutes from './components/auth/ProtectedRoutes'
import RecipeGenerator from './components/RecipeGenerator'
import Home from './pages/Home'
import SavedRecipesPage from './pages/SavedRecipesPage'
import FavoriteRecipesPage from './pages/FavoriteRecipesPage'
import SharedRecipesPage from './pages/SharedRecipesPage'
import LandingPage from './pages/LandingPage'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/signup" element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    } />

                    {/* All other routes are protected */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/saved" element={<SavedRecipesPage />} />
                        <Route path="/favorites" element={<FavoriteRecipesPage />} />
                        <Route path="/shared" element={<SharedRecipesPage />} />
                        <Route path="/recipes" element={
                            <div className="app">
                                <header className="app-header">
                                    <div className="container">
                                        <div className="header-content">
                                            <h1 className="logo">
                                                <span className="logo-icon">👨‍🍳</span>
                                                ChefAI Companion
                                            </h1>
                                            <p className="tagline">Transform your ingredients into culinary masterpieces</p>
                                        </div>
                                    </div>
                                </header>

                                <main className="app-main">
                                    <div className="container">
                                        <RecipeGenerator />
                                    </div>
                                </main>

                                <footer className="app-footer">
                                    <div className="container">
                                        <p>&copy; 2025 ChefAI Companion. Powered by OpenAI.</p>
                                    </div>
                                </footer>
                            </div>
                        } />
                        
                        {/* Catch-all route for any other protected paths */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Route>
                    
                    {/* Catch-all for unknown public routes - redirect to landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
