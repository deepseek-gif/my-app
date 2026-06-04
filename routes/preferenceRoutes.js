const express = require('express');
const router = express.Router();
const {
  getPreference,
  updatePreference
} = require('../controllers/preferenceController');

router.route('/:userId')
  .get(getPreference)
  .put(updatePreference);

module.exports = router;
