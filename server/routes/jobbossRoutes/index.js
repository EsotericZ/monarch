let express = require('express');
let router = express.Router();

const jobbossController = require('../../controllers/jobbossController');

router.get('/', jobbossController.getTest);

module.exports = router;