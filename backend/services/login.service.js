const conn=require('../config/db.config');
const bcrypt = require('bcrypt');

const employeeService = require('../services/employee.service');

 
async function logIn(employeeData) {
    try {
        let returnData = {};
        // Check if employee exists
        const employee = await employeeService.getEmployeeByEmail(employeeData.employee_email);
        if (employee.length === 0) {
            returnData= { 
                status: 'fail',
                message: 'Employee does not exist' };
            return returnData;
        }
        const passwordMatch = await bcrypt.compare(employeeData.employee_password, employee[0].employee_password_hashed);
        if (!passwordMatch) {
            returnData = { 
                status: 'fail',
                message: 'Invalid password' };
            return returnData;
        }
        returnData={
            status: 'success',
            message: 'login sucess',
            data: employee[0],
        }
        return returnData;
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Rethrow the error to be handled by the controller
        
    }
}
module.exports = {
    logIn,      }