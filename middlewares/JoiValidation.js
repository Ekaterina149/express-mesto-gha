const { celebrate, Joi } = require('celebrate');
const { linkPattern } =require('../utils/constants');


const createUserJoi = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkPattern),
  }).unknown(true),
});

const updateAvatarJoi = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkPattern),
  }),
});

const createCardJoi = celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(linkPattern),
  }).unknown(true),
});

const checkCardIdJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

const getUserByIdJoi = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});



module.exports = {

  createUserJoi,
  updateAvatarJoi,
  getUserByIdJoi,
  createCardJoi,
  checkCardIdJoi,

};