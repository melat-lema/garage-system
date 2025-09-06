// controllers/vehicle.controller.js
const vehicleService = require('../services/vehicle.service');

async function createVehicle(req, res) {
  try {
    const { customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color } = req.body;

    // Validate required fields
    if (!customer_id || !vehicle_year || !vehicle_make || !vehicle_model) {
      return res.status(400).json({
        message: 'Customer ID, Year, Make, and Model are required'
      });
    }

    const result = await vehicleService.createVehicle({
      customer_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Vehicle created successfully',
      vehicle: result,
    });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create vehicle',
    });
  }
}

async function getVehicles(req, res) {
  try {
    const customerId = req.params.customerId;
    const vehicles = await vehicleService.getVehicles(customerId);
    
    return res.status(200).json({
      status: 'success',
      message: 'Vehicles fetched successfully',
      vehicles: vehicles,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch vehicles',
    });
  }
}

module.exports = {
  createVehicle,
  getVehicles,
};