const express = require('express');
const bodyParser = require('body-parser');
const PORT = 5000;

const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-errors');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    // console.log('Header Set');
    return next(error);
  }
  // console.log('Header NOT Set');
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred' });
});

app.listen(PORT, () => {});
