const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../controllers/uploadController');

// File upload route
router.post('/upload-pdf', uploadPdf);
// router.get('/download/:code', downloadFile);

module.exports = router; 