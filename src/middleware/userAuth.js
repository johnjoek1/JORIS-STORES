

const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = async (req) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token:', token);
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.log('Auth Error:', error.message);
    throw error; // Throw error for Apollo context to handle
  }
};













































/**

const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token:', token);
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth Error:', error.message);
    res.status(401).send({ error: 'Please authenticate' });
  }
};

**/






































/** 

const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token:', token);
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth Error:', error.message);
    res.status(401).send({ error: 'Please authenticate' });
  }
};

**/ 






































/** 
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};
**/






























/**

const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};
**/