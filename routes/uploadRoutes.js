const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');

// File upload route
router.post('/upload', uploadFile);
// router.get('/download/:code', downloadFile);

module.exports = router; 