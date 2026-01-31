import { useNavigate } from 'react-router-dom';
import { FaHome, FaDiscord } from 'react-icons/fa';
import "../styles/PrivacyPolicy.css"

function PrivacyPolicy() {
  const navigate = useNavigate();
  // const lastUpdated = new Date().toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric'
  // });
  const lastUpdated = "January 1, 2026";

  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <button
          className="back-button"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <FaHome /> Back to Home
        </button>

        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="last-updated">Last Updated: {lastUpdated}</p>

        <section className="privacy-section">
          <h2>Introduction</h2>
          <p className="privacy-text">
            We are committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Age Restriction</h2>
          <p className="privacy-text">
            <strong>Important:</strong> HAPPYY TALK is intended for users who are 18 years of age or older. By accessing or using our service, you confirm that you are at least 18 years old.
          </p>
          <div className="info-card" style={{ backgroundColor: '#2d3748', borderLeft: '4px solid #e53e3e', marginTop: '1rem' }}>
            <p className="privacy-text" style={{ color: '#fc8181', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              18+ Service
            </p>
            <p className="privacy-text">
              Due to the nature of our platform, which enables direct communication between users worldwide and potentially includes mature conversation topics, we restrict usage to adults only. We may terminate accounts if we discover users are under 18 years of age.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2>Information We Collect</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Personal Information</h3>
              <ul className="privacy-list">
                <li>Name and email address</li>
                <li>Profile information and preferences</li>
                <li>Language learning goals and progress</li>
                <li>Communication preferences</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Usage Information</h3>
              <ul className="privacy-list">
                <li>Room participation and activity</li>
                <li>Language practice sessions</li>
                <li>Interactions with other users</li>
                <li>Platform preferences and settings</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <h2>How We Use Your Information</h2>
          <p className="privacy-text">
            We use your information to:
          </p>
          <ul className="privacy-list">
            <li>Provide and improve our language learning platform</li>
            <li>Personalize your learning experience</li>
            <li>Connect you with appropriate language partners</li>
            <li>Send important updates and notifications</li>
            <li>Ensure platform security and prevent abuse</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Data Security</h2>
          <p className="privacy-text">
            We implement appropriate security measures to protect your personal information, including:
          </p>
          <ul className="privacy-list">
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage and transmission</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Your Rights</h2>
          <p className="privacy-text">
            You have the right to:
          </p>
          <ul className="privacy-list">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about this Privacy Policy or our data practices,
            please contact us through our Discord community:
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

export default PrivacyPolicy; 