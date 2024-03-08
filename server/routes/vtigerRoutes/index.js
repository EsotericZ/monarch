let express = require('express');
let router = express.Router();

const vtigerController = require('../../controllers/vtigerController');

router.get('/getAllCustomers', vtigerController.getAllCustomers);
router.post('/getOneCustomer', vtigerController.getOneCustomer);

module.exports = router;