// routes/service.route.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middlware');
const serviceController = require('../controllers/service.controller');

// Public: Anyone logged in can view services
router.get('/api/services', authMiddleware.verifyToken, serviceController.getServices);
router.get('/api/service/:id', serviceController.getService);
// Admin only: Create and delete
router.post('/api/service', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.createService);
router.put('/api/service/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.updateService);
router.delete('/api/service/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.deleteService);

module.exports = router;