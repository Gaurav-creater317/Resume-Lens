const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analysis', analysisRoutes);

app.get('/', (req, res) => {
    res.send('Resume Lens API is running');
});

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('----------------------------------------------------');
        console.error('❌ EMAIL SYSTEM ERROR:');
        console.log(error);
        console.log('----------------------------------------------------');
    } else {
        console.log('✅ Email system is ready to send reports');
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Global server error', details: err.message });
});
