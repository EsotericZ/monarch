let express = require('express');
let router = express.Router();

const vtigerController = require('../../controllers/vtigerController');

router.get('/getAllCustomers', vtigerController.getAllCustomers);

module.exports = router;