import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <div className="logo-icon-wrapper">
                        <FileText className="logo-icon" size={24} strokeWidth={2.5} />
                        <span className="sparkle">✦</span>
                    </div>
                    <span className="logo-text">ResumeIQ</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <a href="#" className="nav-link">Features</a>
                    <a href="#" className="nav-link">Pricing</a>
                </div>
            </div>
            <style jsx="true">{`
        .navbar {
          width: 100%;
          padding: 1.25rem 2rem;
          background: white;
          border-bottom: 1px solid #e5eaf2;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-icon {
          color: #3b82f6;
        }
        .sparkle {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 10px;
          color: #3b82f6;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.02em;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: #3b82f6;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
