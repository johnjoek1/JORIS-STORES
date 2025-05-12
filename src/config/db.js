

const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected');
    console.log('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;






















/** 
const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
**/