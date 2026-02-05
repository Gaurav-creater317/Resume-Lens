import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Mail, Download, Clock, Star,
  AlertCircle, TrendingUp, Lightbulb, UserCheck, ShieldCheck,
  LayoutDashboard, Target, Zap, FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const storedReport = localStorage.getItem('latest_resume_report');
    const activeReport = location.state?.report || (storedReport ? JSON.parse(storedReport) : null);

    if (!activeReport) {
      navigate('/');
      return;
    }

    setReport(activeReport);

    // Celebration Sparkles
    const triggerSparkles = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#6D93FB', '#10b981', '#ffffff']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#6D93FB', '#10b981', '#ffffff']
        });
      }, 250);
    };

    triggerSparkles();
  }, [location.state, navigate]);

  if (!report) return (
    <div className="loading-screen">
      <LayoutDashboard className="spinning-icon" size={40} />
      <p>Loading your analysis...</p>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="lovable-root">
      <nav className="top-nav">
        <div className="nav-container">
          <Link to="/" className="brand">
            <div className="logo-sq">R</div>
            <span>Resume Lens</span>
          </Link>
          <div className="nav-actions">
            <button className="btn-secondary" onClick={() => window.print()}>
              <Download size={16} />
              Save PDF
            </button>
            <Link to="/" className="btn-primary-sm">New Scan</Link>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="report-sidebar"
        >
          <div className="score-main-card">
            <div className="score-label-top">ATS Score</div>
            <div className="score-display">
              <span className="sc-val">{report.score}</span>
              <span className="sc-total">/100</span>
            </div>
            <div className="score-meter">
              <div className="meter-fill" style={{ width: `${report.score}%` }}></div>
            </div>
            <h3 className="verdict-title">{report.recommendation}</h3>
            <p className="verdict-sub">Target: {report.jobRole}</p>
          </div>

          <div className="meta-info-stack">
            <div className="meta-pill">
              <Mail size={14} />
              <span>{report.candidateEmail}</span>
            </div>
            <div className="meta-pill">
              <Clock size={14} />
              <span>Analyzed {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="success-notif">
              <div className="check-blob"><ShieldCheck size={18} /></div>
              <p>Full report emailed successfully!</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="report-content-flow"
        >
          <div className="result-content-grid">
            <motion.div variants={itemVariants} className="analysis-card">
              <div className="card-header">
                <div className="icon-wrap green"><Zap size={20} /></div>
                <h3>Key Strengths</h3>
              </div>
              <div className="strengths-grid">
                {report.strengths.map((s, i) => (
                  <div key={i} className="strength-item">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="analysis-card">
              <div className="card-header">
                <div className="icon-wrap blue"><Target size={20} /></div>
                <h3>Critical Improvements</h3>
              </div>
              <div className="improvements-list">
                {report.improvements.map((imp, i) => (
                  <div key={i} className="improvement-row">
                    <div className="imp-number">{i + 1}</div>
                    <p>{imp}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="analysis-card span-2">
              <div className="card-header">
                <div className="icon-wrap orange"><AlertCircle size={20} /></div>
                <h3>Missing Expertise & Keywords</h3>
              </div>
              <div className="tags-container">
                {report.missingSkills.map((skill, i) => (
                  <span key={i} className="skill-badge">{skill}</span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="ats-insight-card span-2">
              <div className="ats-icon-box"><FileSearch size={32} /></div>
              <div className="ats-text">
                <h4>Pro Tip: Pass the ATS Bots</h4>
                <p>{report.atsTip || "Companies use algorithms to filter resumes. To increase your score to 90+, ensure your experience section contains quantifiable results (percentages and numbers) and uses standard industry keywords found in the job description."}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;
