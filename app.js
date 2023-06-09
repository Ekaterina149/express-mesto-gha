const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const { createUserJoi, loginUserJoi } = require('./middlewares/JoiValidation');
const authMiddleware = require('./middlewares/auth');

const app = express();
// eslint-disable-next-line import/no-extraneous-dependencies
const routerUsers = require('./routes/routesUsers');
const routerCards = require('./routes/routesCards');
const { handleErrors } = require('./middlewares/handleErrors');
const NotFoundError = require('./errors/notFoundError');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1/mestodb ', {
  useNewUrlParser: true,
});
app.post('/signin', loginUserJoi, login);
app.post('/signup', createUserJoi, createUser);
app.use(authMiddleware);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);

// eslint-disable-next-line no-unused-vars
app.use((req, res) => {
  throw new NotFoundError("Sorry can't find that!");
});
app.use(errors({ message: 'Ошибка валидации Joi!' }));
app.use(handleErrors);
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
