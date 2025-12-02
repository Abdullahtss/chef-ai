import { useState, useEffect } from 'react';
import { shareRecipe, searchUsers, getMyRecipes } from '../../services/sharedRecipeService';
import { saveRecipe, favoriteRecipe } from '../../services/userService';
import './ShareRecipeModal.css';

function ShareRecipeModal({ isOpen, onClose, onSuccess }) {
    const [recipientName, setRecipientName] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [myRecipes, setMyRecipes] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadMyRecipes();
        }
    }, [isOpen]);

    useEffect(() => {
        if (recipientName.length >= 2) {
            const timeoutId = setTimeout(() => {
                searchUsersByName(recipientName);
            }, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setUserSuggestions([]);
        }
    }, [recipientName]);

    const loadMyRecipes = async () => {
        try {
            const response = await getMyRecipes();
            if (response.success) {
                setMyRecipes(response.recipes || []);
            }
        } catch (err) {
            console.error('Error loading recipes:', err);
        }
    };

    const searchUsersByName = async (query) => {
        try {
            setSearching(true);
            const response = await searchUsers(query);
            if (response.success) {
                setUserSuggestions(response.users || []);
            }
        } catch (err) {
            console.error('Error searching users:', err);
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!recipientName.trim()) {
            setError('Please enter a recipient name');
            return;
        }

        if (!selectedRecipe) {
            setError('Please select a recipe to share');
            return;
        }

        const recipe = myRecipes.find(r => r.recipeId === selectedRecipe);
        if (!recipe) {
            setError('Selected recipe not found');
            return;
        }

        setLoading(true);

        try {
            const response = await shareRecipe(recipe, recipientName.trim());
            if (response.success) {
                setSuccess(`Recipe shared successfully with ${recipientName}!`);
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 1500);
            } else {
                setError(response.message || 'Failed to share recipe');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while sharing the recipe');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRecipientName('');
        setSelectedRecipe('');
        setError('');
        setSuccess('');
        setUserSuggestions([]);
        onClose();
    };

    const handleSuggestionClick = (name) => {
        setRecipientName(name);
        setUserSuggestions([]);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Share Recipe</h2>
                    <button className="modal-close" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="share-form">
                    {error && (
                        <div className="alert alert-error">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="recipient">Recipient Username</label>
                        <div className="input-with-suggestions">
                            <input
                                type="text"
                                id="recipient"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="Enter username..."
                                className="form-input"
                                required
                            />
                            {userSuggestions.length > 0 && (
                                <div className="suggestions-dropdown">
                                    {userSuggestions.map((user, idx) => (
                                        <div
                                            key={idx}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(user.name)}
                                        >
                                            <div className="suggestion-name">{user.name}</div>
                                            <div className="suggestion-email">{user.email}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searching && (
                                <div className="searching-indicator">Searching...</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="recipe">Select Recipe to Share</label>
                        <select
                            id="recipe"
                            value={selectedRecipe}
                            onChange={(e) => setSelectedRecipe(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Choose a recipe...</option>
                            {myRecipes.map((recipe) => (
                                <option key={recipe.recipeId} value={recipe.recipeId}>
                                    {recipe.name} {recipe.source ? `(${recipe.source})` : ''}
                                </option>
                            ))}
                        </select>
                        {myRecipes.length === 0 && (
                            <p className="form-hint">No recipes available. Save or favorite some recipes first!</p>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading || myRecipes.length === 0}>
                            {loading ? 'Sharing...' : 'Share Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShareRecipeModal;

