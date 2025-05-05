import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        isMenuOpen &&
        !target.closest(".navbar-container") &&
        !target.closest(".mobile-menu")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>Coin</span>Ark
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/market" className={`navbar-link ${pathname === "/market" ? "active" : ""}`}>
            Market
          </Link>
          <Link to="/news" className={`navbar-link ${pathname === "/news" ? "active" : ""}`}>
            News
          </Link>
          <Link to="/about" className={`navbar-link ${pathname === "/about" ? "active" : ""}`}>
            About
          </Link>
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" aria-label="Toggle dark mode">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          </button>

          <button
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile menu with fixed positioning */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" className={`mobile-menu-link ${pathname === "/" ? "active" : ""}`}>
          Home
        </Link>
        <Link to="/market" className={`mobile-menu-link ${pathname === "/market" ? "active" : ""}`}>
          Market
        </Link>
        <Link to="/news" className={`mobile-menu-link ${pathname === "/news" ? "active" : ""}`}>
          News
        </Link>
        <Link to="/about" className={`mobile-menu-link ${pathname === "/about" ? "active" : ""}`}>
          About
        </Link>
      </div>
    </nav>
  );
}


