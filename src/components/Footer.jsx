import React from 'react'
import "../styles/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <span className="gradient-text">Coin</span>Ark
            </a>
            <p className="footer-tagline">
              The next generation cryptocurrency platform for tracking, trading, and managing your digital assets.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Discord">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v9a5 5 0 0 0 5 5h4" />
                  <circle cx="15" cy="15" r="5" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-heading">Products</h3>
            <ul className="footer-list">
              <li><a href="#">Portfolio Tracker</a></li>
              <li><a href="#">Price Alerts</a></li>
              <li><a href="#">Trading View</a></li>
              <li><a href="#">Mobile App</a></li>
              <li><a href="#">API Access</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-list">
              <li><a href="#">Market Data</a></li>
              <li><a href="#">Learning Hub</a></li>
              <li><a href="#">Crypto Glossary</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-list">
              <li><a href="/about">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Kit</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3 className="footer-heading">Stay Updated</h3>
            <p className="footer-newsletter-text">
              Subscribe to our newsletter for the latest crypto news, updates, and exclusive offers.
            </p>
            <form className="footer-form">
              <input type="email" placeholder="Your email address" className="footer-input" />
              <button type="submit" className="footer-button neon-glow">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} CoinArk. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;