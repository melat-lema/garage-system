const loginService = require('../services/login.service');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
async function logIn(req, res, next) {
    try {
        console.log(req.body);
        const employeeData=req.body;
        const employee = await loginService.logIn(employeeData);
        if(employee.status === 'fail') {
            return res.status(403).json({
                message: employee.message,
            });
            console.log(employee.message);
        }
        const payload={
            //email, role and first name
            employee_id: employee.data.employee_id,
            employee_email: employee.data.employee_email,
            employee_role: employee.data.employee_role,
            employee_first_name: employee.data.employee_first_name,
        }
        // Generate JWT token
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
        const sendBack={
            employee_token: token,
            employee_role: payload.employee_role,
    employee_id: payload.employee_id,
    employee_first_name: payload.employee_first_name,
    employee_email: payload.employee_email,
        }
        return res.status(200).json({
            status: 'success',
            message: 'Employee logged in succesfully',
            data: sendBack,
        });
    } catch (error) {
        
    }
}
module.exports = {
    logIn,  }