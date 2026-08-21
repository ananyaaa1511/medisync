const express = require('express');
const router = express.Router();
const { checkSymptoms, getHealthTip, analyzeSymptoms } = require('../controllers/symptomcontroller');
const protect = require('../middleware/authMiddleware');

// AI Symptom Checker
router.post('/check', protect, checkSymptoms);

// AI Health Tips
router.post('/tips', protect, getHealthTip);

// AI Symptom Analyzer
router.post('/analyze', protect, analyzeSymptoms);

module.exports = router;