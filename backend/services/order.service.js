// services/order.service.js
const conn = require("../config/db.config");
const crypto = require("crypto");

// Helper: generate a random hash for orders
function generateOrderHash() {
  return crypto.randomBytes(16).toString("hex");
}

// Create a new order
async function createOrder(orderData) {
  try {
    const orderHash = generateOrderHash();

    // 1. Insert into orders
    const orderQuery = `
      INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash)
      VALUES (?, ?, ?, ?, ?)
    `;
    const orderResult = await conn.query(orderQuery, [
      orderData.employee_id,
      orderData.customer_id,
      orderData.vehicle_id,
      1, // active_order = 1
      orderHash,
    ]);

    const order_id = orderResult.insertId;

    // 2. Insert into order_info
    const infoQuery = `
      INSERT INTO order_info (order_id, order_total_price, additional_request, additional_requests_completed)
      VALUES (?, ?, ?, ?)
    `;
    await conn.query(infoQuery, [
      order_id,
      orderData.order_total_price || 0,
      orderData.additional_request || null,
      0, // default not completed
    ]);

    // 3. Insert services if provided
    if (orderData.services && Array.isArray(orderData.services)) {
      for (const serviceId of orderData.services) {
        const serviceQuery = `
          INSERT INTO order_services (order_id, service_id, service_completed)
          VALUES (?, ?, ?)
        `;
        await conn.query(serviceQuery, [order_id, serviceId, 0]);
      }
    }

    // 4. Insert order status
    const statusQuery = `
      INSERT INTO order_status (order_id, order_status)
      VALUES (?, ?)
    `;
    await conn.query(statusQuery, [order_id, 0]); // 0 = Pending

    return { order_id, order_hash: orderHash };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Get all orders
// services/order.service.js
async function getOrders() {
  const query = `
    SELECT 
      o.order_id, 
      o.order_date,
      ci.customer_first_name, 
      ci.customer_last_name,
      c.customer_email,
      c.customer_phone_number ,
      v.vehicle_make, 
      v.vehicle_model, 
      v.vehicle_year,
      GROUP_CONCAT(os.service_completed) as service_statuses
    FROM orders o
    JOIN customer_identifier c ON o.customer_id = c.customer_id
    JOIN customer_info ci ON ci.customer_id = c.customer_id
    JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    JOIN order_services os ON o.order_id = os.order_id
    JOIN common_services s ON os.service_id = s.service_id
    GROUP BY o.order_id
    ORDER BY o.order_date DESC
  `;
  const rows = await conn.query(query);

  // Compute order status
  return rows.map(row => {
    const statuses = row.service_statuses.split(',').map(Number);
    let orderStatus = 0; // Received

    if (statuses.some(s => s === 1 || s === 2)) {
      orderStatus = 1; // In progress
    }
    if (statuses.every(s => s === 2)) {
      orderStatus = 2; // Completed
    }

    return {
      ...row,
      order_status: orderStatus
    };
  });
}

// Get order by ID
// services/order.service.js
async function getOrderById(order_id) {
  const orderQuery = `
    SELECT 
      o.order_id, o.order_date,
      ci.customer_first_name, ci.customer_last_name,
      c.customer_email, c.customer_phone_number,
      ci.active_customer,
      v.vehicle_id, v.vehicle_tag, v.vehicle_color, v.vehicle_serial,
      v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_mileage,
      ei.employee_first_name, ei.employee_last_name,
      oi.order_total_price, oi.additional_request, oi.additional_requests_completed,
      os.order_status
    FROM orders o
    JOIN customer_identifier c ON o.customer_id = c.customer_id
    JOIN customer_info ci ON ci.customer_id = c.customer_id
    JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id
    JOIN employee e ON o.employee_id = e.employee_id
    JOIN employee_info ei ON ei.employee_id = e.employee_id
    WHERE o.order_id = ?
  `;
  const rows = await conn.query(orderQuery, [order_id]);
  if (rows.length === 0) return null;

  const servicesQuery = `
    SELECT os.order_service_id, s.service_id, s.service_name, s.service_description, os.service_completed
    FROM order_services os
    JOIN common_services s ON os.service_id = s.service_id
    WHERE os.order_id = ?
  `;
  const services = await conn.query(servicesQuery, [order_id]);

  return { ...rows[0], services };
}
async function updateServiceStatus(order_service_id, status) {
  console.log("Updating service status:", order_service_id, status);
  // ✅ Validate input
  const id = parseInt(order_service_id);
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid service ID');
  }

  if (![0, 1, 2].includes(status)) {
    throw new Error('Invalid status. Must be 0, 1, or 2');
  }

  const query = `
    UPDATE order_services 
    SET service_completed = ? 
    WHERE order_service_id = ?
  `;
  const result = await conn.query(query, [status, id]);

  if (result.affectedRows === 0) {
    // ✅ Better error: was the ID wrong? or just no change?
    const [existing] = await conn.query(
      'SELECT order_service_id FROM order_services WHERE order_service_id = ?',
      [id]
    );

    if (existing.length === 0) {
      throw new Error(`Service with ID ${id} not found in database`);
    } else {
      throw new Error('Update failed: No rows were updated');
    }
  }

  return { success: true };
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateServiceStatus,
};
