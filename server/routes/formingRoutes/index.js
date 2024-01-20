let express = require('express');
let router = express.Router();

const formingController = require('../../controllers/formingController');

router.post('/updateJob', formingController.updateJob);

module.exports = router;