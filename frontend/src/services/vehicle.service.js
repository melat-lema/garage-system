const api_url = import.meta.env.VITE_API_URL;

async function createVehicle(customerId, vehicleData, token) {
  const requestOption = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      customer_id: customerId,
      ...vehicleData,
    }),
  };

  const response = await fetch(`${api_url}/api/vehicle`, requestOption);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}


async function getVehicles(customerId, token) {
  const response = await fetch(`${api_url}/api/vehicles/${customerId}`, {
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

  return response.json(); // { vehicles: [...] }
}

const vehicleService = {
  createVehicle,
  getVehicles
};

export default vehicleService;