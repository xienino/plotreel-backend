const express = require('express');
const router = express.Router();
const upgradeController = require('../controllers/upgrade.controller');

// POST /pnt/api/upgrade/last
router.post('/last', upgradeController.checkLast);

module.exports = router;