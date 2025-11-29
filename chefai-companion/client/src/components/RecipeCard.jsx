import { useState } from 'react'
import './RecipeCard.css'

function RecipeCard({ recipe, index }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="recipe-card card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Recipe Header */}
            <div className="recipe-header">
                <div className="recipe-number">#{index + 1}</div>
                <h3 className="recipe-name">{recipe.name}</h3>
                <p className="recipe-description">{recipe.description}</p>
            </div>

            {/* Recipe Meta Info */}
            <div className="recipe-meta">
                <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <div>
                        <div className="meta-label">Prep</div>
                        <div className="meta-value">{recipe.prepTime}</div>
                    </div>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">🔥</span>
                    <div>
                        <div className="meta-label">Cook</div>
                        <div className="meta-value">{recipe.cookTime}</div>
                    </div>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <div>
                        <div className="meta-label">Servings</div>
                        <div className="meta-value">{recipe.servings}</div>
                    </div>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">📊</span>
                    <div>
                        <div className="meta-label">Level</div>
                        <div className={`meta-value difficulty-${recipe.difficulty.toLowerCase()}`}>
                            {recipe.difficulty}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="recipe-section">
                <h4 className="section-title">🛒 Ingredients</h4>
                <ul className="ingredients-list">
                    {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="ingredient-item">
                            <span className="ingredient-bullet">•</span>
                            {ingredient}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instructions Section */}
            <div className="recipe-section">
                <h4 className="section-title">👨‍🍳 Instructions</h4>
                <div className={`instructions-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <ol className="instructions-list">
                        {recipe.instructions.map((instruction, idx) => (
                            <li key={idx} className="instruction-item">
                                <div className="instruction-number">{idx + 1}</div>
                                <div className="instruction-text">{instruction}</div>
                            </li>
                        ))}
                    </ol>
                </div>

                {recipe.instructions.length > 3 && (
                    <button
                        className="btn-expand"
                        onClick={toggleExpanded}
                    >
                        {isExpanded ? '▲ Show Less' : '▼ Show All Steps'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default RecipeCard
