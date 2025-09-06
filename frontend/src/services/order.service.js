const api_url = import.meta.env.VITE_API_URL;

async function createOrder(orderData, token){
    const requestOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: JSON.stringify(orderData),
    };
    const response = await fetch(`${api_url}/api/orders`, requestOption);
    return response.json();
}
async function getOrders(token) {
  const response = await fetch(`${api_url}/api/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json(); // { status: 'success', customers: [...] }
}
async function getOrderById(id, token) {
  const response = await fetch(`${api_url}/api/orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json(); // { status: 'success', customers: [...] }
}

// src/services/order.service.js
async function updateServiceStatus(orderServiceId, status, token) {
  const response = await fetch(`${api_url}/api/order-services/${orderServiceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}
const orderService={
    createOrder,
    getOrders,
    getOrderById,
    updateServiceStatus,
}
export default orderService;