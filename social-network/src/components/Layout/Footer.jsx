import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaQuestion } from 'react-icons/fa';

const Footer = () => {
  const currentYear = 2026;
  const liveDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <div className='flex flex-row gap-2'>
            <img
              src="/logo.png"
              alt="HAPPYY TALK Logo"
              className="w-10 h-8">
            </img>
            <h3>HAPPYY TALK</h3>
          </div>
          <p className="text-[11px] md:text-sm font-black tracking-[0.2em] text-blue-400 uppercase mt-3 py-1 px-3 bg-blue-500/10 rounded-full inline-block">Learn Earn Grow</p>
        </div>

        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-options">
            <a href="mailto:HAPPYY TALK@gmail.com" className="contact-option lowercase text-sm opacity-80 hover:opacity-100 transition-opacity">
              <FaEnvelope /> <span>HAPPYY TALK@gmail.com</span>
            </a>
            <Link to="/faq" className="contact-option">
              <FaQuestion /> <span>Help & FAQ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} HAPPYY TALK. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;