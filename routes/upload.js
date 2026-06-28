const express = require('express');
const { upload, uploadImage } = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Wrap multer in error handling middleware
router.post('/image', auth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'File upload failed: ' + err.message });
    }
    next();
  });
}, uploadImage);

module.exports = router;
