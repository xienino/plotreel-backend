const express = require('express');
const router = express.Router();
const aihostController = require('../controllers/aihost.controller');

// POST /videomaker/aihost/getMtk
router.post('/getMtk', aihostController.getMtk);

module.exports = router;