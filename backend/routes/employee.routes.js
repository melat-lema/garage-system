const express= require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middlware');
const employeeController = require('../controllers/employee.controller');
router.post('/api/employee',[authMiddleware.verifyToken,authMiddleware.isAdmin], employeeController.createEmployee);
router.get('/api/employees', employeeController.getEmployees);
router.put('/api/employee/:id', employeeController.updateEmployee);
router.delete('/api/employee/:id', employeeController.deleteEmployee);
module.exports = router;