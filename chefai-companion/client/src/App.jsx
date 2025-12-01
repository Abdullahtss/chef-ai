import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import PrivateRoute from './components/auth/PrivateRoute'
import PublicRoute from './components/auth/PublicRoute'
import RecipeGenerator from './components/RecipeGenerator'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import RecipesPage from './pages/RecipesPage'
import ProfilePage from './pages/ProfilePage'
import FitnessPage from './pages/FitnessPage'
import NutritionPage from './pages/NutritionPage'
import CommunityPage from './pages/CommunityPage'
import SupportPage from './pages/SupportPage'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes - Only accessible when not authenticated */}
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

                    {/* Protected Routes - All routes except /login require authentication */}
                    <Route path="/home" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />

                    <Route path="/recipes" element={
                        <PrivateRoute>
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
                        </PrivateRoute>
                    } />

                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/profile" element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    } />

                    <Route path="/fitness" element={
                        <PrivateRoute>
                            <FitnessPage />
                        </PrivateRoute>
                    } />

                    <Route path="/nutrition" element={
                        <PrivateRoute>
                            <NutritionPage />
                        </PrivateRoute>
                    } />

                    <Route path="/community" element={
                        <PrivateRoute>
                            <CommunityPage />
                        </PrivateRoute>
                    } />

                    <Route path="/support" element={
                        <PrivateRoute>
                            <SupportPage />
                        </PrivateRoute>
                    } />

                    {/* Default redirect - Redirects to /login if not authenticated, /home if authenticated */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Catch-all route for 404 - Protected */}
                    <Route path="*" element={
                        <PrivateRoute>
                            <NotFound />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
