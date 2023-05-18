const httpConstants = require('http2').constants;
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { HTTP_STATUS_NOT_FOUND } = httpConstants;
const { createUser, login } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');


const app = express();
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routerUsers = require('./routes/routesUsers');
const routerCards = require('./routes/routesCards');
const { handleErrors } = require('./middlewares/handleErrors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1/mestodb ', {
  useNewUrlParser: true,
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(authMiddleware);
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use((req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Sorry can't find that!" });
});
app.use(errors({ message: 'Ошибка валидации Joi!' }));
app.use(handleErrors);
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
