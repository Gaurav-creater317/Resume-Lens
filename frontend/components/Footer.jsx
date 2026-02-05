import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; 2026 Resume Lens AI. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
            <style jsx="true">{`
        .footer {
          padding: 3rem 2rem;
          border-top: 1px solid var(--glass-border);
          margin-top: 4rem;
          background: var(--bg-darker);
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .footer-links {
          display: flex;
          gap: 2rem;
        }
        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: white;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
