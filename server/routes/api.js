let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const flaserRoutes = require('./flaserRoutes');
const formingRoutes = require('./formingRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const portalRoutes = require('./portalRoutes');
const punchRoutes = require('./punchRoutes');
const sawRoutes = require('./sawRoutes');
const scalesRoutes = require('./scalesRoutes');
const shearRoutes = require('./shearRoutes');
const shippingRoutes = require('./shippingRoutes');
const slaserRoutes = require('./slaserRoutes');
const tlaserRoutes = require('./tlaserRoutes');
const todoRoutes = require('./todoRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);
router.use('/flaser', flaserRoutes);
router.use('/forming', formingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/portal', portalRoutes);
router.use('/punch', punchRoutes);
router.use('/saw', sawRoutes);
router.use('/scales', scalesRoutes);
router.use('/shear', shearRoutes);
router.use('/shipping', shippingRoutes);
router.use('/slaser', slaserRoutes);
router.use('/tlaser', tlaserRoutes);
router.use('/todo', todoRoutes);
router.use('/users', userRoutes);

module.exports = router;