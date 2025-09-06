// routes/vehicle.route.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middlware');
const vehicleController = require('../controllers/vehicle.controller');

router.post('/api/vehicle', authMiddleware.verifyToken, vehicleController.createVehicle);
router.get('/api/vehicles/:customerId', authMiddleware.verifyToken, vehicleController.getVehicles);

module.exports = router;