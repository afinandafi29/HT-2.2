import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaDiscord, FaCoffee } from 'react-icons/fa';
import "../styles/AboutUs.css"

function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="about-us-container">
            <div className="about-us-content">
                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                    aria-label="Back to home"
                >
                    <FaHome /> Back to Home
                </button>

                <h1 className="about-title">About Us</h1>
                <p className="text-xs opacity-50 mb-6 text-center">Updated on January 1, 2026</p>

                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p className="about-text">
                        We are dedicated to creating a vibrant community where language learners can connect,
                        practice, and grow together. Our platform combines the power of social networking
                        with structured language learning to make the journey of mastering a new language
                        more engaging and effective.
                    </p>
                </section>

                <section className="about-section">
                    <h2>What We Offer</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Language Rooms</h3>
                            <p className="about-text">
                                Join specialized rooms for different languages and proficiency levels.
                                Practice with native speakers and fellow learners in a supportive environment.
                            </p>
                        </div>
                        <div className="feature-card">
                            <h3>Real-time Communication</h3>
                            <p className="about-text">
                                Engage in live video conversations, text chats, and voice messages to
                                improve your speaking and listening skills.
                            </p>
                        </div>
                        <div className="feature-card">
                            <h3>Premium Features</h3>
                            <p className="about-text">
                                Access advanced features like private rooms, priority support, and
                                exclusive learning resources to accelerate your language journey.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Our Team</h2>
                    <p className="about-text">
                        We are a passionate team of language enthusiasts, educators, and developers
                        committed to making language learning accessible and enjoyable for everyone.
                        Our diverse backgrounds and experiences help us understand and address the
                        unique needs of language learners worldwide.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Contact & Support</h2>
                    <div className="contact-options">
                        <a
                            href="https://discord.gg/baqCXxTusQ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <FaDiscord /> Join our Discord Community
                        </a>
                        <a
                            href="https://www.buymeacoffee.com/socialnetworking"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <FaCoffee /> Support Us on Buy Me a Coffee
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUs; 