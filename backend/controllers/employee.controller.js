
const employeeService = require('../services/employee.service');
//create the add employee controller
async function createEmployee(req, res, next) {
    //check if employee email exists in the database
    const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);
    if (employeeExists) {
        return res.status(400).json({
            message: 'Employee with this email already exists',
        });
    }
    else {
        try {
            const employeeData=req.body;
            const employee = await employeeService.createEmployee(employeeData);
            if (employee) {
                return res.status(200).json({
                    message: 'Employee created successfully',
                    
                });
            } else {
                return res.status(500).json({
                    message: 'Failed to create employee',
                });
            }
}
catch(error){
    console.log(error);
    return res.status(400).json({
        message: 'Something went wrong',
    });

}
    }
}
async function getEmployees(req, res) {
  try {
    const employees = await employeeService.getEmployees();
    return res.status(200).json({
      status: 'success',
      message: 'Employees fetched successfully',
       employees: employees  // Return the employees array,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch employees',
    });
  }
}
async function updateEmployee(req, res) {
    try {
        const employeeId = req.params.id;
        const employeeData = req.body;
        const updatedEmployee = await employeeService.updateEmployee(employeeId, employeeData);
        if (updatedEmployee) {
            return res.status(200).json({
                status: 'success',
                message: 'Employee updated successfully',
                data: updatedEmployee,
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found',
            });
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update employee',
        });
    }
}
async function deleteEmployee(req,res){
    try{
        const employeeId=req.params.id;
        const deleted=await employeeService.deleteEmployee(employeeId);
        if(deleted){
            return res.status(200).json({
                status:'success',
                message:'Employee deleted successfully'
            });
        }   else{
            return res.status(404).json({
                status:'fail',
                message:'Employee not found'
            });
        }       
    }catch(error){
        console.error('Error deleting employee:', error);
        return res.status(500).json({
            status:'error',
            message:'Failed to delete employee'
        });
    }
}
module.exports = {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
};