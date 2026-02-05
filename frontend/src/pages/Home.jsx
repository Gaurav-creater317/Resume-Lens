import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, Loader2, Sparkles, CheckCircle2, ShieldCheck, Mail, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Home = () => {
    const [jobRole, setJobRole] = useState('Frontend Developer');
    const [customRole, setCustomRole] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState('');
    const navigate = useNavigate();

    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Fullstack Developer",
        "Mobile App Developer",
        "Data Scientist",
        "Data Engineer",
        "DevOps Engineer",
        "UI/UX Designer",
        "Product Manager",
        "Project Manager",
        "HR / Human Resources",
        "Marketing Specialist",
        "Sales Representative",
        "Business Analyst",
        "Other"
    ];

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('--- Analysis Button Clicked ---');

        if (!file) {
            alert('Please upload your resume.');
            return;
        }
        if (!email) {
            alert('Please enter your email.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const allowedDomains = [
            'gmail.com', 'yahoo.com', 'icloud.com', 'outlook.com',
            'hotmail.com', 'live.com', 'aol.com', 'protonmail.com',
            'proton.me', 'zoho.com', 'yandex.com'
        ];
        const domain = email.split('@')[1].toLowerCase();
        if (!allowedDomains.includes(domain)) {
            alert('Please use a trusted email provider (like Gmail, Yahoo, iCloud, or Outlook).');
            return;
        }

        const roleToSubmit = (jobRole === 'Other' ? customRole : jobRole) || 'General Role';

        setLoading(true);
        setLoadingStage('Scanning resume structure...');

        const stages = [
            'Extracting text and keywords...',
            `Evaluating alignment for ${roleToSubmit}...`,
            'Generating ATS-friendly feedback...',
            'Finalizing your score...'
        ];

        let stageIdx = 0;
        const stageInterval = setInterval(() => {
            if (stageIdx < stages.length) {
                setLoadingStage(stages[stageIdx]);
                stageIdx++;
            }
        }, 2000);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobRole', roleToSubmit);
        formData.append('email', email);

        try {
            console.log('Starting analysis for:', email, roleToSubmit);
            const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
            const response = await axios.post(`${API_BASE_URL}/api/analysis/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Backend response:', response.data);

            if (response.data.success) {
                clearInterval(stageInterval);
                localStorage.setItem('latest_resume_report', JSON.stringify(response.data.data));

                setTimeout(() => {
                    navigate('/result', { state: { report: response.data.data } });
                }, 500); // Quick redirect
            }
        } catch (error) {
            clearInterval(stageInterval);
            console.error('Full Error Object:', error);
            const errMsg = error.response?.data?.error || error.message;
            alert(`Analysis Failed: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-root">
            <div className="home-container">
                <header className="home-header">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="logo-badge"
                    >
                        <div className="logo-icon-wrapper">
                            <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                                <rect width="40" height="40" rx="10" fill="#6D93FB" />
                                <path d="M12 10C10.8954 10 10 10.8954 10 12V28C10 29.1046 10.8954 30 12 30H28C29.1046 30 30 29.1046 30 28V15.5L24.5 10H12Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                <path d="M24 10V16H30" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                <circle cx="31" cy="9" r="3" fill="#6D93FB" stroke="white" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <h1 className="logo-name">Resume Lens</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="home-tagline"
                    >
                        Professional AI Resume Analysis & Scoring
                    </motion.p>
                </header>

                <main className="content-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="main-form-card"
                    >
                        <div className="form-card-inner">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="loading-wrapper"
                                    >
                                        <Loader2 className="spinning-icon" size={60} />
                                        <h2 className="loading-title">{loadingStage}</h2>
                                        <p className="loading-sub">Our AI is meticulously reviewing your credentials</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="resume-form"
                                    >
                                        <div className="upload-section">
                                            <div className="section-label">
                                                <FileText size={18} />
                                                <span>Step 1: Upload Resume (PDF)</span>
                                            </div>
                                            <div className={`drop-zone ${file ? 'has-file' : ''}`}>
                                                <input
                                                    type="file"
                                                    id="resume-input"
                                                    onChange={handleFileUpload}
                                                    accept=".pdf"
                                                    hidden
                                                />
                                                <label htmlFor="resume-input" className="zone-content">
                                                    <Upload size={40} className="upload-glyph" />
                                                    <div className="zone-text-group">
                                                        <p className="zone-main-text">{file ? file.name : "Select your Resume PDF"}</p>
                                                        <p className="zone-sub-text">or drag and drop here</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="fields-section">
                                            <div className="field-group">
                                                <div className="section-label">
                                                    <Briefcase size={18} />
                                                    <span>Step 2: Target Job Role</span>
                                                </div>
                                                <div className="select-wrapper">
                                                    <select
                                                        value={jobRole}
                                                        onChange={(e) => setJobRole(e.target.value)}
                                                        className="modern-select"
                                                    >
                                                        <option value="">-- Intelligent Best Practices --</option>
                                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            {jobRole === 'Other' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="field-group"
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Specify your custom role..."
                                                        value={customRole}
                                                        onChange={(e) => setCustomRole(e.target.value)}
                                                        className="modern-input"
                                                    />
                                                </motion.div>
                                            )}

                                            <div className="field-group">
                                                <div className="section-label">
                                                    <Mail size={18} />
                                                    <span>Step 3: Your Email</span>
                                                </div>
                                                <input
                                                    type="email"
                                                    placeholder="e.g. jason@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="modern-input"
                                                    required
                                                />
                                                <p className="input-hint">We'll send your detailed report here</p>
                                            </div>
                                        </div>

                                        <button type="submit" className="pulse-button" disabled={loading}>
                                            <Sparkles size={20} />
                                            <span>Start AI Analysis</span>
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="features-card"
                    >
                        <h3 className="features-title">Why use Resume Lens?</h3>
                        <div className="feature-items">
                            <div className="feature-items">
                                <div className="feature-item">
                                    <div className="feat-icon"><CheckCircle2 color="#10b981" /></div>
                                    <div className="feat-text">
                                        <h4>Instant Scoring</h4>
                                        <p>Get a precise score out of 100 based on industry benchmarks.</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feat-icon"><ShieldCheck color="#6D93FB" /></div>
                                    <div className="feat-text">
                                        <h4>ATS Optimization</h4>
                                        <p>Our AI identifies keywords that help you bypass HR filters.</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feat-icon"><Mail color="#f59e0b" /></div>
                                    <div className="feat-text">
                                        <h4>Inbox Ready</h4>
                                        <p>A professional report is archived and sent to your email instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="trust-badge">
                            🚀 Trusted by 50,000+ Job Seekers
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Home;
