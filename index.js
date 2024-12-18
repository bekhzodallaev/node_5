const express = require('express');
const authMiddleware = require('./middlewares/authenticate');
const { register, login } = require('./controllers/authController');
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

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error occured', err);
  }

  console.log('Server Listening on PORT :', PORT);
});
