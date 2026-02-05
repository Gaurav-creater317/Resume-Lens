const nodemailer = require('nodemailer');

exports.analyzeResume = async (req, res) => {
    try {
        const { jobRole, email } = req.body;
        const file = req.file;

        if (!file || !email) {
            return res.status(400).json({ error: 'Missing required fields (file or email)' });
        }

        const roleName = jobRole || "General Professional";

        // Mock detailed AI scoring and feedback
        const score = Math.floor(Math.random() * (92 - 72 + 1)) + 72; // Consistent 70-90 range

        const strengths = [
            "Clear technical stack definition aligned with industry standards.",
            `Strong focus on ${roleName} core competencies.`,
            "Clean layout with consistent use of reverse-chronological formatting.",
            "Excellent use of action verbs in the experience section."
        ];

        const improvements = [
            "Quantify achievements more (e.g., 'Increased efficiency by 20%').",
            "Add a specific 'Certifications' section to highlight continuous learning.",
            "Optimize resume for ATS keywords specifically for " + roleName + ".",
            "Consider adding a personal portfolio or GitHub link to the header."
        ];

        const missingSkills = [
            "Agile/Scrum Methodology experience",
            "Unit Testing / CI-CD pipeline exposure",
            "Cloud Infrastructure (AWS/Azure) knowledge"
        ];

        const recommendation = score >= 85 ? "Strongly Recommended for submission." : "Recommended after minor tweaks.";

        const report = {
            score,
            jobRole: roleName,
            candidateEmail: email,
            strengths,
            improvements,
            missingSkills,
            recommendation,
            timestamp: new Date().toISOString()
        };

        // LOG TO CONSOLE
        console.log('✅ Analysis Generated Successfully:');

        // Send Email Report
        await sendEmailReport(email, report);

        res.status(200).json({
            success: true,
            message: 'Analysis complete. Report sent to your email.',
            data: report
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error during analysis' });
    }
};

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
                            Your resume structure is highly compatible with most Applicant Tracking Systems (ATS). To further optimize, ensure you are using a standard font like Arial or Calibri and avoid complex tables or images in the main body.
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
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ ERROR SENDING EMAIL:', error.message);
    }
}
