import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <Camera className="logo-icon" size={32} />
                    <span>Resume <span className="highlight">Lens</span></span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Scanner</Link>
                    <a href="#" className="nav-link">Pricing</a>
                    <a href="#" className="nav-link">About</a>
                </div>
            </div>
            <style jsx="true">{`
        .navbar {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
        }
        .logo-icon {
          color: var(--primary);
        }
        .highlight {
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: white;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
