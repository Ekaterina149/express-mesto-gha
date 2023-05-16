const routerUsers = require('express').Router();

// const Card = require('../models/user');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUsers.get('/:userId', getUser);
routerUsers.get('', getUsers);
// routerUsers.post('', createUser);
routerUsers.patch('/me', updateUser);
routerUsers.patch('/me/avatar', updateAvatar);

module.exports = routerUsers;
