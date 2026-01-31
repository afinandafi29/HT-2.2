import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaDiscord } from 'react-icons/fa';
import "../styles/TermsAndConditions.css"


function TermsAndConditions() {
  const navigate = useNavigate();
  // const lastUpdated = new Date().toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric'
  // });
  const lastUpdated = "January 1, 2026";

  return (
    <div className="terms-container">
      <div className="terms-content">
        <button
          className="back-button"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <FaHome /> Back to Home
        </button>

        <h1 className="terms-title">Terms & Conditions</h1>
        <p className="last-updated">Last Updated: {lastUpdated}</p>

        <section className="terms-section">
          <h2>Agreement to Terms</h2>
          <p className="terms-text">
            By accessing and using our platform, you agree to be bound by these Terms and Conditions.
            If you disagree with any part of these terms, you may not access our service.
          </p>
        </section>

        <section className="terms-section">
          <h2>User Accounts</h2>
          <p className="terms-text">
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for maintaining the security of your account and for all activities
            that occur under your account.
          </p>
          <ul className="terms-list">
            <li>You must be at least 18 years old to use our service</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to terminate accounts that violate our terms</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>User Conduct</h2>
          <p className="terms-text">
            As a user of our platform, you agree to:
          </p>
          <ul className="terms-list">
            <li>Respect other users and maintain a positive learning environment</li>
            <li>Not engage in harassment, hate speech, or discriminatory behavior</li>
            <li>Not share inappropriate or offensive content</li>
            <li>Not attempt to impersonate other users or staff members</li>
            <li>Not use the platform for any illegal purposes</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>Language Room Guidelines</h2>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h3>Room Participation</h3>
              <ul className="terms-list">
                <li>Join rooms appropriate for your language level</li>
                <li>Be respectful of other learners</li>
                <li>Follow room moderators' instructions</li>
                <li>Report inappropriate behavior</li>
              </ul>
            </div>
            <div className="guideline-card">
              <h3>Learning Environment</h3>
              <ul className="terms-list">
                <li>Create a supportive atmosphere</li>
                <li>Share knowledge constructively</li>
                <li>Use appropriate language</li>
                <li>Help others learn</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <h2>Premium Features</h2>
          <p className="terms-text">
            Premium features are subject to additional terms and conditions:
          </p>
          <ul className="terms-list">
            <li>Subscription fees are non-refundable</li>
            <li>Premium features may change without notice</li>
            <li>We reserve the right to modify premium pricing</li>
            <li>Premium status can be revoked for violations</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>Intellectual Property</h2>
          <p className="terms-text">
            The platform and its original content, features, and functionality are owned by us and
            are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="terms-section">
          <h2>Termination</h2>
          <p className="terms-text">
            We may terminate or suspend your account and access to the platform immediately,
            without prior notice, for any reason, including breach of these Terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>Changes to Terms</h2>
          <p className="terms-text">
            We reserve the right to modify these terms at any time. We will notify users of any
            material changes via email or platform notifications.
          </p>
        </section>

        <section className="terms-section">
          <h2>Contact Information</h2>
          <p className="terms-text">
            If you have any questions about these Terms, please contact us through our Discord community:
          </p>
          <a
            href="https://discord.gg/baqCXxTusQ"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <FaDiscord /> Join our Discord Community
          </a>
        </section>
      </div>
    </div>
  );
}

export default TermsAndConditions; 