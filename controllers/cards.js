const httpConstants = require('http2').constants;
const Card = require('../models/card');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK,
} = httpConstants;
module.exports.getCards = (req, res) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (String(card.owner) !== String(req.user._id)) {
        throw new Error('Недостаточно прав для удаления');
      }
      card.deleteOne();
      res.status(HTTP_STATUS_OK).send(card)

    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки' });
      }
      if(err.name === 'Error') {
        return res.status(403).send({ message: err.message  });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при постановке лайка' });
      }

      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении лайка' });
    }

    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });
