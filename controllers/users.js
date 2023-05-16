const httpConstants = require('http2').constants;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = httpConstants;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if(password.length >= 8)
  {
    bcrypt.hash(password, 12)
    .then((hash)=>User.create({ name, about, avatar, email, password: hash } ))
    .then((user) => res.send(user))
    .catch((err) => {
        // console.log(err);
        if (err.name === 'ValidationError') {
          console.log(err);
          const { email, name, about, password } =  err.errors;
          const errArray = [email, name, about, password];
          const messages = errArray.filter(element => element).map((element, index) => ({ message: `№${index + 1}: ${element.message}` }));

          return res.status(HTTP_STATUS_BAD_REQUEST).send( messages.length ? {...messages}  : { message: "Переданы некорректные  данные пользователя" });
        }

        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      })

  }
  else {
     return res.status(400).send({ message: "Пароль не соответсвует валидации" });
  }

};
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const {email, password} = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          console.log(token);
          res.cookie('jwt', token, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней в миллисекундах
          });

          return res.send({ message: 'Авторизация прошла успешно', });
        })
        })
        .catch((err) => {
          res
            .status(401)
            .send({ message: err.message });
        })

    };


