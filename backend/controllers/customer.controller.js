const { get } = require('../routes/employee.routes');
const customerService = require('../services/customer.service');

async function createCustomer(req, res) {
    // Check if customer email exists in the database
    const customerExists = await customerService.checkIfCustomerExists(req.body.customer_email);
    if (customerExists) {
        return res.status(400).json({
            message: 'Customer with this email already exists',
        });
    }
    else{
    try {
        const customerData = req.body;
        const customer = await customerService.createCustomer(customerData);
        if (customer) {
            return res.status(200).json({
                message: 'Customer created successfully',
            });
        } else {
            return res.status(500).json({
                message: 'Failed to create customer',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something went wrong',
        });
    }
}
}
async function getCustomers(req, res) {
  try {
    const customer = await customerService.getCustomers();
    return res.status(200).json({
      status: 'success',
      message: 'Customer fetched successfully',
       customers: customer  // Return the employees array,
    });
  } catch (error) {
    console.error('Error fetching Customers:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch customers',
    });
  }
}
async function updateCustomer(req, res) {
    try {
        const customerId = req.params.id;
        const customerData = req.body;
        const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
        if (updatedCustomer) {
            return res.status(200).json({
                status: 'success',
                message: 'Customer inforation updated successfully',
                data: updatedCustomer,
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found',
            });
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update customer',
        });
    }
}
module.exports={
    createCustomer,
    getCustomers,
    updateCustomer
}