import { useState } from 'react'
import axios from 'axios'
import RecipeCard from './RecipeCard'
import './RecipeGenerator.css'

function RecipeGenerator() {
    const [ingredients, setIngredients] = useState('')
    const [ingredientList, setIngredientList] = useState([])
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleAddIngredient = (e) => {
        e.preventDefault()
        if (ingredients.trim()) {
            setIngredientList([...ingredientList, ingredients.trim()])
            setIngredients('')
        }
    }

    const handleRemoveIngredient = (index) => {
        setIngredientList(ingredientList.filter((_, i) => i !== index))
    }

    const handleGenerateRecipes = async () => {
        if (ingredientList.length === 0) {
            setError('Please add at least one ingredient')
            return
        }

        setLoading(true)
        setError(null)
        setRecipes([])

        try {
            const response = await axios.post('/api/recipes/generate', {
                ingredients: ingredientList
            })

            if (response.data.success) {
                setRecipes(response.data.recipes)
            } else {
                setError('Failed to generate recipes')
            }
        } catch (err) {
            console.error('Error generating recipes:', err)
            setError(err.response?.data?.message || 'Failed to generate recipes. Please check your API key and try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddIngredient(e)
        }
    }

    return (
        <div className="recipe-generator">
            {/* Ingredient Input Section */}
            <div className="generator-section card card-glass">
                <h2>🥘 What's in Your Kitchen?</h2>
                <p className="section-description">
                    Add your available ingredients and let AI create amazing recipes for you!
                </p>

                <div className="ingredient-input-group">
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter an ingredient (e.g., chicken, tomatoes, pasta)"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="btn btn-secondary"
                        onClick={handleAddIngredient}
                        disabled={!ingredients.trim()}
                    >
                        Add
                    </button>
                </div>

                {/* Ingredient Tags */}
                {ingredientList.length > 0 && (
                    <div className="ingredient-tags">
                        {ingredientList.map((ingredient, index) => (
                            <div key={index} className="ingredient-tag">
                                <span>{ingredient}</span>
                                <button
                                    className="tag-remove"
                                    onClick={() => handleRemoveIngredient(index)}
                                    aria-label="Remove ingredient"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Generate Button */}
                <button
                    className="btn btn-primary btn-generate"
                    onClick={handleGenerateRecipes}
                    disabled={loading || ingredientList.length === 0}
                >
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            Generating Recipes...
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            Generate Recipes
                        </>
                    )}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}
            </div>

            {/* Recipes Display Section */}
            {recipes.length > 0 && (
                <div className="recipes-section">
                    <h2 className="recipes-title">
                        🎉 Your Personalized Recipes ({recipes.length})
                    </h2>
                    <div className="recipes-grid">
                        {recipes.map((recipe, index) => (
                            <RecipeCard key={index} recipe={recipe} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Our AI chef is crafting your recipes...</p>
                </div>
            )}
        </div>
    )
}

export default RecipeGenerator
