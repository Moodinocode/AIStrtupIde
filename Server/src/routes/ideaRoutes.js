const express = require('express');
const router = express.Router();
const { evaluateIdea } = require('../controllers/ideaController');

// POST /api/evaluate-idea
router.post('/evaluate-idea', evaluateIdea);

module.exports = router; 