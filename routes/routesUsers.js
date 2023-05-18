const routerUsers = require('express').Router();

// const Card = require('../models/user');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser
} = require('../controllers/users');

const { getUserByIdJoi, updateAvatarJoi } = require('../middlewares/JoiValidation');


routerUsers.get('/me', getCurrentUser);
routerUsers.get('/:userId', getUserByIdJoi, getUser);
routerUsers.get('', getUsers);
routerUsers.patch('/me', updateUser);
routerUsers.patch('/me/avatar', updateAvatarJoi, updateAvatar);



module.exports = routerUsers;
