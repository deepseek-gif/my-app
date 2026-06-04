const express = require('express');
const router = express.Router();
const {
  getAllFoods,
  getRandomFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  toggleFavorite,
  getFavorites
} = require('../controllers/foodController');

router.route('/')
  .get(getAllFoods)
  .post(createFood);

router.get('/random', getRandomFood);
router.get('/favorites', getFavorites);

router.route('/:id')
  .get(getFoodById)
  .put(updateFood)
  .delete(deleteFood);

router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
