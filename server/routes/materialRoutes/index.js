let express = require('express');
let router = express.Router();

const materialController = require('../../controllers/materialController');

router.post('/createMaterial', materialController.createMaterial);

module.exports = router;