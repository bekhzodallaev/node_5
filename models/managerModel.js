const bcrypt = require('bcrypt');
const {
  writeManagersFile,
  readManagersFile,
} = require('../utils/fileOperations');

let Managers = require('../managers.json');
const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

const addManager = async (email, plainPassword, isSuper = false) => {
  if (Managers.find((manager) => manager.email === email)) {
    throw new Error('Email already exits');
  }
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const newManager = {
    id: generateId(),
    email,
    password: hashedPassword,
    super: isSuper,
  };
  Managers.push(newManager);
  await writeManagersFile(Managers);

  return newManager;
};

const findByEmail = (email) => {
  return Managers.find((manager) => manager.email === email);
};

const findById = (id) => {
  return Managers.find((manager) => manager.id === id);
};
const getAllManagers = () => {
  return Managers;
};
const clearManagers = () => {
  Managers = [];
};

module.exports = {
  addManager,
  findByEmail,
  findById,
  getAllManagers,
  clearManagers,
};