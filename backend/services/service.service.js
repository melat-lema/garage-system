// services/common.service.js
const conn = require('../config/db.config');

async function getServices() {
  const query = 'SELECT * FROM common_services ORDER BY service_id DESC';
  const rows = await conn.query(query);
  return rows;
}
async function getServiceById(id) {
  const q = `SELECT * FROM common_services WHERE service_id = ?`;
  const rows = await conn.query(q, [id]);
  return rows[0] || null;
}
async function createService(service) {
  const { service_name, service_description } = service;
  const query = 'INSERT INTO common_services (service_name, service_description) VALUES (?, ?)';
  const result = await conn.query(query, [service_name, service_description]);

  if (result.affectedRows !== 1) {
    throw new Error('Failed to create service');
  }

  return { service_id: result.insertId };
}
async function updateService(id, data) {
  const q = `UPDATE common_services
             SET service_name = ?, service_description = ?
             WHERE service_id = ?`;
  const res = await conn.query(q, [
    data.service_name,
    data.service_description || null,
    id,
  ]);
  return res.affectedRows === 1;
}
async function deleteService(serviceId) {
  const query = 'DELETE FROM common_services WHERE service_id = ?';
  const result = await conn.query(query, [serviceId]);

  return result.affectedRows === 1;
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};