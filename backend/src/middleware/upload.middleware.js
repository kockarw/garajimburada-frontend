const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and WebP image files are allowed'), false);
  }
};

// Create upload middleware
const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5000000 // 5MB default
  },
  fileFilter: fileFilter
});

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const upload = uploadMiddleware.single(fieldName);
    
    upload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File size too large. Maximum size is 5MB'
          });
        }
        return res.status(400).json({ message: err.message });
      }
      
      // If a file was uploaded, add the URL to the request
      if (req.file) {
        req.file.url = `/uploads/${req.file.filename}`;
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const upload = uploadMiddleware.array(fieldName, maxCount);
    
    upload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File size too large. Maximum size is 5MB'
          });
        }
        return res.status(400).json({ message: err.message });
      }
      
      // If files were uploaded, add URLs to the request
      if (req.files) {
        req.files.forEach(file => {
          file.url = `/uploads/${file.filename}`;
        });
      }
      
      next();
    });
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple
}; 