const express = require('express');
const { authMiddleware, checkRole } = require('./middlewares/authenticate');
const { register, login } = require('./controllers/authController');
const {
  addManager,
  findByEmail,
  findById,
  getAllManagers,
  clearManagers,
} = require('./models/managerModel');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  if (!req.path.startsWith('/api/auth/')) {
    return authMiddleware(req, res, next);
  }
  next();
});

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.get('/api/managers', authMiddleware, checkRole('user'), (req, res) => {
  try {
    const managers = getAllManagers();
    res.json(managers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching managers' });
  }
});

app.post(
  '/api/managers',
  authMiddleware,
  checkRole('superuser'),
  async (req, res) => {
    const { email, password, isSuper } = req.body;
    try {
      const newManager = await addManager(email, password, isSuper || false);
      res.status(201).json(newManager);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
app.delete(
  '/api/managers',
  authMiddleware,
  checkRole('superuser'),
  (req, res) => {
    clearManagers();
    res.status(200).json({ message: 'All managers cleared' });
  }
);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error occured', err);
  }

  console.log('Server Listening on PORT :', PORT);
});
