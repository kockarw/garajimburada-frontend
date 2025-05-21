const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { uploadSingle, uploadMultiple } = require('../middleware/upload.middleware');

/**
 * Upload single image
 */
router.post('/image', authenticate, uploadSingle('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.status(200).json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      url: req.file.url
    }
  });
});

/**
 * Upload multiple images (max 5)
 */
router.post('/images', authenticate, uploadMultiple('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  
  res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files.map(file => ({
      filename: file.filename,
      url: file.url
    }))
  });
});

module.exports = router; 