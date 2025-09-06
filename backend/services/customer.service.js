const conn= require('../config/db.config');

async function checkIfCustomerExists(customerEmail) {
    const query = 'SELECT * FROM customer_identifier WHERE customer_email = ?';
    const rows = await conn.query(query, [customerEmail]);
   if(rows.length>0){
    return true
   }
   return false
}
//a function to create employee
async function createCustomer(customer) {
    let createdCustomer = {};
    try {
        const query = 'INSERT INTO customer_identifier (customer_email, customer_phone_number) VALUES (?, ?)';
        const rows = await conn.query(query, [customer.customer_email, customer.customer_phone_number]);
        if (rows.affectedRows !== 1) {
            return false; // Failed to create customer
        }
        const customer_id = rows.insertId; // Get the ID of the newly created customer
        const query2 = 'INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name) VALUES (?, ?, ?)';
        const rows2= await conn.query(query2, [customer_id, customer.customer_first_name, customer.customer_last_name]);
        if (rows2.affectedRows !== 1) {
            return false; // Failed to create customer info
        }
        
        createdCustomer = {

            customer_id: customer_id,
        };
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error; // Rethrow the error to be handled by the controller
    }
    return createdCustomer; // Return the created customer object

   
}
 async function getCustomerByEmail(customer_email) {
        const query = 'SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_email = ?';
        const rows = await conn.query(query, [customer_email]);
        return rows;
    }   
async function getCustomers() {
const query = `
  SELECT 
    ci.customer_id,
    ci.customer_email,
    ci.customer_phone_number,
    ci.customer_added_date,
    info.customer_first_name,
    info.customer_last_name,
    info.active_customer
    
  FROM customer_identifier ci
  JOIN customer_info info ON ci.customer_id = info.customer_id
`;    const rows = await conn.query(query);
  return rows;
}
async function updateCustomer(customer_id, customerData){
   try {
     if(customerData.active_customer !==undefined){
        const query= 'UPDATE customer_info SET active_customer=? WHERE Customer_id=?';
        await conn.query(query, [customerData.active_customer, customer_id]);

     }
        const query2='UPDATE customer_info SET customer_first_name = ?, customer_last_name = ? WHERE customer_id = ?';
        await conn.query(query2, [customerData.customer_first_name, customerData.customer_last_name, customer_id]);
        const query3='UPDATE customer_identifier SET customer_phone_number = ? WHERE customer_id = ?';
        await conn.query(query3, [customerData.customer_phone_number, customer_id]);
        return true;

   } catch (error) {
    console.error('Error updating customer:', error);
    throw error; // Rethrow the error to be handled by the controller
   }
    
}
module.exports={
    checkIfCustomerExists,
    createCustomer,
    getCustomerByEmail,
    getCustomers,
    updateCustomer
}