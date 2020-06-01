const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
// const PORT = 5000;

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-errors');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // '*' gives all domains access. changing to localhost:3000 is more secure
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      // console.log(err);
    });
  }
  if (res.headerSent) {
    // console.log('Header Set');
    return next(error);
  }
  // console.log('Header NOT Set');
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred' });
});

mongoose
  .connect(process.env.MONGODB_ADDR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to database - Running on Port: 5000');
    });
  })
  .catch((err) => {
    return console.log('Connection failed');
  });
