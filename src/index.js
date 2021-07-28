const express = require('express');
const config = require('./config/config');
const { signup, signin, protect } = require('./controllers/auth.controller');
const userRouter = require('./routes/user.route');
const connect = require('./utils/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', signup);
app.post('/signin', signin);

app.use(protect);

app.use('/users', userRouter);

const start = async () => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
