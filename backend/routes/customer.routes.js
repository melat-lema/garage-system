const express= require('express');
const router =express.Router();
const authMiddleware = require('../middlewares/auth.middlware');
const customerController = require('../controllers/customer.controller');
router.post('/api/customer', customerController.createCustomer);
router.get('/api/customers', customerController.getCustomers);
router.put('/api/customer/:id', customerController.updateCustomer);
module.exports = router;