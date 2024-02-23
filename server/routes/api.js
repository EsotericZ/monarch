let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const flaserRoutes = require('./flaserRoutes');
const formingRoutes = require('./formingRoutes');
const jobbossRoutes = require('./jobbossRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const materialRoutes = require('./materialRoutes');
const portalRoutes = require('./portalRoutes');
const punchRoutes = require('./punchRoutes');
const qualityRoutes = require('./qualityRoutes');
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
router.use('/jobboss', jobbossRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/material', materialRoutes);
router.use('/portal', portalRoutes);
router.use('/punch', punchRoutes);
router.use('/quality', qualityRoutes);
router.use('/saw', sawRoutes);
router.use('/scales', scalesRoutes);
router.use('/shear', shearRoutes);
router.use('/shipping', shippingRoutes);
router.use('/slaser', slaserRoutes);
router.use('/tlaser', tlaserRoutes);
router.use('/todo', todoRoutes);
router.use('/users', userRoutes);

module.exports = router;