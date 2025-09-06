const OrderService = require("../services/order.service");

async function createOrder(req, res) {
  try {
    const result = await OrderService.createOrder(req.body);
    res.status(201).json({ 
      status: "success", 
      message: "Order created successfully",
      order_id: result.order_id 
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to create order" 
    });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await OrderService.getOrders();
    res.json({ status: "success",  orders });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch orders", error });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ status: "success", order: order });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch order", error });
  }
}

async function updateOrderService(req, res) {
  try {
    const { status } = req.body; // Expect: 0 or 1
    const orderServiceId = req.params.id;

    // Validate
    if (status === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required (0 = not completed, 1 = pending, 2 = completed)'
      });
    }

    if (![0, 1,2].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status must be 0 or 1 or 2'
      });
    }

    await OrderService.updateServiceStatus(orderServiceId, status);

    return res.json({
      status: 'success',
      message: 'Service status updated successfully'
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update service'
    });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderService
};
