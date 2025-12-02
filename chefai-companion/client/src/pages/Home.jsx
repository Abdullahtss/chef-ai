import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSavedRecipes, getFavoriteRecipes } from '../services/userService';
import chefLogo from '../assets/chef-logo.png';
import './Home.css';

function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [savedCount, setSavedCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecipeCounts();
    }, []);

    const fetchRecipeCounts = async () => {
        try {
            setLoading(true);
            const [savedRes, favoriteRes] = await Promise.all([
                getSavedRecipes(),
                getFavoriteRecipes()
            ]);

            if (savedRes.success) {
                setSavedCount(savedRes.recipes?.length || 0);
            }

            if (favoriteRes.success) {
                setFavoriteCount(favoriteRes.recipes?.length || 0);
            }
        } catch (err) {
            console.error('Error fetching recipe counts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="container">
                    <div className="header-top">
                        <div className="logo-section">
                            <h1 className="logo">
                                <img src={chefLogo} alt="ChefAI Logo" className="logo-icon" />
                                <span className="logo-text">ChefAI Companion</span>
                            </h1>
                        </div>
                        <div className="user-actions">
                            <Link to="/shared" className="btn btn-secondary">
                                Shared Recipes
                            </Link>
                            <Link to="/recipes" className="btn btn-secondary">
                                Generate Recipes
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="welcome-section">
                        <h2>Welcome back, {user?.name}! 👋</h2>
                        <p>Here are your saved and favorite recipes</p>
                    </div>
                </div>
            </header>

            <main className="home-main">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <div className="recipe-cards-container">
                            {/* Favorite Recipes Card */}
                            <Link to="/favorites" className="recipe-card-link">
                                <div className="recipe-card">
                                    <div className="card-icon favorite-icon">❤️</div>
                                    <h3 className="card-title">Favourite Recipes</h3>
                                    <p className="card-count">{favoriteCount} {favoriteCount === 1 ? 'recipe' : 'recipes'}</p>
                                    <div className="card-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </div>
                                </div>
                            </Link>

                            {/* Saved Recipes Card */}
                            <Link to="/saved" className="recipe-card-link">
                                <div className="recipe-card">
                                    <div className="card-icon saved-icon">📌</div>
                                    <h3 className="card-title">Saved Recipes</h3>
                                    <p className="card-count">{savedCount} {savedCount === 1 ? 'recipe' : 'recipes'}</p>
                                    <div className="card-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <div className="container">
                    <p>&copy; 2025 ChefAI Companion. Powered by OpenAI.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
