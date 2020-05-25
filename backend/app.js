const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const PORT = 5000;
const app = express();

app.use('/api/places', placesRoutes);
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
