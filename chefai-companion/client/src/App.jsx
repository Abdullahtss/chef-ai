import { useState } from 'react'
import RecipeGenerator from './components/RecipeGenerator'
import './App.css'

function App() {
    return (
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
    )
}

export default App
