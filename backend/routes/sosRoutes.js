const express = require('express');
const router = express.Router();
const { receiveSOS } = require('../controllers/sosController');

router.post('/', receiveSOS);

module.exports = router;
