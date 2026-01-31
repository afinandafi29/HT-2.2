import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaDiscord } from 'react-icons/fa';
import "../styles/FAQ.css";

function FAQ() {
  const navigate = useNavigate();
  const lastUpdated = "January 1, 2026";

  return (
    <div className="faq-container">
      <div className="faq-content">
        <button
          className="back-button"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <FaHome /> Back to Home
        </button>

        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="last-updated">Last Updated: {lastUpdated}</p>

        <section className="faq-section">
          <h2>Getting Started</h2>

          <div className="faq-item">
            <h3>What is HAPPYY TALK?</h3>
            <p className="faq-text">
              HAPPYY TALK is a platform designed to help language learners practice their skills through
              conversation rooms with native speakers and other learners. It provides a supportive
              environment for improving speaking and listening skills in various languages.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I create an account?</h3>
            <p className="faq-text">
              You can create an account by clicking the "Sign Up" button on our login page.
              You'll need to provide a username, email address, and password. You can also sign up
              using your Google account for faster registration.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is HAPPYY TALK free to use?</h3>
            <p className="faq-text">
              Yes, the basic features of HAPPYY TALK are completely free. We offer premium subscription
              options with additional features like unlimited room creation, priority access to popular rooms,
              and advanced learning tools.
            </p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Using Conversation Rooms</h2>

          <div className="faq-item">
            <h3>How do I join a language room?</h3>
            <p className="faq-text">
              Browse the available rooms on the home page and click the "JOIN" button on any room you're
              interested in. You can filter rooms by language or use the search function to find specific topics.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I create my own conversation room?</h3>
            <p className="faq-text">
              Yes! Click the "+" button or "Create Room" in the navigation to create your own room.
              You can set the language, topic, and choose whether it's private or public.
            </p>
          </div>

          <div className="faq-item">
            <h3>What's the maximum number of people in a room?</h3>
            <p className="faq-text">
              Each room can have up to 10 participants to ensure quality conversations and
              equal speaking opportunities for everyone.
            </p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Account Management</h2>

          <div className="faq-item">
            <h3>How do I edit my profile?</h3>
            <p className="faq-text">
              Go to your profile page by clicking on your avatar in the top-right corner, then select "Profile".
              Click the edit button to update your information, change your profile picture, or modify your bio.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I delete my account?</h3>
            <p className="faq-text">
              Yes, you can delete your account from the Settings page. Please note that this action is permanent
              and will remove all your data from our platform.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I change my password?</h3>
            <p className="faq-text">
              You can change your password in the Settings section. If you've forgotten your password,
              use the "Forgot Password" link on the login page to reset it via email.
            </p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Troubleshooting</h2>

          <div className="faq-item">
            <h3>I'm having audio/video issues in a room</h3>
            <p className="faq-text">
              Make sure you've granted browser permissions for microphone and camera. Try refreshing the page
              or using a different browser. Check your internet connection and ensure your devices are working properly.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I report inappropriate behavior?</h3>
            <p className="faq-text">
              You can report users by clicking on their profile and selecting the "Report" option.
              Please provide details about the incident so our moderation team can take appropriate action.
            </p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Still Have Questions?</h2>
          <p className="faq-text">
            If you couldn't find the answer to your question, please contact us through our Discord community:
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

export default FAQ;