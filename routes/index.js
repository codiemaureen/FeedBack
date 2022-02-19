const express = require('express');
const storeController = require('../controllers/storeController')
const router = express.Router();
const {catchErrors} = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
