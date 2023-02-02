let express = require('express');
let router = express.Router();

const engineeringController = require('../../controllers/engineeringController');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.get("/engineering/getAllJobs", engineeringController.getAllJobs);

module.exports = router;