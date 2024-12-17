const managerModel = require('../models/managerModel');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newManager = await managerModel.addManager(email, password, false);
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
    
}
module.exports = {
  register,
};
