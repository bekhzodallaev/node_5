const express = require('express');
const { register, login } = require('./controllers/authController');
const app = express();
const PORT = 3000;

app.use(express.json());

// app.post('/users', async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     const user = { name: req.body.name, password: hashedPassword };
//     users.push(user);
//     res.status(201).send(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: 'Error occured' });
//   }
// });

// app.post('/users/login', async (req, res) => {
//   const user = users.find((user) => user.name == req.body.name);
//   if (user == null) {
//     return res.status(400).send({ message: 'Cannot find the user' });
//   }
//   try {
//     if (await bcrypt.compare(req.body.password, user.password)) {
//       res.send({ message: 'Success' });
//     } else {
//       res.send({ message: 'Not Allowed' });
//     }
//   } catch (error) {
//     res.status(500).send();
//   }
// });

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error occured', err);
  }

  console.log('Server Listening on PORT :', PORT);
});
