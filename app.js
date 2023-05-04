const express = require('express');
const mongoose = require('mongoose');

const app = express();
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const router = require('./routes/routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mestodb ', {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '645125dee106554445f170ca',
  };

  next();
});

app.use('/', router);
app.use((req, res) => {
  res.status(404).send({ message: "Sorry can't find that!"})
});
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
