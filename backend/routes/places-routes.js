const express = require('express');
const placesController = require('../controllers/places-controllers');
const router = express.Router();

router.post('/', placesController.createPlace);

router.get('/:placeId', placesController.getPlaceById);
router.patch('/:placeId', placesController.updatePlace);
router.delete('/:placeId', placesController.deletePlace);

router.get('/user/:userId', placesController.getPlacesByUserId);

module.exports = router;
