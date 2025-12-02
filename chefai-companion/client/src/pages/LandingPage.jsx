import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import chefLogo from '../assets/chef-logo.png';
import './LandingPage.css';

function LandingPage() {
    const [openFAQ, setOpenFAQ] = useState(null);

    useEffect(() => {
        // Smooth scroll for anchor links
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a');
            if (target) {
                const href = target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqs = [
        {
            question: "How does the AI recipe generator work?",
            answer: "Our AI recipe generator uses advanced machine learning to create unique recipes based on your input. Simply describe what you want to cook, list your available ingredients, or specify dietary preferences, and our AI will generate a complete recipe with ingredients, instructions, and cooking times tailored to your needs."
        },
        {
            question: "Can I save and organize my favorite recipes?",
            answer: "Yes! You can save any generated recipe to your personal collection. You can also mark recipes as favorites for quick access, organize them by category, and access all your saved recipes from anywhere, anytime. Your recipe collection is stored securely in your account."
        },
        {
            question: "How do I share recipes with other users?",
            answer: "Sharing recipes is easy! You can share any of your saved or favorite recipes with other users by entering their username. They'll receive the recipe in their shared recipes section. You can also discover amazing recipes shared by the community and build a network of recipe enthusiasts."
        },
        {
            question: "Is there a free plan available?",
            answer: "Yes, we offer a free Basic plan that includes limited usage credits, the ability to save your recipes, basic AI chat functionality, and community support. You can upgrade to Premium or Pro plans anytime to unlock more features, higher usage limits, and advanced capabilities."
        },
        {
            question: "What dietary restrictions and preferences does the AI support?",
            answer: "Our AI recipe generator supports a wide range of dietary needs including vegetarian, vegan, gluten-free, keto, paleo, low-carb, dairy-free, and more. You can specify your dietary restrictions when generating recipes, and the AI will create recipes that comply with your requirements while still being delicious and nutritious."
        }
    ];

    return (
        <div className="landing-page">
            {/* Header */}
            <header>
                <div className="container">
                    <nav>
                        <Link to="/" className="logo">
                            <img src={chefLogo} alt="Chef AI Logo" className="logo-icon" />
                            <span className="logo-text">ChefAI Companion</span>
                        </Link>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><Link to="/login" className="btn-nav">Login</Link></li>
                            <li><Link to="/signup" className="btn-nav">Sign Up</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Create Custom Recipes with AI</h1>
                        <p>Your Personalized AI Kitchen Copilot - Instantly generate recipes tailored to your tastes, goals, and lifestyle</p>
                        <div>
                            <Link to="/signup" className="btn-primary">Start Free Trial</Link>
                            <button className="btn-secondary">Watch Demo</button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                            alt="Chef preparing delicious meal with AI assistance"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="feature-item">
                        <div className="feature-content">
                            <h2>AI Recipe Generator</h2>
                            <p>Describe any idea or ingredient list and our AI instantly creates a unique recipe just for you.</p>
                            <ul className="feature-list">
                                <li>Turn leftovers into delicious meals</li>
                                <li>Request substitutions and dietary tweaks</li>
                               
                                <li>Never run out of inspiration</li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            <img 
                                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="AI Recipe Generator - Creating unique recipes"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-content">
                            <h2>Save Your Favorite Creations</h2>
                            <p>Build your personal recipe collection and never lose a recipe again. Keep all your favorite recipes organized in one place.</p>
                            <ul className="feature-list">
                                <li>Save recipes to your personal collection</li>
                                <li>Mark favorites for quick access</li>
                                <li>Organize recipes by category</li>
                                <li>Access your saved recipes anytime, anywhere</li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            <img 
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="Save Recipes - Recipe collection"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-content">
                            <h2>Share Favourite Recipes</h2>
                            <p>Share your favorite recipes with friends, family, and the community. Discover amazing recipes shared by other users.</p>
                            <ul className="feature-list">
                                <li>Share your favorite recipes with other users</li>
                                <li>Discover recipes shared by the community</li>
                                <li>Send recipes directly to friends</li>
                                <li>Build a network of recipe enthusiasts</li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            <img 
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80" 
                                alt="Share Favourite Recipes - Recipe sharing"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="container">
                    <h2>Choose Your Plan</h2>
                    <p>Start free and upgrade anytime. Cancel anytime with no questions asked.</p>
                    
                    <div className="pricing-toggle">
                        <span>Monthly</span>
                        <div className="toggle-switch active"></div>
                        <span>Annual<br /><small style={{ color: '#667eea', fontWeight: '600' }}>Save 25%</small></span>
                    </div>

                    <div className="pricing-cards">
                        <div className="pricing-card">
                            <div className="plan-name">Basic</div>
                            <div className="plan-price">Free</div>
                            <ul className="plan-features">
                                <li>Limited usage credits</li>
                                <li>Save your recipes</li>
                                <li>Basic AI chat</li>
                                <li>Community support</li>
                            </ul>
                            <Link to="/signup" className="btn-primary">Get Started</Link>
                        </div>

                        <div className="pricing-card featured">
                            <div className="badge">MOST POPULAR</div>
                            <div className="plan-name">Premium</div>
                            <div className="plan-price">$9.99<small style={{ fontSize: '16px', color: '#999' }}>/mo</small></div>
                            <ul className="plan-features">
                                <li>25x more usage credits</li>
                                <li>Personalized AI model</li>
                                <li>Advanced meal planner</li>
                                <li>Ad-free experience</li>
                                <li>Priority support</li>
                            </ul>
                            <Link to="/signup" className="btn-primary">Start Trial</Link>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-name">Pro</div>
                            <div className="plan-price">$19.99<small style={{ fontSize: '16px', color: '#999' }}>/mo</small></div>
                            <ul className="plan-features">
                                <li>Everything in Premium</li>
                                <li>Commercial rights</li>
                                <li>Higher usage limits</li>
                                <li>AI image generation</li>
                                <li>Privacy mode</li>
                            </ul>
                            <Link to="/signup" className="btn-primary">Start Trial</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <p className="faq-subtitle">Everything you need to know about ChefAI Companion</p>
                    <div className="faq-container">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`faq-item ${openFAQ === index ? 'active' : ''}`}>
                                <button 
                                    className="faq-question" 
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={openFAQ === index}
                                >
                                    <span>{faq.question}</span>
                                    <svg 
                                        className="faq-icon" 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <path d="M6 9l6 6 6-6"/>
                                    </svg>
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <p>&copy; 2024 Chef AI. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;

