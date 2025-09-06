// services/vehicle.service.js (backend)
const conn = require('../config/db.config');

async function createVehicle(vehicle) {
  try {
    const query = `
      INSERT INTO customer_vehicle_info (
        customer_id, vehicle_year, vehicle_make, vehicle_model, 
        vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await conn.query(query, [
      vehicle.customer_id,
      vehicle.vehicle_year,
      vehicle.vehicle_make,
      vehicle.vehicle_model,
      vehicle.vehicle_type,
      vehicle.vehicle_mileage,
      vehicle.vehicle_tag,
      vehicle.vehicle_serial,
      vehicle.vehicle_color,
    ]);

    if (result.affectedRows !== 1) {
      throw new Error('Failed to insert vehicle');
    }

    return { vehicle_id: result.insertId };
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

async function getVehicles(customerId) {
  const query = `
    SELECT * FROM customer_vehicle_info 
    WHERE customer_id = ?
  `;
  const rows = await conn.query(query, [customerId]);
  return rows;
}

module.exports = {
  createVehicle,
  getVehicles,
};