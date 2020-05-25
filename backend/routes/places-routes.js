const express = require('express');
const placesController = require('../controllers/places-controllers');
const router = express.Router();

router.get('/:placeId', placesController.getPlaceById);

router.get('/user/:userId');

module.exports = router;
