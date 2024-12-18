require('dotenv').config();

const managerModel = require('../models/managerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password, super: isSuper } = req.body;

  try {
    const newManager = await managerModel.addManager(email, password, isSuper);

    res.status(201).json({
      message: 'User registered succcessfully',
      manager: { id: newManager.id, email: newManager.email },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const manager = await managerModel.findByEmail(email);
    if (!manager || !(await bcrypt.compare(password, manager.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: manager.id, email: manager.email, super: manager.super },
      process.env.JWT_TOKEN,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
};
