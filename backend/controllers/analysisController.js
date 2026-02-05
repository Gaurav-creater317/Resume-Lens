const nodemailer = require('nodemailer');
const pdf = require('pdf-parse-fork');

exports.analyzeResume = async (req, res) => {
    try {
        const { jobRole, email } = req.body;
        const file = req.file;

        if (!file || !email) {
            return res.status(400).json({ error: 'Missing required fields (file or email)' });
        }

        // Efficient Professional Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address.' });
        }

        const domain = email.split('@')[1].toLowerCase();

        // 1. Domain Reputation Check (Basic Security)
        const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwawaymail.com', 'getnada.com'];
        if (disposableDomains.includes(domain)) {
            return res.status(400).json({ error: 'Temporary/Disposable emails are not allowed for security reasons.' });
        }

        // 2. DNS MX Record Verification (Ensures the domain is real and can receive mail)
        try {
            const dns = require('dns').promises;
            const mx = await dns.resolveMx(domain);
            if (!mx || mx.length === 0) {
                return res.status(400).json({ error: 'The email domain is invalid or cannot receive emails.' });
            }
        } catch (e) {
            console.error('DNS Verification Failed:', e.message);
            // If DNS lookup fails but it's a major provider, allow it as a fallback
            const trustedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
            if (!trustedDomains.includes(domain)) {
                return res.status(400).json({ error: 'Undeliverable email domain detected.' });
            }
        }

        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Only PDF files are supported currently.' });
        }

        const dataBuffer = file.buffer;
        let pdfData;

        try {
            pdfData = await pdf(dataBuffer);
        } catch (pdfError) {
            console.error('PDF parsing error:', pdfError);
            return res.status(400).json({ error: 'Failed to extract text from PDF. Ensure the file is not corrupted.' });
        }

        const extractedText = pdfData.text;

        if (!extractedText || extractedText.trim().length < 50) {
            return res.status(400).json({ error: 'Resume Not Detected\nThe uploaded file does not appear to be a valid resume.\nPlease upload a proper resume/CV PDF for analysis.' });
        }

        // 1.5 Local Heuristic Check (Ensure it's a resume)
        const resumeKeywords = ['experience', 'education', 'skills', 'contact', 'summary', 'projects', 'employment', 'certificates', 'work', 'history', 'academic', 'profile'];
        const lowerText = extractedText.toLowerCase();
        const textLength = extractedText.trim().length;
        const keywordMatchCount = resumeKeywords.filter(keyword => lowerText.includes(keyword)).length;

        // If it doesn't contain at least 3 standard resume keywords, reject it
        if (keywordMatchCount < 3) {
            return res.status(400).json({
                error: 'Resume Not Detected\nThe uploaded file does not appear to be a valid resume.\nPlease upload a proper resume/CV PDF for analysis.'
            });
        }
        // 2. High-Fidelity ATS Analysis Engine
        await new Promise(resolve => setTimeout(resolve, 2000));

        // --- STEP 1: INTELLIGENT ROLE & SENIORITY DETECTION ---
        const roleDefinitions = {
            'Frontend Engineer': {
                keywords: ['react', 'vue', 'angular', 'frontend', 'ui', 'ux', 'css', 'typescript', 'vite', 'webpack', 'tailwind', 'sass', 'redux', 'next.js', 'browser', 'dom', 'spa'],
                strengths: ['Modern framework proficiency (React/Next.js)', 'Component-driven architecture implementation', 'Responsive design & CSS optimization', 'Advanced State Management (Redux/Zustand)'],
                missing: ['Lighthouse Optimization', 'Atomic Design Patterns', 'Unit Testing (Jest/Cypress)', 'Core Web Vitals', 'WAI-ARIA Accessibility'],
                tip: 'Frontend ATS look for "Performance Optimization" and "Accessibility". Mention how you improved Largest Contentful Paint (LCP).'
            },
            'Backend Engineer': {
                keywords: ['node', 'backend', 'java', 'spring', 'python', 'django', 'postgresql', 'api', 'mongodb', 'sql', 'rest', 'graphql', 'microservices', 'redis', 'rabbitmq'],
                strengths: ['Scalable API design & documentation', 'Robust database schema optimization', 'System architecture & microservices awareness', 'Distributed systems design'],
                missing: ['Load Balancing', 'Database Indexing Tuning', 'Containerization (Docker)', 'Query Performance Profiling', 'OAuth2/OpenID Connect'],
                tip: 'Backend recruiters prioritize "Throughput" and "Reliability". Highlight your experience with database partitioning or horizontal scaling.'
            },
            'Fullstack Engineer': {
                keywords: ['fullstack', 'mern', 'mean', 'full stack', 'web development', 'express', 'node', 'react', 'database', 'deployment'],
                strengths: ['End-to-end feature delivery capability', 'Seamless frontend-backend integration', 'Versatility across multiple tech stacks', 'Database-to-UI data flow orchestration'],
                missing: ['End-to-End Testing', 'Security Best Practices (OWASP)', 'Server-Side Rendering (SSR)', 'CI/CD Pipeline Automation'],
                tip: 'For Fullstack roles, demonstrate your ability to bridge the gap between complex UI requirements and database efficiency.'
            },
            'AI / ML Engineer': {
                keywords: ['machine learning', 'pytorch', 'tensorflow', 'neural networks', 'nlp', 'computer vision', 'data science', 'scikit', 'deep learning', 'keras', 'llm', 'genai'],
                strengths: ['Neural network architecture optimization', 'Complex mathematical modeling', 'Large-scale data preprocessing pipelines', 'Advanced Statistical Analysis'],
                missing: ['Model Quantization', 'MLOps (MLflow/Kubeflow)', 'Vector Databases (Pinecone/Chroma)', 'Hyperparameter Tuning', 'A/B Testing Models'],
                tip: 'AI/ML resumes need quantified model performance metrics. Mention specific accuracy, precision, or inference speed improvements.'
            },
            'Cyber Security Analyst': {
                keywords: ['security', 'penetration', 'firewall', 'encryption', 'vulnerability', 'soc', 'compliance', 'iso27001', 'siem', 'forensics', 'malware', 'threat'],
                strengths: ['Threat landscape analysis & mitigation', 'Security infrastructure orchestration', 'Incident response & digital forensics', 'Compliance & Risk Management'],
                missing: ['White-Box Pen Testing', 'Zero-Trust Architecture', 'Identity & Access Management (IAM)', 'DevSecOps Integration'],
                tip: 'Security ATS filters search for "Compliance" and "Certifications". Mention specific frameworks like NIST, SOC2, or GDPR.'
            },
            'Mobile Developer': {
                keywords: ['swift', 'kotlin', 'flutter', 'react native', 'ios', 'android', 'mobile', 'xcode', 'android studio', 'dart', 'object-c', 'mobile app'],
                strengths: ['Native/Cross-platform mobile optimization', 'App store publishing & CI/CD workflow', 'Mobile UI/UX consistency & performance', 'Offline data synchronization'],
                missing: ['Native Bridge Implementation', 'Deep Linking Strategies', 'Mobile Security (SSL Pinning)', 'Background Task Optimization'],
                tip: 'Mobile hiring managers look for "App Store Success". Mention user ratings or total download growth associated with your features.'
            },
            'DevOps / Cloud Architect': {
                keywords: ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'aws', 'cloud', 'azure', 'gcp', 'ansible', 'linux', 'yaml', 'bash', 'infrastructure'],
                strengths: ['Infrastructure as Code (IaC) implementation', 'Automation of deployment lifecycles', 'Cloud resource cost optimization', 'High Availability architecture'],
                missing: ['Kubernetes Operators', 'Service Mesh (Istio/Linkerd)', 'GitOps (ArgoCD/Flux)', 'Automated Rollback Systems'],
                tip: 'In DevOps, the word "Scale" is king. Describe how you managed clusters that handled X thousand concurrent requests.'
            },
            'General Professional': {
                keywords: ['experience', 'skills', 'project', 'education', 'team', 'communication', 'leadership', 'management', 'analysis', 'planning'],
                strengths: ['Clear professional structure', 'Demonstrated functional experience', 'Collaboration and team-oriented approach'],
                missing: ['Quantifiable Career Impact', 'Industry-Specific Certifications', 'Technical Tool Proficiency'],
                tip: 'Your resume seems broad. Tailor your keywords to potentially match a more specific role (Frontend, Backend, etc.) for better ATS scoring.'
            }
        };

        // Detect Domain
        let detectedRole = 'General Professional';
        let maxMatch = 0;

        console.log(`🔍 DEBUG: Validating PDF Extraction...`);
        console.log(`📄 TEXT PREVIEW: ${lowerText.substring(0, 150)}...`);

        // PRIORITY: User Selection Check
        // If user explicitly selected a role (and it's not "Auto-Detect"), force that role context
        const userSelectedRole = Object.keys(roleDefinitions).find(r =>
            jobRole && r.toLowerCase().includes(jobRole.toLowerCase())
        );

        if (userSelectedRole && jobRole !== 'Auto-Detect') {
            detectedRole = userSelectedRole;
            console.log(`🎯 ROLE SET BY USER: ${detectedRole}`);
        } else {
            // Fallback to Auto-Detection
            for (const [role, data] of Object.entries(roleDefinitions)) {
                const matchCount = data.keywords.filter(k => lowerText.includes(k)).length;
                if (matchCount > maxMatch) {
                    maxMatch = matchCount;
                    detectedRole = role;
                }
            }
            console.log(`🎯 DETECTED ROLE (AUTO): ${detectedRole} (Matches: ${maxMatch})`);
        }

        // Detect Seniority
        let seniority = 'Middle';
        if (lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('principal') || lowerText.includes('architect')) seniority = 'Senior';
        if (lowerText.includes('junior') || lowerText.includes('entry') || lowerText.includes('intern') || lowerText.includes('graduate')) seniority = 'Junior';

        // --- STEP 2: GENERATE REPORT WITH AI (OR EXPERT FALLBACK) ---
        let report;

        if (process.env.GEMINI_API_KEY) {
            try {
                const { GoogleGenerativeAI } = require("@google/generative-ai");
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                You are an elite ATS and Hiring Expert. Analyze the following resume text for the role of ${detectedRole}.
                
                RESUME TEXT:
                ${extractedText.substring(0, 10000)}

                STRICT RULES:
                1. NEVER use generic praise like "Professional formatting" or "Clear structure".
                2. Strengths and Improvements must be DIRECTLY tied to specific tools, projects, or metrics found in the text.
                3. DIFFERENTIATE between roles (Frontend vs Backend vs DevOps).
                4. Output MUST be in VALID JSON format.

                JSON Structure:
                {
                    "score": 0-100,
                    "recommendation": "One sentence verdict",
                    "strengths": ["Deep technical point 1", "Deep technical point 2", "..."],
                    "improvements": ["Specific technical gap 1", "Specific technical gap 2", "..."],
                    "missingSkills": ["Tool 1", "Tool 2", "..."],
                    "atsTip": "One high-value role-specific tip"
                }`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const aiText = response.text();

                // Extract JSON from potential markdown backticks
                const jsonMatch = aiText.match(/\{[\s\S]*\}/);
                const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : aiText);

                report = {
                    isResume: true,
                    score: aiData.score || 75,
                    recommendation: aiData.recommendation || "Good candidate; consider minor polishing.",
                    jobRole: `${seniority} ${detectedRole}`,
                    candidateEmail: email,
                    strengths: aiData.strengths.slice(0, 4),
                    improvements: aiData.improvements.slice(0, 4),
                    missingSkills: aiData.missingSkills.slice(0, 5),
                    atsTip: aiData.atsTip || "Focus on quantifying your engineering impact.",
                    timestamp: new Date().toISOString(),
                    engine: "Gemini AI"
                };

                console.log(`✨ AI Generation Successful for: ${email}`);
            } catch (aiError) {
                console.error('❌ Gemini AI Error, falling back to Expert Heuristics:', aiError.message);
                report = generateHeuristicReport(email, detectedRole, seniority, lowerText, textLength, roleDefinitions[detectedRole]);
            }
        } else {
            console.warn('⚠️  No GEMINI_API_KEY found. Using Expert Heuristics.');
            report = generateHeuristicReport(email, detectedRole, seniority, lowerText, textLength, roleDefinitions[detectedRole]);
        }

        await sendEmailReport(email, report);

        res.status(200).json({
            success: true,
            message: 'Analysis complete. Report sent to your email.',
            data: report
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error during analysis', details: error.message });
    }
};

// --- HELPER: EXPERT HEURISTIC ENGINE (FALLBACK) ---
function generateHeuristicReport(email, detectedRole, seniority, lowerText, textLength, roleData) {
    const strengths = [];
    const improvements = [];

    // --- 1. STACK DETECTION ---
    const stacks = {
        'Node.js': ['node', 'javascript', 'typescript', 'express', 'nest', 'react'],
        'Java': ['java', 'spring', 'hibernate', 'maven', 'gradle', 'junit'],
        'Python': ['python', 'django', 'flask', 'fastapi', 'pandas'],
        'Go': ['golang', 'go', 'gin', 'echo'],
        'C#/.NET': ['c#', '.net', 'asp.net', 'entity framework']
    };

    let primaryStack = 'General';
    let maxStackCount = 0;

    Object.entries(stacks).forEach(([stackName, keywords]) => {
        const count = keywords.filter(k => lowerText.includes(k)).length;
        if (count > maxStackCount) {
            maxStackCount = count;
            primaryStack = stackName;
        }
    });

    // --- 2. DYNAMIC STRENGTHS (Role-Contextualized) ---
    const techSkillsFound = roleData.keywords.filter(k => lowerText.includes(k));

    // Feature: If tech match is low for the requested role, generic strengths won't save you.
    if (techSkillsFound.length > 0) {
        const skillsStr = techSkillsFound.slice(0, 3).join(', ');
        strengths.push(`Verified proficiency in ${skillsStr}, aligning with ${detectedRole} requirements.`);
    }

    // Contextual Interpretation of "Performance"
    if (lowerText.includes('performance') || lowerText.includes('optimize') || lowerText.includes('scale')) {
        if (detectedRole.includes('Frontend') || detectedRole.includes('Mobile')) {
            strengths.push(`Focus on User-Centric Performance (Core Web Vitals/Frame Rates) detected.`);
        } else if (detectedRole.includes('Backend') || detectedRole.includes('System')) {
            strengths.push(`Evidence of Server-Side Optimization (Throughput/Latency reduction).`);
        } else {
            strengths.push(`Proven methodology for technical process optimization.`);
        }
    }

    // Contextual Interpretation of "Testing"
    if (lowerText.includes('test') || lowerText.includes('jest') || lowerText.includes('cypress') || lowerText.includes('junit')) {
        if (detectedRole.includes('Frontend')) {
            strengths.push(`Commitment to UI Stability via Component/E2E testing.`);
        } else {
            strengths.push(`Reliability engineering mindset verified through automated test coverage.`);
        }
    }

    if (lowerText.includes('lead') || lowerText.includes('managed')) {
        strengths.push(`Demonstrated engineering leadership and project ownership.`);
    }

    // --- 3. CRITICAL GAPS & IMPROVEMENTS ---
    // Strict Penalties for Role Mismatch
    const matchRatio = techSkillsFound.length / roleData.keywords.length;

    // If < 15% of role keywords are found, it's a critical mismatch
    if (matchRatio < 0.15 && techSkillsFound.length < 2) {
        improvements.push(`CRITICAL: Your resume has very low alignment with **${detectedRole}**. Highlight more role-specific tools (e.g., ${roleData.keywords.slice(0, 2).join(', ')}).`);
    }

    // Context-Sensitive Improvements
    if (detectedRole.includes('Backend') && !lowerText.includes('database') && !lowerText.includes('sql') && !lowerText.includes('mongo')) {
        improvements.push(`Backend resumes require visible Database expertise. Add logical schema design or query tuning details.`);
    }

    if (detectedRole.includes('Frontend') && !lowerText.includes('responsive') && !lowerText.includes('mobile')) {
        improvements.push(`Explicitly mention 'Responsive Design' or 'Mobile-First' approaches, which are mandatory for Frontend checks.`);
    }

    // Generic Metric Gap
    if (!lowerText.includes('%') && !lowerText.includes('improved') && !lowerText.includes('reduced')) {
        improvements.push(`Quantify your impact. Instead of "Fixed bugs", say "Reduced crash rate by 15%".`);
    }

    // --- 4. MISSING SKILLS CALCULATION ---
    let relevantKeywords = roleData.keywords;

    // Smart Stack Filtering (only for Backend/Fullstack)
    if (detectedRole.includes('Backend') || detectedRole.includes('Fullstack')) {
        const ecosystemMap = {
            'Node.js': ['express', 'nest.js', 'typescript', 'mocha', 'jest', 'mongodb', 'postgresql'],
            'Java': ['spring boot', 'hibernate', 'kafka', 'junit', 'postgresql', 'oracle'],
            'Python': ['django', 'fastapi', 'flask', 'celery', 'pytest', 'postgresql'],
            'General': ['docker', 'redis', 'graphql', 'aws', 'ci/cd', 'sql']
        };
        const stackTools = ecosystemMap[primaryStack] || [];
        // If specific stack detected, prioritize those tools + standard general ones
        if (primaryStack !== 'General') {
            relevantKeywords = [...stackTools, ...ecosystemMap['General']];
        }
    }

    // Calculate Delta (What is missing?)
    const missingExpertise = relevantKeywords
        .filter(skill => !lowerText.includes(skill.toLowerCase()) && !lowerText.includes(skill.replace('.', '').toLowerCase()))
        .map(k => k.charAt(0).toUpperCase() + k.slice(1))
        .slice(0, 5);

    // --- 5. DYNAMIC TIP ---
    let dynamicTip = roleData.tip;
    if (missingExpertise.length > 0) {
        const topMissing = missingExpertise[0];
        const tipMap = {
            'Docker': 'Containerization is non-negotiable for modern roles. Add "Docker" to your Skills section.',
            'Redis': 'High-scale backends need Caching. Mention "Redis" or "Memcached" to boost your system design credibility.',
            'Typescript': 'Standardize on TypeScript. It shows you care about type safety and scalability.',
            'Aws': 'Cloud familiarity is expected. Mentioning "AWS Lambda" or "S3" significantly boosts ATS scoring.',
            'Kubernetes': 'For senior roles, "Kubernetes" orchestration experience is a major keyword hook.',
            'Spring': 'In the Java world, "Spring Boot" is the standard. Make sure it is prominent.',
            'React': 'React is the dominant view library. Ensure "React" or "Hooks" are explicitly listed.'
        };
        const matchedKey = Object.keys(tipMap).find(k => topMissing.toLowerCase().includes(k.toLowerCase()));
        if (matchedKey) dynamicTip = `Expert Tip: ${tipMap[matchedKey]}`;
    }

    // --- 6. SCORING ---
    // Base 40 + (7 points per matched keyword) + (Seniority Bonus) - (Missing Criticals)
    let calculatedScore = 40 + (techSkillsFound.length * 7);
    if (seniority === 'Senior') calculatedScore += 5;
    if (missingExpertise.length > 5) calculatedScore -= 10;

    const score = Math.min(Math.max(calculatedScore, 30), 98);

    // Final Object
    return {
        isResume: true,
        score,
        recommendation: score >= 85 ? "Excellent candidate; strong alignment." :
            score >= 65 ? "Good potential; some technical gaps detected." :
                "Low alignment; significant tailoring required for this role.",
        jobRole: `${seniority} ${detectedRole} (${primaryStack === 'General' ? '' : primaryStack})`,
        candidateEmail: email,
        strengths: strengths.length > 0 ? strengths.slice(0, 4) : ["Resume is well-structured but lacks specific technical keywords for this role."],
        improvements: improvements.length > 0 ? improvements.slice(0, 4) : ["Add more specific projects related to the target role."],
        missingSkills: Array.from(new Set(missingExpertise)).slice(0, 5),
        atsTip: dynamicTip,
        timestamp: new Date().toISOString(),
        engine: "Role-Specific Expert Heuristics"
    };
}

async function sendEmailReport(email, report) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  EMAIL FAILED: Credentials missing in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Resume Lens AI Reports" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[Resume Lens] Your Analysis Report for ${report.jobRole}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #f8faff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background-color: #6d93fb; padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 32px; letter-spacing: -1px;">Resume Analysis Report</h1>
                    <p style="opacity: 0.9; margin-top: 10px; font-size: 18px;">Target Role: ${report.jobRole}</p>
                </div>
                
                <div style="padding: 30px; background-color: white;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="display: inline-block; padding: 30px; background-color: #f0f7ff; border-radius: 50%; border: 6px solid #6d93fb;">
                            <span style="font-size: 64px; font-weight: 800; color: #1e293b;">${report.score}</span>
                            <span style="font-size: 20px; color: #64748b;">/100</span>
                        </div>
                        <h2 style="color: #1e293b; margin-top: 20px; font-size: 24px;">Quality Score</h2>
                        <p style="color: #6d93fb; font-weight: 700;">${report.recommendation}</p>
                    </div>

                    <div style="margin-bottom: 35px;">
                        <h3 style="color: #1e293b; border-bottom: 2px solid #f0f7ff; padding-bottom: 10px;">🌟 Resume Strengths</h3>
                        <ul style="padding-left: 0; list-style: none;">
                            ${report.strengths.map(item => `
                                <li style="padding: 10px 0; border-bottom: 1px solid #f8fafc; display: flex; align-items: flex-start;">
                                    <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✔</span>
                                    <span style="color: #334155;">${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div style="margin-bottom: 35px;">
                        <h3 style="color: #1e293b; border-bottom: 2px solid #f0f7ff; padding-bottom: 10px;">✍️ Improvement Suggestions</h3>
                        <ul style="padding-left: 0; list-style: none;">
                            ${report.improvements.map(item => `
                                <li style="padding: 10px 0; border-bottom: 1px solid #f8fafc; display: flex; align-items: flex-start;">
                                    <span style="color: #f59e0b; margin-right: 12px; font-size: 18px;">✎</span>
                                    <span style="color: #334155;">${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div style="margin-bottom: 35px;">
                        <h3 style="color: #1e293b; border-bottom: 2px solid #f0f7ff; padding-bottom: 10px;">🚩 Missing Skills / Sections</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px;">
                            ${report.missingSkills.map(skill => `
                                <span style="background-color: #fee2e2; color: #b91c1c; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">${skill}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div style="background-color: #f0f7ff; padding: 25px; border-radius: 12px; border-left: 5px solid #6d93fb;">
                        <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">ATS Friendly Tip</h4>
                        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                            ${report.atsTip}
                        </p>
                    </div>
                </div>

                <div style="padding: 25px; text-align: center; background-color: #f8faff; color: #94a3b8; font-size: 13px;">
                    <p style="margin-bottom: 5px;">Report generated on ${new Date().toLocaleDateString()}</p>
                    <p>© 2026 Resume Lens AI. All rights reserved.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}
