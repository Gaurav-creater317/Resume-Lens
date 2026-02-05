import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [jobRole, setJobRole] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobRole || !email) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobRole', jobRole);
        formData.append('email', email);

        try {
            const response = await axios.post('http://localhost:5000/api/analysis/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                navigate('/result', { state: { report: response.data.data } });
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to analyze resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-content">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="hero-section"
            >
                <h1 className="hero-title">
                    Land Your <span className="gradient-text">Dream Job</span> <br />
                    With AI-Powered Analysis
                </h1>
                <p className="hero-subtitle">
                    Upload your resume and get an instant score and a detailed <br />
                    improvement report sent straight to your inbox.
                </p>
            </motion.div>

            <div className="main-grid">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="form-container"
                >
                    <div className="glass-card">
                        <h2 className="card-title">Start Analysis</h2>
                        <form onSubmit={handleSubmit} className="analysis-form">
                            <div className="form-group">
                                <label>Target Job Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Upload Resume (PDF/DOCX)</label>
                                <div className={`file-upload-zone ${file ? 'has-file' : ''}`}>
                                    <input
                                        type="file"
                                        id="resume-upload"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.doc,.docx"
                                        hidden
                                        required
                                    />
                                    <label htmlFor="resume-upload" className="upload-label">
                                        {file ? (
                                            <div className="file-info">
                                                <ShieldCheck color="#10b981" />
                                                <span>{file.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={32} />
                                                <span>Drag and drop or click to upload</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>Analysing...</>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Analyze Now
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="info-container"
                >
                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon"><Sparkles /></div>
                            <div>
                                <h3>Instant Scoring</h3>
                                <p>Get a score out of 100 based on your target job role instantly.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><Send /></div>
                            <div>
                                <h3>Email Reports</h3>
                                <p>Receive a comprehensive PDF report with actionable feedback.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><ShieldCheck /></div>
                            <div>
                                <h3>ATS Optimization</h3>
                                <p>Identify missing keywords and formatting issues that block ATS.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx="true">{`
        .home-content {
          margin-top: 2rem;
        }
        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
        }
        .hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 1.2rem;
          line-height: 1.6;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .card-title {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        .analysis-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .file-upload-zone {
          border: 2px dashed var(--glass-border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .file-upload-zone:hover {
          background: rgba(99, 102, 241, 0.05);
          border-color: var(--primary);
        }
        .file-upload-zone.has-file {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: var(--text-secondary);
          margin-bottom: 0;
        }
        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #10b981;
          font-weight: 500;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .feature-item {
          display: flex;
          gap: 1.5rem;
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          background: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .feature-item h3 {
          margin-bottom: 0.5rem;
        }
        .feature-item p {
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .w-full {
          width: 100%;
          justify-content: center;
        }
        @media (max-width: 968px) {
          .main-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .hero-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Home;
