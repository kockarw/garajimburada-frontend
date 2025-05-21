const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = require('./database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.url, {
  ...config,
  define: {
    timestamps: true,
    underscored: true
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Run the test connection
testConnection();

module.exports = { sequelize, Sequelize }; 