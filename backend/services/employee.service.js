const conn=require('../config/db.config');
const bcrypt = require('bcrypt');
//a function to check if employee exists
async function checkIfEmployeeExists(employeeEmail) {      
    const query = 'SELECT * FROM employee WHERE employee_email = ?';
    const rows = await conn.query(query, [employeeEmail]);
   if(rows.length > 0){
        return true; // Employee exists
   }
   
    return false;
}

async function createEmployee(employee) {
    let createdEmployee={};
    try{
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(employee.employee_password,salt);
          const query = 'INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)';
            const rows = await conn.query(query, [employee.employee_email ,employee.active_employee]);
            if (rows.affectedRows !==1) {
                return false; 
            }
           const employee_id = rows.insertId; // Get the ID of the newly created employee
           const query2 = 'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)';
           const rows2 = await conn.query(query2, [employee_id, employee.employee_first_name, employee.employee_last_name, employee.employee_phone]);
           const query3= 'INSERT INTO employee_pass(employee_id, employee_password_hashed) VALUES (?, ?)';
           const rows3 = await conn.query(query3, [employee_id, hashedPassword]);
           const query4 = 'INSERT INTO employee_role(employee_id, company_role_id) VALUES (?, ?)';
           const rows4 = await conn.query(query4, [employee_id, employee.company_role_id]);
           //construct the employee object to return
           
           createdEmployee = {
                employee_id: employee_id,
              };
        }
    catch(error){
        console.error('Error hashing password:', error);
        throw error; // Rethrow the error to be handled by the controller
    }
    // Return the created employee object
    return createdEmployee;

}
//a function to get employee by email
async function getEmployeeByEmail(employee_email) {
    const query = 'SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?';
    const rows = await conn.query(query, [employee_email]);
    return rows;
}
    async function getEmployees() {
  const query =`
  SELECT 
    e.employee_id,
    e.employee_email,
    e.active_employee,
    e.added_date,
    ei.employee_first_name,
    ei.employee_last_name,
    ei.employee_phone,
    er.company_role_id
  FROM employee e
  INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
  INNER JOIN employee_role er ON e.employee_id = er.employee_id 
  ORDER BY e.employee_id DESC
`
;
  const rows = await conn.query(query);
  return rows;
}
async function updateEmployee(employee_id, employeeData){
  try {
    if(employeeData.active_employee !==undefined){
      const query='UPDATE employee SET active_employee = ? WHERE employee_id = ?';
      await conn.query(query, [employeeData.active_employee, employee_id]);
    }

    const query2='UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?';
    await conn.query(query2, [employeeData.employee_first_name, employeeData.employee_last_name, employeeData.employee_phone, employee_id]);
    if (employeeData.company_role_id !== undefined) {
            const queryRole = 'UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?';
            await conn.query(queryRole, [employeeData.company_role_id, employee_id]);
        }
    return true;
  } catch (error) {
    console.error('Error updating employee:', error);
        throw error;
  }

}
async function deleteEmployee(employee_id) {
    try {
        // Delete from dependent tables first (to avoid foreign key issues)
        await conn.query('DELETE FROM employee_pass WHERE employee_id = ?', [employee_id]);
        await conn.query('DELETE FROM employee_role WHERE employee_id = ?', [employee_id]);
        await conn.query('DELETE FROM employee_info WHERE employee_id = ?', [employee_id]);
        
        // Finally delete from main employee table
        const result = await conn.query('DELETE FROM employee WHERE employee_id = ?', [employee_id]);
        
        return result.affectedRows === 1; // true if deleted
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}
module.exports = {
    checkIfEmployeeExists,  
    createEmployee,
    getEmployeeByEmail,
    getEmployees,
    updateEmployee,
    deleteEmployee
};