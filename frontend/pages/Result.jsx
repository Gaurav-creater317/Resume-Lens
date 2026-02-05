import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const report = location.state?.report;

    useEffect(() => {
        if (!report) {
            navigate('/');
            return;
        }

        if (report.score >= 80) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#ec4899', '#ffffff']
            });
        }
    }, [report, navigate]);

    if (!report) return null;

    return (
        <div className="result-content">
            <Link to="/" className="back-link">
                <ArrowLeft size={18} />
                Back to Scanner
            </Link>

            <div className="result-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="score-card glass-card"
                >
                    <div className="score-circle">
                        <svg viewBox="0 0 100 100">
                            <circle className="bg" cx="50" cy="50" r="45" />
                            <circle
                                className="progress"
                                cx="50" cy="50" r="45"
                                style={{ strokeDashoffset: 283 - (283 * report.score) / 100 }}
                            />
                        </svg>
                        <div className="score-value">
                            <span className="number">{report.score}</span>
                            <span className="total">/100</span>
                        </div>
                    </div>
                    <h2 className="score-title">Analysis Complete!</h2>
                    <p className="score-subtitle">For {report.jobRole} Role</p>
                    <div className="email-badge">
                        <Mail size={16} />
                        Report sent to {report.candidateEmail}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="feedback-section"
                >
                    <div className="glass-card">
                        <h3>Detailed Feedback</h3>
                        <ul className="feedback-list">
                            {report.feedback.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <CheckCircle className="check-icon" />
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="action-buttons">
                            <button className="btn-primary">
                                <Download size={18} />
                                Download PDF
                            </button>
                            <button className="btn-secondary">
                                <Share2 size={18} />
                                Share Results
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx="true">{`
        .result-content {
          margin-top: 1rem;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          transition: color 0.3s ease;
        }
        .back-link:hover {
          color: white;
        }
        .result-container {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
        }
        .score-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .score-circle {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 1.5rem;
        }
        .score-circle svg {
          transform: rotate(-90deg);
        }
        .score-circle circle {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
        }
        .score-circle .bg {
          stroke: rgba(255, 255, 255, 0.05);
        }
        .score-circle .progress {
          stroke: url(#score-gradient);
          stroke-dasharray: 283;
          transition: stroke-dashoffset 1s ease-out;
        }
        .score-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .score-value .number {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
        }
        .score-value .total {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: -5px;
        }
        .score-title {
          margin-bottom: 0.5rem;
        }
        .score-subtitle {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .email-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .feedback-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 1.5rem 0 2rem;
        }
        .feedback-list li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          line-height: 1.5;
        }
        .check-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 868px) {
          .result-container {
            grid-template-columns: 1fr;
          }
          .score-card {
            width: 100%;
          }
        }
      `}</style>
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default Result;
