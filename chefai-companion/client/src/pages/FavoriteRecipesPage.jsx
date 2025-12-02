import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getFavoriteRecipes, deleteFavoriteRecipe } from '../services/userService';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

function FavoriteRecipesPage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const response = await getFavoriteRecipes();

            if (response.success) {
                setFavoriteRecipes(response.recipes || []);
            } else {
                setError('Failed to load favorite recipes');
            }
        } catch (err) {
            console.error('Error fetching favorite recipes:', err);
            setError('Failed to load your favorite recipes');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (recipeId) => {
        try {
            await deleteFavoriteRecipe(recipeId);
            setFavoriteRecipes(favoriteRecipes.filter(r => r.recipeId !== recipeId));
        } catch (err) {
            console.error('Error deleting recipe:', err);
            setError('Failed to delete recipe');
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="container">
                    <div className="header-top">
                        <div className="logo-section">
                            <Link to="/home" className="logo-link">
                                <h1 className="logo">
                                    <span className="logo-icon">👨‍🍳</span>
                                    ChefAI Companion
                                </h1>
                            </Link>
                        </div>
                        <div className="user-actions">
                            <Link to="/recipes" className="btn btn-secondary">
                                Generate Recipes
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="welcome-section">
                        <h2>❤️ Favourite Recipes</h2>
                        <p>Your collection of favorite recipes</p>
                    </div>
                </div>
            </header>

            <main className="home-main">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Loading your favorite recipes...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    ) : favoriteRecipes.length > 0 ? (
                        <div className="recipes-grid">
                            {favoriteRecipes.map((recipe) => (
                                <div key={recipe.recipeId} className="recipe-wrapper">
                                    <RecipeCard recipe={recipe} index={0} hideActions={true} />
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(recipe.recipeId)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
                            <p>No favorite recipes yet. Start by generating some recipes!</p>
                            <Link to="/recipes" className="btn btn-primary">
                                Generate Recipes
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

export default FavoriteRecipesPage;

