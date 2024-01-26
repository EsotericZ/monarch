let express = require('express');
let router = express.Router();

const jobbossController = require('../../controllers/jobbossController');

router.get('/:jobno', jobbossController.getTest);

module.exports = router;