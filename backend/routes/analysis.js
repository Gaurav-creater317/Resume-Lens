const express = require('express');
const router = express.Router();
const multer = require('multer');
const analysisController = require('../controllers/analysisController');

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('resume'), analysisController.analyzeResume);

module.exports = router;
