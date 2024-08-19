let express = require('express');
let router = express.Router();

const efficiencyController = require('../../controllers/efficiencyController');

router.get('/getSingleJob', efficiencyController.getSingleJob);
router.get('/getJobRange', efficiencyController.getJobRange);
// router.post('/getSingleJob', efficiencyController.getSingleJob);
// router.post('/getJobRange', efficiencyController.getJobRange);

module.exports = router;