// controllers/service.controller.js
const commonService = require('../services/service.service');



async function getServices(req, res) {
  try {
    const services = await commonService.getServices();
    return res.status(200).json({
      status: 'success',
      message: 'Services fetched successfully',
      services: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch services',
    });
  }
}
async function getService(req, res) {
  try {
    const s = await commonService.getServiceById(req.params.id);
    if (!s) return res.status(404).json({ status: 'fail', message: 'Service not found' });
    return res.status(200).json({ status: 'success', service: s });
  } catch (e) {
    console.error('Error fetching service:', e);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch service' });
  }
}
async function createService(req, res) {
  try {
    const { service_name, service_description } = req.body;

    if (!service_name || !service_name.trim()) {
      return res.status(400).json({
        message: 'Service name is required',
      });
    }

    const result = await commonService.createService({
      service_name: service_name.trim(),
      service_description: service_description || null,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Service created successfully',
      service: result,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create service',
    });
  }
}
async function updateService(req, res) {
  try {
    const ok = await serviceSvc.updateService(req.params.id, req.body);
    if (!ok) return res.status(404).json({ status: 'fail', message: 'Service not found' });
    return res.status(200).json({ status: 'success', message: 'Service updated successfully' });
  } catch (e) {
    console.error('Error updating service:', e);
    return res.status(500).json({ status: 'error', message: 'Failed to update service' });
  }
}
async function deleteService(req, res) {
  try {
    const serviceId = req.params.id;

    const deleted = await commonService.deleteService(serviceId);

    if (deleted) {
      return res.status(200).json({
        status: 'success',
        message: 'Service deleted successfully',
      });
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Service not found',
      });
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete service',
    });
  }
}

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};