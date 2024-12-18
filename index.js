const express = require('express');
const { authMiddleware, checkRole } = require('./middlewares/authenticate');
const { register, login } = require('./controllers/authController');
const { readAll } = require('./routes/films-readall');
const { createFilms } = require('./routes/films-create');
const { updateFilm } = require('./routes/films-update');
const { deleteFilm } = require('./routes/films-delete');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  if (!req.path.startsWith('/api/auth/')) {
    return authMiddleware(req, res, next);
  }
  next();
});
//REGISTER/LOGIN
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

///OPERATIONS - FILMS
app.get('/api/films/readall', authMiddleware, checkRole(false), readAll);
app.post('/api/films/create', authMiddleware, checkRole(true), createFilms);
app.put('/api/films/update', authMiddleware, checkRole(true), updateFilm);
app.delete('/api/films/delete', authMiddleware, checkRole(true), deleteFilm);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error occured', err);
  }

  console.log('Server Listening on PORT :', PORT);
});
