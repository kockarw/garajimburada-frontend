require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const garageRoutes = require('./routes/garage.routes');
const reviewRoutes = require('./routes/review.routes');
const uploadRoutes = require('./routes/upload.routes');
const appointmentRoutes = require('./routes/appointment.routes');

// Environment variables (would normally use dotenv)
const PORT = process.env.PORT || 5000;

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GarajımBurada API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Sync database and start server
const startServer = async () => {
  try {
    // In development mode, we might want to sync the database
    // In production, you would use migrations instead
    if (process.env.NODE_ENV === 'development') {
      // force: false - mevcut tabloları değiştirmez, sadece yeni tabloları oluşturur
      // alter: false - var olan tablolarda değişiklik yapmaz
      await sequelize.sync({ force: false, alter: false });
      console.log('Database synchronized');
    } else {
      // Just authenticate in production
      await sequelize.authenticate();
    }
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer(); 