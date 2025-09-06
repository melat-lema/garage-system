const express = require('express');
const router = express.Router();
const installRouter= require('./install.routes');
const employeeRouter = require('./employee.routes');
const loginRouter = require('./login.routes');
const customerRouter = require('./customer.routes');
const vehicleRouter=(require('./vehicles.routes'));
const serviceRouter = require('./service.routes');
const orderRouter = require('./order.routes');
router.use(customerRouter);
router.use(installRouter);
router.use(employeeRouter);
router.use(loginRouter);
router.use(vehicleRouter);
router.use(serviceRouter);
router.use(orderRouter);

module.exports = router;