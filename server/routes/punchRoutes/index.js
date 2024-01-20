let express = require('express');
let router = express.Router();

const punchController = require('../../controllers/punchController');

router.get('/getAllJobs', punchController.getAllJobs);
router.get('/getTBRJobs', punchController.getTBRJobs);
router.get('/getFRJobs', punchController.getFRJobs);

module.exports = router;