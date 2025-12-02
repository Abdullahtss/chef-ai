import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSharedRecipes, deleteSharedRecipe } from '../services/sharedRecipeService';
import { saveRecipe, favoriteRecipe } from '../services/userService';
import RecipeCard from '../components/RecipeCard';
import ShareRecipeModal from '../components/shared/ShareRecipeModal';
import './SharedRecipesPage.css';

function SharedRecipesPage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sharedRecipes, setSharedRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'sent', 'received'
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchSharedRecipes();
    }, [filter]);

    useEffect(() => {
        applyFilters();
    }, [sharedRecipes, searchQuery]);

    const fetchSharedRecipes = async () => {
        try {
            setLoading(true);
            const response = await getSharedRecipes(filter);
            if (response.success) {
                setSharedRecipes(response.recipes || []);
            } else {
                setError('Failed to load shared recipes');
            }
        } catch (err) {
            console.error('Error fetching shared recipes:', err);
            setError('Failed to load shared recipes');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...sharedRecipes];

        // Apply search (filtering by status is already done by API)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r => {
                const recipeName = r.recipe?.name?.toLowerCase() || '';
                const senderName = r.senderName?.toLowerCase() || '';
                const recipientName = r.recipientName?.toLowerCase() || '';
                return recipeName.includes(query) || 
                       senderName.includes(query) || 
                       recipientName.includes(query);
            });
        }

        setFilteredRecipes(filtered);
    };

    const handleDelete = async (sharedRecipeId) => {
        if (!window.confirm('Are you sure you want to remove this shared recipe?')) {
            return;
        }

        setActionLoading({ ...actionLoading, [sharedRecipeId]: true });

        try {
            await deleteSharedRecipe(sharedRecipeId);
            setSharedRecipes(sharedRecipes.filter(r => r._id !== sharedRecipeId));
        } catch (err) {
            console.error('Error deleting shared recipe:', err);
            alert('Failed to delete shared recipe');
        } finally {
            setActionLoading({ ...actionLoading, [sharedRecipeId]: false });
        }
    };

    const handleSave = async (recipe) => {
        const actionKey = `save_${recipe.recipeId}`;
        setActionLoading({ ...actionLoading, [actionKey]: true });

        try {
            await saveRecipe(recipe);
            alert('Recipe saved successfully!');
        } catch (err) {
            console.error('Error saving recipe:', err);
            alert('Failed to save recipe');
        } finally {
            setActionLoading({ ...actionLoading, [actionKey]: false });
        }
    };

    const handleFavorite = async (recipe) => {
        const actionKey = `favorite_${recipe.recipeId}`;
        setActionLoading({ ...actionLoading, [actionKey]: true });

        try {
            await favoriteRecipe(recipe);
            alert('Recipe added to favorites!');
        } catch (err) {
            console.error('Error favoriting recipe:', err);
            alert('Failed to favorite recipe');
        } finally {
            setActionLoading({ ...actionLoading, [actionKey]: false });
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const sharedDate = new Date(date);
        const diffInSeconds = Math.floor((now - sharedDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleShareSuccess = () => {
        fetchSharedRecipes();
    };

    return (
        <div className="shared-recipes-page">
            <header className="shared-recipes-header">
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
                        <h2>📤 View Shared Recipes</h2>
                        <p>Discover recipes shared by the community</p>
                    </div>
                </div>
            </header>

            <main className="shared-recipes-main">
                <div className="container">
                    {/* Controls Section */}
                    <div className="controls-section">
                        <button 
                            className="btn btn-primary btn-share"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                            Share Recipe
                        </button>

                        <div className="filters-section">
                            <div className="filter-tabs">
                                <button
                                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All ({sharedRecipes.length})
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'received' ? 'active' : ''}`}
                                    onClick={() => setFilter('received')}
                                >
                                    Received ({sharedRecipes.filter(r => r.status === 'received').length})
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'sent' ? 'active' : ''}`}
                                    onClick={() => setFilter('sent')}
                                >
                                    Sent ({sharedRecipes.filter(r => r.status === 'sent').length})
                                </button>
                            </div>

                            <div className="search-box">
                                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search recipes, senders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <button 
                                        className="search-clear"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Loading shared recipes...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <span>⚠️</span>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={fetchSharedRecipes}>
                                Try Again
                            </button>
                        </div>
                    ) : filteredRecipes.length > 0 ? (
                        <div className="recipes-grid">
                            {filteredRecipes.map((sharedRecipe) => (
                                <div key={sharedRecipe._id} className="shared-recipe-card">
                                    <div className="recipe-header-info">
                                        <div className="share-status">
                                            <span className={`status-badge ${sharedRecipe.status}`}>
                                                {sharedRecipe.status === 'sent' ? '📤 Sent' : '📥 Received'}
                                            </span>
                                            <span className="time-ago">{formatTimeAgo(sharedRecipe.sharedAt)}</span>
                                        </div>
                                        <div className="user-info">
                                            {sharedRecipe.status === 'sent' ? (
                                                <span>To: <strong>{sharedRecipe.recipientName}</strong></span>
                                            ) : (
                                                <span>From: <strong>{sharedRecipe.senderName}</strong></span>
                                            )}
                                        </div>
                                    </div>
                                    <RecipeCard recipe={sharedRecipe.recipe} index={0} hideActions={true} />
                                    <div className="recipe-actions">
                                        <button
                                            className="action-btn action-save"
                                            onClick={() => handleSave(sharedRecipe.recipe)}
                                            disabled={actionLoading[`save_${sharedRecipe.recipe.recipeId}`]}
                                        >
                                            {actionLoading[`save_${sharedRecipe.recipe.recipeId}`] ? 'Saving...' : '💾 Save'}
                                        </button>
                                        <button
                                            className="action-btn action-favorite"
                                            onClick={() => handleFavorite(sharedRecipe.recipe)}
                                            disabled={actionLoading[`favorite_${sharedRecipe.recipe.recipeId}`]}
                                        >
                                            {actionLoading[`favorite_${sharedRecipe.recipe.recipeId}`] ? 'Adding...' : '❤️ Favorite'}
                                        </button>
                                        <button
                                            className="action-btn action-delete"
                                            onClick={() => handleDelete(sharedRecipe._id)}
                                            disabled={actionLoading[sharedRecipe._id]}
                                        >
                                            {actionLoading[sharedRecipe._id] ? 'Removing...' : '🗑️ Remove'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No shared recipes found</h3>
                            <p>
                                {searchQuery 
                                    ? 'Try adjusting your search or filters'
                                    : filter === 'sent'
                                    ? "You haven't shared any recipes yet"
                                    : filter === 'received'
                                    ? "No one has shared recipes with you yet"
                                    : "No recipes have been shared yet. Be the first to share!"}
                            </p>
                            {!searchQuery && (
                                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                                    Share Your First Recipe
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <div className="container">
                    <p>&copy; 2025 ChefAI Companion. Powered by OpenAI.</p>
                </div>
            </footer>

            <ShareRecipeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleShareSuccess}
            />
        </div>
    );
}

export default SharedRecipesPage;

